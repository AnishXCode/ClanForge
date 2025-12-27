import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "expo-router";
import ThemedLoader from "../ThemedLoader";

const UserOnly = ({ children }) => {
    const { user, authCheck } = useUser()
    const router = useRouter()

    useEffect(() => {
        if(authCheck && user === null) {
            router.replace('/login')
        }
    }, [user, authCheck])


    if(!authCheck || !user){
        return (    
            <ThemedLoader /> 
        )
    }

    return children;
}

export default UserOnly;