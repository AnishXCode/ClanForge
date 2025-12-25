import { useEffect } from "react";
import { useUser } from "../../contexts/useUser";
import { useRouter } from "expo-router";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";

const GuestOnly = ({ children }) => {
    const { user, authCheck } = useUser()
    const router = useRouter()

    useEffect(() => {
        if(authCheck && user !== null) {
           router.replace('/dashboard')
        }
    }, [user, authCheck])


    if(!authCheck || user){
        return (    
            <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ThemedText style={{ textTransform: 'uppercase', fontSize: 22}}>Loading...</ThemedText>
            </ThemedView>
            
        )
    }

    return children;
}

export default GuestOnly;