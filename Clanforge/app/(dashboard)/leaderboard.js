import { StyleSheet, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'

const leaderboard = () => {
  return (
    <ThemedView style={styles.page} > 
    < View style={styles.header}>
    <ThemedLogo style={styles.logo} header={true}/>
    {/* Need to add notification and friend request icons */}
    </View>
    <Spacer height={10}/>
    
    <ThemedCard style={styles.card} >
        <ThemedText title={true} style={[styles.user, { fontSize: 22}]}>Leaderboard</ThemedText>
        <ThemedText style={[styles.user, { fontSize: 18}]}>Player</ThemedText>
        <ThemedText style={styles.profile}>Bronze</ThemedText>
        
    </ThemedCard>
    </ThemedView>
  )
}

export default leaderboard

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
        width: 45.22
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
    }
})