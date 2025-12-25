import { StyleSheet, View } from 'react-native'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'

const dashboard = () => {
  return (
    <ThemedView style={styles.page} safe={true}> 
    < View style={styles.header}>
    <ThemedLogo style={styles.logo} />
    {/* Need to add notification and friend request icons */}
    </View> 
    <Spacer height={10}/>
    <ThemedText title={true} style={styles.welcome}>Welcome, </ThemedText>
    <ThemedText title={true} style={styles.user}>User</ThemedText>
    <Spacer height={20}/>
    <ThemedCard style={styles.card} >
        <ThemedText title={true} style={[styles.user, { fontSize: 22}]}>Your Status</ThemedText>
        <ThemedText style={[styles.welcome, { fontSize: 18}]}>Current Rankings</ThemedText>
        <ThemedText style={styles.body}>Bronze</ThemedText>
        <ThemedText style={styles.body}>Silver</ThemedText>   
        <ThemedText style={styles.body}>Gold</ThemedText>
    </ThemedCard>
    </ThemedView>
  )
}

export default dashboard

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
    welcome: {
        fontWeight: 600,
        fontSize: 26
    },
    body: {
        fontWeight: 500,
        fontSize: 16
    },
     card:{
        width: '90%',

     }
})