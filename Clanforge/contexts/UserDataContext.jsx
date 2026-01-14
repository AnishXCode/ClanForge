import { createContext, useState } from "react";
import { databases, appwriteConfig } from "../lib/appwrite";
import { Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

export const UserDataContext = createContext()

export function UserDataProvider({ children }) {
    const { user } = useUser()
    const [ users, setUsers] = useState([])
    const [userData, setUserData] = useState(null)

    let [localData, setLocalData] = useState({
        genrePreferences: [],
        avatar: ''
    })

    async function fetchUsers() {
        try {
            const allusers = await databases.listRows({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.TABLE_ID,
                queries: [
                    Query.notContains('$id', user.$id)
                ]
            })
            setUsers(allusers.rows)
        } catch( error) {
            console.log("error", error.message)
        }
    }

    async function fetchUserDataByID(id) {
        try {
            const userdata = await databases.getRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.TABLE_ID,
                rowId: id
            })
            setUserData(userdata)
            return userdata
        } catch( error ) {
            console.log(error.message)
        }
    }

    async function createUser(data) {
        try {
            const newuser = await databases.createRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.TABLE_ID,
                rowId: user.$id,
                data: {
                    ...data,
                    email: user.email,
                    gamerTag: user.name,
                },
                permissions: [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            })
            setUserData(newuser)
            return newuser
        } catch( error ) {
            console.log(error.message)
        }
    }

    async function updateUserData(data) {
        try {
            const updatedUser = await databases.updateRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.TABLE_ID,
                rowId: user.$id,
                data: {
                    ...data
                }
        })
        setUserData(updatedUser)
        return updatedUser
        } catch( error) {
            console.log(error.message)
        }
    }

    function updateDataLocal(newData){
        setLocalData(currentData => ({
            ...currentData,
            ...newData
        }))
    }

    return (
        <UserDataContext.Provider value={{ userData, fetchUserDataByID, fetchUsers, createUser, updateUserData, updateDataLocal, localData, users }}>
            {children}
        </UserDataContext.Provider>
    )
}