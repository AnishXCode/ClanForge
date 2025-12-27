import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "expo-router";
import ThemedLoader from "../ThemedLoader";

const GuestOnly = ({ children }) => {
    const { user, authCheck } = useUser()
    const router = useRouter()

    useEffect(() => {
        if(authCheck && user !== null) {
            if (!user.profile) {
                router.replace('/avatar');
            } else {
                router.replace('/dashboard')
            }
        }
    }, [user, authCheck])


    if(!authCheck || user){
        return (    
            <ThemedLoader />
        )
    }

    return children;
}

export default GuestOnly;