import { useContext } from "react"
import { AppDataContext } from "../contexts/AppDataContext"


export const useAppData = () => {
    const context = useContext(AppDataContext)

    if(!context) {
        throw new Error("useUser must be used within UserProvider")
    }

    return context;
}