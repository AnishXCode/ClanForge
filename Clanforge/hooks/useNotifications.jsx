import React, { useEffect, useState } from 'react'
import { useUser } from './useUser';
import { appwriteConfig, client, databases } from '../lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

const useNotifications = () => {
    const { user } = useUser()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    console.log("unreadd", unreadCount)

    const getNotifications = async () => {
        if (!user) return;
        try {
            const res = await databases.listRows({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.REQUEST_TABLE_ID,
                queries: [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt')
                ]
            })
            setNotifications(res.rows)
            setUnreadCount(res.rows.filter(req => !req.isRead).length)
        } catch (error) {
            console.log("Error fetching notifications: ", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            getNotifications();
        }
    }, [user]);


    useEffect(() => {
        if(!user) return;

        const channel = `databases.${appwriteConfig.DATABASE_ID}.tables.${appwriteConfig.REQUEST_TABLE_ID}.rows`
        console.log(channel)
        const unsubscribe = client.subscribe(channel, res => {
            console.log("in the unsubscrie: ", res)
            if (res.payload.userId === user.$id) {
                getNotifications();
            }   
        })

        return () => {
            unsubscribe();
        }
    }, [user])

    const markAsRead = async (reqId) => {
        try {
            await databases.updateRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.REQUEST_TABLE_ID,
                rowId: reqId,
                data: {
                    isRead: true
                }
            }
            );
            setNotifications(prev => prev.map(n => n.$id === reqId ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const sendRequest = async (data) => {
        try {
            const res = await databases.createRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.REQUEST_TABLE_ID,
                rowId: ID.unique(),
                data: data
            })
            return res;
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    return { notifications, unreadCount, markAsRead, loading, sendRequest}
}

export default useNotifications;