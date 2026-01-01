import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, useColorScheme } from 'react-native';
import Person from '../../assets/person.png'

import { useUser } from '../../hooks/useUser';
import { Colours } from '../../constants/colours';
import { getAvatar } from '../../contexts/ImageContext'; 

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';
import ThemedButton from '../../components/ThemedButton';
import Friends from '../../components/friends';
import Spacer from '../../components/Spacer';
import { useUserData } from '../../hooks/useUserData';

const Profile = () => {
    const { user, logout } = useUser();
    const {userData} = useUserData();
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null)

    const colourScheme = useColorScheme();
    const theme = Colours[colourScheme] ?? Colours.light;

    useEffect(() => {
      if (userData?.avatar) {
          const url = getAvatar(userData.avatar);
          setAvatarUrl(url);
      } else {
          setAvatarUrl(null);
      }
    }, [userData]);

    const handleLogout = async () => {
        setError(null);
        try {
           await logout();
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
      return (
          <ThemedView style={styles.centerPage}>
              <ThemedText style={styles.error}>{error}</ThemedText>
              <ThemedButton onPress={() => setError(null)} style={styles.btn}>
                  <ThemedText title={true}>Retry</ThemedText>
              </ThemedButton>
          </ThemedView>
      )
    }

    const formatPreferences = (prefs) => {
      if (!prefs || prefs.length === 0) return "None set";
      return prefs.join(", ");
    };

    return (
      <ThemedView style={styles.page} safe={true}> 
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <ThemedText title={true} style={styles.sectionTitle}>Profile</ThemedText>
            <ThemedCard style={styles.card}>
                <View style={styles.profileTopSection}>
                    <View style={styles.avatarContainer}>
                      {avatarUrl ? (
                          <Image source={{ uri: avatarUrl }} style={styles.avatarLarge} />
                      ) : (
                          <Image source={Person} style={styles.avatarLarge}/>
                      )}
                    </View>
                    <View style={styles.profileMainInfo}>
                        <ThemedText title={true} style={styles.gamerTag}>{userData.gamerTag}</ThemedText>
                        <ThemedText style={styles.rankLabel}>{userData.rank}</ThemedText>
                        <ThemedText style={styles.scoreLabel}>HIGHEST SCORE: {userData.highScore}</ThemedText>
                    </View>
                </View>
                <Spacer height={25} />
                <View style={styles.detailsList}>
                    <DetailRow label="BIO:" value={userData?.bio || "No bio yet."} />
                    <DetailRow label="EMAIL:" value={user.email} />
                    <DetailRow label="GAMES PLAYED:" value={userData.gamesPlayed} />
                    <DetailRow label="WINS:" value={userData.wins} />
                    <DetailRow label="LOSSES:" value={userData.losses} />
                    <DetailRow 
                      label="GAME PREFERENCES:" 
                      value={formatPreferences(userData?.genrePreferences)} 
                    />
                </View>
            </ThemedCard>

            <Spacer height={30}/>

            <Friends />

            <Spacer height={40}/>

            <ThemedButton style={styles.logoutBtn} onPress={handleLogout}>
                <ThemedText style={styles.logoutText} title={true}>Logout</ThemedText>
            </ThemedButton>
            
            <Spacer height={60}/>
        </ScrollView>
      </ThemedView>
    )
}

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{label} </ThemedText>
      <ThemedText style={styles.detailValue} numberOfLines={2}>{value}</ThemedText>
  </View>
);

export default Profile

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    centerPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    // Profile card
    card: {
        width: '100%',
        padding: 25,
        borderRadius: 20,
    },
    profileTopSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 25,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colours.primary,
        border: 2,
        borderColor: "#000"
    },
    profileMainInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    gamerTag: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    rankLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsList: {
       gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    detailLabel: {
        fontWeight: '700',
        fontSize: 15,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontWeight: '500',
        fontSize: 15,
        flex: 1,
    },
    logoutBtn: {
      backgroundColor: Colours.warning,
      width: '100%',
      borderRadius: 12,
    },
    logoutText: {
        color: Colours.primaryTextColour,
        fontSize: 18,
        fontWeight: '600'
    },
    error: {
        color: Colours.warning,
        padding: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
        backgroundColor: '#ffebee',
        borderRadius: 12,
    },
});