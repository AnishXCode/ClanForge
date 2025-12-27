import { createContext, useEffect, useState } from "react";
import { account, databases, appwriteConfig } from "../lib/appwrite"
import { ID } from "react-native-appwrite";


export const UserContext = createContext();

export function UserProvider ({ children }) {
    const [user, setUser] = useState(null)
    const [authCheck, setAuthCheck] = useState(false)

    async function fetchUserAndProfile() {
        try {
            const accountData = await account.get();
            console.log("Account Data: ", accountData)
            let profile = null
            try {
                profile = await databases.getRow({
                    databaseId: appwriteConfig.DATABASE_ID,
                    tableId: appwriteConfig.TABLE_ID,
                    rowId: accountData.$id
                })
                console.log(profile)
            } catch (error) {
                console.log("Profile not found (New User),", error);
            }
            setUser({ ...accountData, profile: profile });

        } catch (error) {
            setUser(null);
        } finally {
            setAuthCheck(true);
        }
    }

    async function login(email, password) {
        try {
            await account.createEmailPasswordSession({email, password});
            await fetchUserAndProfile();
        } catch (error) {
            throw error;
        }
    }

    async function signup(email, password, username) {
        try {
            await account.create({
                userId: ID.unique(),
                email: email,
                password: password,
                name: username,
            })
            await login(email, password)
        } catch (error) {
            throw error;
        }
    }

    async function logout() {
        try{
            await account.deleteSession({sessionId: "current"})
            setUser(null)
        } catch (error) {
            console.log(error.message)
        }    
    }

    async function getInitialUser() {
        fetchUserAndProfile();
    }

    useEffect(() => {
        getInitialUser()
    }, [])

    return(
        <UserContext.Provider value={{ user, login, signup, logout, authCheck }}>
            {children}
        </UserContext.Provider>
    )
}
