import { StyleSheet, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import Person from '../../assets/person.png'
import { useUserData } from '../../hooks/useUserData'
import { Colours } from '../../constants/colours'
import ThemedLoader from '../../components/ThemedLoader'
import Friends from '../../components/friends'
import ThemedSearchBar from '../../components/SearchBar'
import useNotifications from '../../hooks/useNotifications'

const AddFriends = () => {
  const { users, userData } = useUserData()
  const { sendRequest } = useNotifications()
  const [notAddedFriends, setNotAddedFriends] = useState([])
  const [visibleCards, setVisibleCards] = useState(6)

  useEffect(() => {
    if(!userData || !users) return;

    const allfriends = JSON.parse(userData?.friends || '[]');
    const allfriendsID = allfriends.map(friend => friend.$id)

    const filteredUsers = users.filter(friend => {
      const isAlreadyFriend = allfriendsID.includes(friend.$id)
      const currentUser = friend.$id === userData.$id
      return !isAlreadyFriend && !currentUser
    })

    setNotAddedFriends(filteredUsers)
  },[userData?.friends, users])

  const handleSeeMore = () => {
    setVisibleCards(prev => prev + 6); 
  }

  const handleAddFriend = async (data) => {
    try {
      const existing = JSON.parse(userData.friends || '[]');
      const alreadyFriend = existing.filter(user => user.$id === data.$id)
      
      if(!alreadyFriend) {
        Alert.alert(`${data.gamerTag} is already your friend!`)
        return;
      }

      const update = {
        userId: data.$id,
        isRead: false,
        type: "FRIEND_REQUEST",
        payload: JSON.stringify({
          message: `${userData.$id} wants you add you as friend. Do you want to accept?`,
          requestedUserId: userData.$id,
          userName: userData.gamerTag,
          userRank: userData.rank,
          userAvatar: userData.avatar,
          userStatus: userData.isActive
        })
      }

      sendRequest(update)
      Alert.alert(`Successfully sent friend request to ${data.gamerTag}`)
    } catch (error) {
      Alert.alert(`Failed to add ${data.gamerTag}: `, error.message)
    }
    
  }

  const handleReport = (data) => {
    Alert.alert("Person Reported!")
    const updatedList = notAddedFriends.filter(user => user.$id !== data.$id)
    setNotAddedFriends(updatedList);
  }

  const generateFriendsCard = (item) =>{
    console.log(item, "item")
    const data = item.item
    console.log(data, "data")
    return (
      <ThemedCard style={styles.card}>
        <View style={styles.cardHeader}>
          {data.avatar ? (
            <Image source={{ uri: data.avatar }} style={styles.avatar} />
          ) : (
            <Image source={Person} style={styles.avatar} />
          )}

          <View style={styles.infoContainer}>
            <ThemedText title={true} style={styles.userName} numberOfLines={1}>
              {data.gamerTag || "PLAYER"}
            </ThemedText>
            <ThemedText style={styles.userRank}>
              {data.rank || "BRONZE 3"}
            </ThemedText> 
          </View>
        </View>

        <View style={styles.buttonsRow}>
           <TouchableOpacity onPress={() => {handleReport(data)}} style={[styles.actionButton, styles.reportBtn]}>
              <ThemedText style={[styles.btnText, {color: '#fff'}]}>REPORT</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {handleAddFriend(data)}} style={[styles.actionButton, styles.addBtn]}>
              <ThemedText style={styles.btnText}>ADD</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>
    )
  }

  const renderFooter = () => {
    return (
    <View style={{ marginBottom: 40 }}>
        <View style={styles.footerContainer}>
          {visibleCards < notAddedFriends.length && (
            <TouchableOpacity onPress={handleSeeMore}>
              <ThemedText style={styles.viewMoreText}>VIEW MORE...</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSheetContainer}>
          <Friends />
        </View>
    </View>
    )
  }

  if(!notAddedFriends) return <ThemedLoader />

  return (
    <ThemedView safe={true} style={styles.page}>
        <View style={styles.headerContainer}>
           <ThemedText title={true} style={styles.title}>ADD FRIENDS</ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <ThemedSearchBar />
        </View>

        <FlatList
          data={notAddedFriends.slice(0, visibleCards)}
          renderItem={generateFriendsCard}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />

    </ThemedView>
  )
}

export default AddFriends

const styles = StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: 20,
    },
    headerContainer: {
      marginTop: 20,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    searchContainer: {
      marginBottom: 20,
    },
    card: {
      width: '48%',
      borderRadius: 16,
      padding: 12,
      display: 'flex',
      flexDirection: 'column'
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      marginRight: 10,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    userName: {
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    userRank: {
      fontSize: 10,
      marginTop: 2,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    actionButton: {
      flex: 1, 
      paddingVertical: 6,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reportBtn: {
      backgroundColor: Colours.warning,
    },
    addBtn: {
      backgroundColor: Colours.success, 
    },
    btnText: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    gridRow: {
      justifyContent: 'space-between', 
      marginBottom: 15,
    },
    footerContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    viewMoreText: {
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    bottomSheetContainer: {
      marginBottom: 40
    },
})