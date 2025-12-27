import { useContext } from "react";
import { UserDataContext } from "../contexts/UserDataContext";

export function useUserData() {
    const context = useContext(UserDataContext);

    if(!context) {
        throw new Error("useUser must be used within UserProvider")
    }

    return context;
}