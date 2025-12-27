import { StyleSheet, View } from 'react-native'
import { useUser } from '../../hooks/useUser'
import { useState } from 'react'
import { Colours } from '../../constants/colours'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

const profile = () => {
    const { user, logout } = useUser()
    const [error, setError] = useState(null)

    const handleLogout = async () => {
        setError(null)

        try {
           await logout();
        } catch (error) {
            setError(error.message)
        }
       
    }
    if(!error) {
      return (
        <ThemedView style={styles.page} > 
        < View style={styles.header}>
        <ThemedLogo style={styles.logo} header={true}/>
        {/* Need to add notification and friend request icons */}
        </View>
        <Spacer height={80}/>
    
        <ThemedCard style={styles.card} >
            <ThemedText title={true} style={[styles.user, { fontSize: 22}]}>Profile</ThemedText>
            <ThemedText style={[styles.user, { fontSize: 18}]}>Email: {user.email}</ThemedText>
            <ThemedText style={styles.profile}>Bronze</ThemedText>
        
        </ThemedCard>
        <Spacer />

        <ThemedButton style={styles.btn} onPress={handleLogout}>
            <ThemedText style={styles.logout} title={true}>Logout</ThemedText>
        </ThemedButton>
        </ThemedView>
      )
    } else {
        return (
            <Text style={styles.error}>{error}</Text>
        )
    }
  
}

export default profile

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    logo: {
        height: 40,
        width: 45.22,
        
    },
    user: {
        fontWeight: 700,
        fontSize: 26
    },
    profile: {
        fontWeight: 600,
        fontSize: 26
    },
    body: {
        fontWeight: 500,
        fontSize: 16
    },
    error: {
        color: Colours.warning,
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f5c1c8',
        borderColor: Colours.warning,
        borderWidth: 1,
        borderRadius: 6,
        marginHorizontal: 10,
        width: '90%'
    },
    logout: {
        color: Colours.primaryTextColour,
        fontSize: 18,
        fontWeight: 600
    },
    card: {
        width: '85%'
    },
    
})