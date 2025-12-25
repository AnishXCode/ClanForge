import { createContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite"
import { ID } from "react-native-appwrite"


export const UserContext = createContext();

export function UserProvider ({ children }) {
    const [user, setUser] = useState(null)
    const [authCheck, setAuthCheck] = useState(false)

    async function login(email, password) {
        try {
            await account.createEmailPasswordSession({email, password})
            const response = await account.get()
            setUser(response)
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
        try {
            const response = await account.get()
            setUser(response)
        } catch (error) {
            setUser(null)
        } finally {
            setAuthCheck(true)
        }
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
