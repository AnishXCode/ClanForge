import { Client, Account, Avatars } from 'react-native-appwrite'

export const client = new Client()
        .setProject("694bec8c0024d1f97ccc")
        .setEndpoint("https://fra.cloud.appwrite.io/v1")


export const account = new Account(client)
export const avatars = new Avatars(client)