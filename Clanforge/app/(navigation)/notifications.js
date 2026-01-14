import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Person from '../../assets/person.png'
import { useUserData } from '../../hooks/useUserData'
import { Colours } from '../../constants/colours'

const Notifications = () => {

  const { users, userData } = useUserData()
  const [notAddedFriends, setNotAddedFriends] = useState([])

//   useEffect(() => {
//     if(!userData || !users) return;

//     const allfriends = userData?.friends || [];

//     const filteredUsers = users.map(friend => {
      
//       const isAlreadyFriend = allfriends.includes(friend.$id)

//       const currentUser = friend.$id === userData.$id

//       return !isAlreadyFriend && !currentUser;
//     })

//     console.log(filteredUsers)

//     setNotAddedFriends(filteredUsers)

//   },[userData?.friends, users])

  const generateFriendsCard = ({ item }) =>{
    return (
      <ThemedCard>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarLarge} />
          ) : (
          <Image source={Person} style={styles.avatarLarge}/>
          )}

          <ThemedText title={true} >{item.gamerTag}</ThemedText>
          <ThemedText>{item.rank}</ThemedText>
        </View>
        <View style={styles.buttons}>
           <TouchableOpacity style={[
            styles.actionButton, 
            { backgroundColor: Colours.warning },
            ]}>
              <ThemedText style={[styles.actionButtonText, {color: '#fff'}]}>Report</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[
            styles.actionButton, 
            { backgroundColor: Colours.success },
            ]}>
              <ThemedText style={styles.actionButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    )
  }
  return (
    <ThemedView safe={true} >
        <ThemedText title={true} style={styles.title}>Add Friends</ThemedText>
          {/* SearchBar code */}
        {/* <FlatList
          data={[...notAddedFriends]}
          renderItem={generateFriendsCard}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        /> */}

    </ThemedView>
  )
}

export default Notifications

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    avatarContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginRight: 25,
    },
    avatarLarge: {
      width: 50,
      height: 50,
      borderRadius: 30,
      backgroundColor: Colours.primary,
      border: 2,
      borderColor: "#000"
    },
    buttons: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      gap: 10,
    },
    actionButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    actionButtonText: {
      fontSize: 11,
      fontWeight: '700',
      color: Colours.primaryTextColour,
      textTransform: 'uppercase',
    },
    row: {
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20
  },
})