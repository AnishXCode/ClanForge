import { createContext, useState } from "react";
import { databases } from "../lib/appwrite";
import { appwriteConfig } from "../lib/appwrite";


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

    return (
            <AppDataContext.Provider value={{ games, fetchAllGames }}>
                {children}
            </AppDataContext.Provider>
        )
}

