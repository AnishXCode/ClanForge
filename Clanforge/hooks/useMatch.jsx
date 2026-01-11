import { useEffect, useState } from "react";
import { databases, appwriteConfig, client } from "../lib/appwrite";


export const useMatch = (lobbyId) => {
    const [loading, setLoading] = useState(true)
    const [match, setMatch] = useState(null)

    useEffect(() => {
        if (!lobbyId) return;

        const fetchMatch = async () => {
            try {
                const response = await databases.getRow({
                    databaseId: appwriteConfig.DATABASE_ID,
                    tableId: appwriteConfig.LOBBY_TABLE_ID,
                    rowId: lobbyId
                });
                setMatch(response);
            } catch (error) {
                console.error("Error fetching match:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();

        const unsubscribe = client.subscribe(
            `databases.${appwriteConfig.DATABASE_ID}.collections.${appwriteConfig.LOBBY_TABLE_ID}.documents.${lobbyId}`,
                (response) => {
                    if (response.events.includes("databases.*.collections.*.documents.*.update")) {
                    setMatch(response.payload);
                }
                }
        );

        return () => {
            unsubscribe()
        }

        }, [lobbyId])

        const updateGameState = async (data) => {
            await databases.updateRow({
                databaseId: appwriteConfig.DATABASE_ID, 
                tableId: appwriteConfig.LOBBY_TABLE_ID, 
                rowId: lobbyId, 
                data});
        };

        return { match, loading, updateMatchStatus };

}