import { createContext, useState } from "react";
import { databases } from "../lib/appwrite";
import { appwriteConfig } from "../lib/appwrite";
import { Query } from "react-native-appwrite";


export const AppDataContext = createContext();

export function AppDataProvider({ children }) {

    const [games, setGames] = useState([])

    async function fetchAllGames() {
        const games = await databases.listRows({
            databaseId: appwriteConfig.DATABASE_ID,
            tableId: appwriteConfig.GAMES_TABLE_ID,
        })
        setGames(games)
    }

    async function fetchGameInLobby(gameId) {
        const game = await databases.listRows({
            databaseId: appwriteConfig.DATABASE_ID,
            tableId: appwriteConfig.LOBBY_TABLE_ID,
            queries: [
                Query.equal('gameStatus', 'waiting'),
                Query.equal('gameId', gameId),
                Query.limit(1)
            ]
        })
        return game;
    }

    return (
            <AppDataContext.Provider value={{ games, fetchAllGames, fetchGameInLobby }}>
                {children}
            </AppDataContext.Provider>
        )
}

