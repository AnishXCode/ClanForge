import { StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedCard from '../../components/ThemedCard'
import ThemedText from '../../components/ThemedText'
import useNotifications from '../../hooks/useNotifications'
import { Colours } from '../../constants/colours'
import Spacer from '../../components/Spacer'
import { useRouter } from 'expo-router'

const Notifications = () => {
  const router = useRouter();

  const { notifications, loading, markAsRead } = useNotifications()

  const handleNotifClick = async ( item ) => {
    try {
      if(!item.isRead) {
        await markAsRead(item.$id)
      }

      router.push({
        pathname: "/(navigation)/[id]", 
        params: { 
            id: item.$id,
            type: item.type,
            payload: item.payload
        } 
    })
    } catch (error) {
      console.log("error: ", error)
    }
  }


  const renderNotificationItem = ({ item }) => {
    const renderPayload = JSON.parse(item.payload)
    return (
      <TouchableOpacity onPress={() => handleNotifClick(item)} activeOpacity={0.9}>
        <ThemedCard style={[styles.card, !item.isRead && styles.unreadCard]}>
            <View style={styles.headerRow}>
                <ThemedText title={true} style={[styles.notificationTitle, !item.isRead && {color: '#000'}]}>{item.type.replace('_', ' ')}</ThemedText>
                {!item.isRead && <View style={styles.dot} />}
            </View>
            <ThemedText style={[styles.notificationMessage, {color: '#fff'}, !item.isRead && {color: '#000'}]}>{renderPayload.message}</ThemedText>
            
            {item.type === 'MATCH_INVITE' && (
                <ThemedText style={[styles.actionText, !item.isRead && {color: '#000'}]}>Tap To Join Squad</ThemedText>
            )}

            {item.type === 'FRIEND_REQUEST' && (
                <ThemedText style={[styles.actionText, !item.isRead && {color: '#000'}]}>Accept Request</ThemedText>
            )}
        </ThemedCard> 
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedText title={true} style={styles.title}>Notifications</ThemedText>
        <Spacer height={60} />
        <ActivityIndicator size={'large'}/>
    </ThemedView>
    )
  }

  if (!notifications[0] && !loading) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedText title={true} style={styles.title}>Notifications</ThemedText>
        <Spacer height={60} />
        <View style={styles.text}> 
        <ThemedText>No Notifications for you!</ThemedText>
        </View>
    </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
        <ThemedText title={true} style={styles.title}>Notifications</ThemedText>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.$id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
    </ThemedView>
  )
}

export default Notifications

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20, 
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 20, 
        marginBottom: 20,
    },
    listContent: {
      paddingBottom: 20, 
    },
    card: {
      padding: 20, 
      marginBottom: 15,
      borderRadius: 16,
      justifyContent: 'center', 
    },
    notificationTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    notificationMessage: {
      fontSize: 14,
    },
    unreadCard: { 
        backgroundColor: Colours.primary
    },
    headerRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 8 
    },
    actionText: {
      color: '#fff'
    },
    text: {
      justifyContent: 'center',
      alignItems: 'center'
    }
})