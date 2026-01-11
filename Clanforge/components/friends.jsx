import { StyleSheet, useColorScheme, View, TouchableOpacity, Image, Modal, Pressable, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Colours } from '../constants/colours';
import Person from '../assets/person.png'
import ThemedText from './ThemedText';
import ThemedCard from './ThemedCard';
import ThemedLoader from './ThemedLoader'
import { useUserData } from '../hooks/useUserData';
import { useUser } from '../hooks/useUser';



const Friends = () => {

    const { updateUserData } = useUserData();
    const { userData } = useUserData()
    const [mockFriends, setMockFriends] = useState([
      { id: 1, name: 'PLAYER 1', rank: 'BRONZE 2', status: 'ONLINE', action: 'INVITE' },
      { id: 2, name: 'PLAYER 2', rank: 'GOLD 3', status: 'ONLINE\n10 MINS AGO', action: 'INVITE' },
      { id: 3, name: 'PLAYER 3', rank: 'SILVER 1', status: 'INGAME', action: 'SPECTATE' },
      { id: 4, name: 'PLAYER 3', rank: 'SILVER 1', status: 'INGAME', action: 'SPECTATE' },
      { id: 5, name: 'PLAYER 3', rank: 'SILVER 1', status: 'INGAME', action: 'SPECTATE' },
    ]);

    const [allFriends, setAllFriends] = useState(null)

    useEffect(() => {
      if(userData?.friends){
        const friends = JSON.parse(userData.friends)
        setAllFriends(friends)
        console.log(friends)
      } else {
        setAllFriends([])
      }
    }, [userData])

    const colourScheme = useColorScheme();
    const theme = Colours[colourScheme] ?? Colours.light;

    const [visibleCount, setVisibleCount] = useState(3)
    const [selectedFriend, setSelectedFriend] = useState(null)

    const handleChat = () => {
        Alert.alert("Working on chat!")
        setSelectedFriend(null)
    }

    const handleUnfriend = () => {
      Alert.alert("Unfriend", `Are you sure you want to remove ${selectedFriend.name}?`, [
            { text: "Cancel", style: "cancel", onPress: () => setSelectedFriend(null) },
            { text: "Remove", style: "destructive", onPress: () => removeFriend(selectedFriend) }
        ]);
    }

    const removeFriend = async (selectedFriend) => {
      try{
        const newFriendList = allFriends.filter(f => f !== selectedFriend)
        
        const newFriendListString = JSON.stringify(newFriendList)
        const response = await updateUserData({
          friends: newFriendListString
        })
        setAllFriends(newFriendList)
        if(response) {
          Alert.alert(`Succesfully removed ${selectedFriend.name}`)
        }
      } catch (error) {
        console.log('error removing friend: ', error)
        Alert.alert(`Failed to remove ${selectedFriend.name}`, error.message)
      } finally {
        setSelectedFriend(null)
      }
    }

    const handleSeeMore = () => {
        setVisibleCount(prevCount => prevCount + 3)
    }

    if(allFriends === null) {
      return(
        <>
        <ThemedText title={true} style={styles.sectionTitle}>friends</ThemedText>
        <ThemedCard style={[styles.card, styles.friendsCard]} >
          <ThemedLoader />
        </ThemedCard>
        </>
      )
    }

    if(allFriends.length === 0) {
      return(
        <>
        <ThemedText title={true} style={styles.sectionTitle}>friends</ThemedText>
        <ThemedCard style={[styles.card, styles.friendsCard]} >
          <ThemedText style={{textAlign: 'center'}}>No friends added yet!</ThemedText>
        </ThemedCard>
        </>
      )
    }

    const visibleFriends = allFriends.slice(0, visibleCount);
  return (
    <>
    <ThemedText title={true} style={styles.sectionTitle}>friends</ThemedText>
            <ThemedCard style={[styles.card, styles.friendsCard]} >
               {visibleFriends.map((friend, index) => (
                
                 <View key={friend.id}>
                   <View style={styles.friendRow}>
                    <TouchableOpacity 
                        key={friend.id} 
                        onPress={() => setSelectedFriend(friend)}
                        activeOpacity={0.7}
                    >
                      <View style={styles.friendAvatarContainer}>
                         <Image source={Person} style={[styles.avatarSmall, styles.friendAvatarPlaceholder]} />
                         <View style={[
                           styles.statusDot, 
                           { backgroundColor: friend.status.includes('ONLINE') ? Colours.success : Colours.warning,
                            borderColor: theme.border
                           } 
                         ]} />
                      </View>
                      </TouchableOpacity>

                      <View style={styles.friendInfo}>
                          <ThemedText style={styles.friendName}>{friend.name}</ThemedText>
                          <ThemedText style={styles.friendRank}>{friend.rank}</ThemedText>
                      </View>

                      <View style={styles.friendStatusBlock}>
                        <ThemedText style={styles.friendStatusText}>{friend.status}</ThemedText>
                      </View>

                      <TouchableOpacity style={[
                        styles.actionButton, 
                        friend.action === 'SPECTATE' ? styles.btnSpectate : styles.btnInvite,
                        { backgroundColor: friend.status === 'ONLINE' || friend.action === 'SPECTATE' ? Colours.success : "#BCCCDC" },
                      ]}>
                          <ThemedText style={styles.actionButtonText}>{friend.action}</ThemedText>
                      </TouchableOpacity>
                   </View>
                   {index < allFriends.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
                 </View>
               ))}
               { visibleCount < allFriends.length ? <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreBtn}>
                  <ThemedText style={styles.seeMoreText}>SEE MORE</ThemedText>
               </TouchableOpacity> : <></>}

            </ThemedCard>

            <Modal 
              visible={selectedFriend !== null}
              animationType='fade'
              transparent={true}
              onRequestClose={() => setSelectedFriend(null)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setSelectedFriend(null)}>
                    <View style={styles.menuContainer}>
                        {selectedFriend && (
                            <ThemedText style={styles.menuHeader}>{selectedFriend.name}</ThemedText>
                        )}
                        <TouchableOpacity style={styles.menuOption} onPress={handleChat}>
                            <ThemedText style={styles.menuText}>CHAT</ThemedText>
                        </TouchableOpacity>
                        <View style={styles.menuSeparator} />
                        <TouchableOpacity style={styles.menuOption} onPress={handleUnfriend}>
                            <ThemedText style={styles.menuText}>UNFRIEND</ThemedText>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
    </>
  )
}

export default Friends

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    friendsCard: {
      paddingVertical: 15,
      paddingHorizontal: 20,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    friendAvatarContainer: {
      position: 'relative',
      marginRight: 15,
    },
    avatarSmall: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    friendAvatarPlaceholder: {
      backgroundColor: Colours.success,
    },
    statusDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
    },
    friendInfo: {
      flex: 2,
    },
    friendName: {
      fontWeight: '700',
      fontSize: 16,
    },
    friendRank: {
      fontSize: 12,
      opacity: 0.7,
    },
    friendStatusBlock: {
      flex: 2,
      alignItems: 'flex-start',
    },
    friendStatusText: {
      fontSize: 11,
      fontWeight: '700',
      opacity: 0.6,
      textTransform: 'uppercase',
    },
    actionButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      minWidth: 80,
      alignItems: 'center',
    },
    btnInvite: { },
    btnSpectate: { 
      backgroundColor: Colours.success
    },
    actionButtonText: {
      fontSize: 11,
      fontWeight: '700',
      color: Colours.primaryTextColour,
      textTransform: 'uppercase',
    },
    divider: {
      height: 1,
      width: '100%',
      opacity: 0.1,
    },
    seeMoreBtn: {
      alignItems: 'center',
      marginTop: 15,
      width: '100%'
    },
    seeMoreText: {
      fontSize: 13,
      fontWeight: '700',
      opacity: 0.6,
      textTransform: 'uppercase',
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuContainer: {
        width: 180,
        backgroundColor: 'rgba(60, 60, 60, 0.95)',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuHeader: {
        fontSize: 12,
        opacity: 0.5,
        marginBottom: 5,
        textTransform: 'uppercase',
        color: 'white'
    },
    menuOption: {
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
    },
    menuText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    menuSeparator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: '90%',
    },
})