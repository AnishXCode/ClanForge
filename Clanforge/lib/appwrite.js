import { Client, Account, TablesDB, Storage } from 'react-native-appwrite'

export const client = new Client()
        .setProject("694bec8c0024d1f97ccc")
        .setEndpoint("https://fra.cloud.appwrite.io/v1")

export const appwriteConfig ={
        PROJECT_ID: "694bec8c0024d1f97ccc",
        DATABASE_ID: "694d834e00043837d594",
        TABLE_ID: "users",
        BUCKET_ID: "694e89ee0001c7a5501a",
        GAMES_TABLE_ID: "games"
}


export const account = new Account(client)
export const databases = new TablesDB(client)
export const storage = new Storage(client)