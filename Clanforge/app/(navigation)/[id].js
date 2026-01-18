import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer' 
import { Colours } from '../../constants/colours'

import { databases, appwriteConfig } from '../../lib/appwrite'; 
import { ID } from 'react-native-appwrite';
import { useUser } from '../../hooks/useUser';

const NotificationPage = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useUser()

    const { id, type, payload } = params;
    const parsedPayload = payload ? JSON.parse(payload) : {};

    console.log(parsedPayload, "parsed")
    console.log(payload, "payload")
    
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            if (type === 'MATCH_INVITE') {
                console.log("Joining Lobby:", parsedPayload.lobbyId);
                router.replace({ pathname: "/(game)/[id]", params: { id: parsedPayload.lobbyId }});
            } 
            else if (type === 'FRIEND_REQUEST') {
                try {
                    const existing = JSON.parse(user.friends || '[]');

                    await databases.createRow({
                        databaseId: appwriteConfig.DATABASE_ID,
                        tableId: appwriteConfig.REQUEST_TABLE_ID,
                        rowId: ID.unique(),
                        data: {
                            userId: parsedPayload.requestedUserId,
                            isRead: false,
                            type: "FRIEND_ACCEPT",
                            payload: JSON.stringify({
                                userId: user.$id,
                                userName: user.gamerTag,
                                userRank: user.rank,
                                userAvatar: user.avatar,
                                status: "success",
                                message: "Friend Request accepted!",
                                userStatus: user.isActive
                            })
                        }
                    })

                    const newFriendList = [...existing, {
                        $id: parsedPayload.requestedUserId,
                        gamerTag: parsedPayload.userName,
                        rank: parsedPayload.userRank,
                        avatar: parsedPayload.userAvatar,
                        status: parsedPayload.isActive
                    }]
                    
                    await databases.updateRow({
                        databaseId: appwriteConfig.DATABASE_ID,
                        tableId: appwriteConfig.TABLE_ID,
                        rowId: user.$id,
                        data: {
                          friends: JSON.stringify(newFriendList)
                        }
                    })

                    await handleDelete();
                } catch (error) {
                    console.error(error, "error")
                }
                console.log("Accepting Friend:", parsedPayload.senderId);
                Alert.alert("Success", "Friend Request Accepted!");
                await handleDelete();   
            }
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async () => {

        const message = type === "MATCH_INVITE" ? "Your Match Invite has been rejected!" : "Your Friend Request has been rejected!"
        Alert.alert("Reject", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Reject", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await databases.createRow({
                            databaseId: appwriteConfig.DATABASE_ID,
                            tableId: appwriteConfig.REQUEST_TABLE_ID,
                            rowId: ID.unique(),
                            data: {
                                userId: parsedPayload.requestedUserId,
                                isRead: false,
                                type: type === "MATCH_INVITE" ? "MATCH_ACCEPT" : "FRIEND_ACCEPT",
                                payload: JSON.stringify({
                                    userId: user.$id,
                                    userName: user.gamerTag,
                                    status: "failed",
                                    message: message
                                })
                            }
                        })
                        await handleDelete();
                    } catch (error) {
                        console.error(error, "error")
                    }
                }
            }
        ]);
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await databases.deleteRow({
                databaseId: appwriteConfig.DATABASE_ID,
                tableId: appwriteConfig.REQUEST_TABLE_ID,
                rowId: id
            });
            router.back();
        } catch (e) {
            console.error("Delete failed", e);
            Alert.alert("Error", "Could not delete notification");
            setLoading(false);
        }
    }

    const handleAddFriend = async (data) => {
        const existing = JSON.parse(user.friends || '[]');
        const newFriendList = [...existing, {
            $id: data.userId,
            gamerTag: data.userName,
            rank: data.userRank,
            avatar: data.userAvatar,
            status: data.userStatus || "offline"
        }]
            
        await databases.updateRow({
            databaseId: appwriteConfig.DATABASE_ID,
            tableId: appwriteConfig.TABLE_ID,
            rowId: user.$id,
            data: {
              friends: JSON.stringify(newFriendList)
            }
        })
    }

    const renderContent = () => {
        switch (type) {
            case 'MATCH_INVITE':
                if(parsedPayload.status === "failed") {
                  <View style={styles.actionContainer}>
                          <ThemedText style={styles.subText}>
                              {parsedPayload.message}
                          </ThemedText>
                          <Spacer height={20} />
                          <View style={styles.buttonRow}>
                              <ThemedButton 
                                  style={[styles.btn, styles.btnAccept]} 
                                  onPress={handleDelete}
                                  disabled={loading}
                              >
                                  <ThemedText style={styles.btnText}>OK</ThemedText>
                              </ThemedButton>
                          </View>
                      </View>

                } else {
                    return (
                      <View style={styles.actionContainer}>
                          <ThemedText style={styles.subText}>
                              {parsedPayload.message}
                          </ThemedText>
                          <Spacer height={20} />
                          <View style={styles.buttonRow}>
                              <ThemedButton 
                                  style={[styles.btn, styles.btnReject]} 
                                  onPress={handleReject}
                                  disabled={loading}
                              >
                                  <ThemedText style={styles.btnText}>REJECT</ThemedText>
                              </ThemedButton>

                              <ThemedButton 
                                  style={[styles.btn, styles.btnAccept]} 
                                  onPress={handleAccept}
                                  disabled={loading}
                              >
                                  <ThemedText style={styles.btnText}>ACCEPT</ThemedText>
                              </ThemedButton>
                          </View>
                      </View>
                    );
                }

            case 'FRIEND_REQUEST':

                if(parsedPayload.status === "failed") {
                  return (
                    <View style={styles.actionContainer}>
                        <ThemedText style={styles.subText}>
                            {parsedPayload.message}
                        </ThemedText>
                        <Spacer height={20} />
                        <View style={styles.buttonRow}>                        
                            <ThemedButton 
                                style={[styles.btn, styles.btnAccept]} 
                                onPress={handleDelete}
                                disabled={loading}
                            >
                                <ThemedText style={styles.btnText}>OK</ThemedText>
                            </ThemedButton>
                        </View>
                    </View>
                );
                } else {
                  return (
                    <View style={styles.actionContainer}>
                        <ThemedText style={styles.subText}>
                            {parsedPayload.message}
                        </ThemedText>
                        <Spacer height={20} />
                        <View style={styles.buttonRow}>
                            <ThemedButton 
                                style={[styles.btn, styles.btnReject]} 
                                onPress={handleReject}
                                disabled={loading}
                            >
                                <ThemedText style={styles.btnText}>IGNORE</ThemedText>
                            </ThemedButton>

                            <ThemedButton 
                                style={[styles.btn, styles.btnAccept]} 
                                onPress={handleAccept}
                                disabled={loading}
                            >
                                <ThemedText style={styles.btnText}>CONFIRM</ThemedText>
                            </ThemedButton>
                        </View>
                    </View>
                  );
                }

            case 'FRIEND_ACCEPT':
                if(parsedPayload.status === "success") {
                    handleAddFriend(parsedPayload)
                    return(
                        <View style={styles.actionContainer}>
                            <ThemedText style={styles.subText}>
                                {parsedPayload.message}
                            </ThemedText>
                            <Spacer height={20} />
                            <ThemedButton onPress={() => router.back()} style={styles.btnSystem}>
                                <ThemedText style={styles.btnText}>OK, GOT IT</ThemedText>
                            </ThemedButton>
                        </View>
                    )
                } else {
                    return(
                        <View style={styles.actionContainer}>
                            <ThemedText style={styles.subText}>
                                {parsedPayload.message}
                            </ThemedText>
                            <Spacer height={20} />
                            <ThemedButton onPress={() => router.back()} style={styles.btnSystem}>
                                <ThemedText style={styles.btnText}>OK, GOT IT</ThemedText>
                            </ThemedButton>
                        </View>
                    )
                }

            case 'SYSTEM':
            case 'EVENT':
            default:
                return (
                    <View style={styles.actionContainer}>
                        <ThemedText style={styles.subText}>
                            {parsedPayload.message}
                        </ThemedText>
                        <Spacer height={20} />
                        <ThemedButton onPress={() => router.back()} style={styles.btnSystem}>
                             <ThemedText style={styles.btnText}>OK, GOT IT</ThemedText>
                        </ThemedButton>
                    </View>
                );
        }
    }


    return (
        <ThemedView safe={true} style={styles.page}>
            
            <View style={styles.header}>
                <ThemedText title={true} style={styles.pageTitle}>NOTIFICATION</ThemedText>
                <Ionicons 
                    name="trash-outline" 
                    size={24} 
                    color={Colours.warning} 
                    onPress={handleDelete}
                    style={styles.deleteIcon}
                />
            </View>

            <ThemedCard style={styles.mainCard}>
                <View style={styles.iconContainer}>
                    <Ionicons 
                        name={type?.includes('MATCH') ? "game-controller" : type?.includes('FRIEND') ? "person-add" : "information-circle"} 
                        size={50} 
                        color={Colours.primaryTextColour} 
                    />
                </View>

                <ThemedText title={true} style={styles.msgTitle}>
                    {type?.replace('_', ' ')}
                </ThemedText>
                <ThemedText style={styles.messageBody}>
                    "{parsedPayload.message}"
                </ThemedText>

                <View style={styles.divider} />
 
                {loading ? <ActivityIndicator size="large" /> : renderContent()}

            </ThemedCard>

        </ThemedView>
    )
}

export default NotificationPage

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    deleteIcon: {
        padding: 10,
    },
    mainCard: {
        padding: 30,
        alignItems: 'center',
        borderRadius: 20,
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 20,
        borderRadius: 50,
    },
    msgTitle: {
        fontSize: 18,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 10,
        textAlign: 'center',
    },
    messageBody: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#CCC',
        opacity: 0.3,
        marginBottom: 20,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    subText: {
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.6,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
    },
    btnAccept: {
        backgroundColor: Colours.success,
    },
    btnReject: {
        backgroundColor: Colours.warning, 
    },
    btnSystem: {
        width: '100%',
        alignItems: 'center',
    },
    btnText: {
        color: '#FFF',
        fontWeight: '800',
        textTransform: 'uppercase',
    }
})