import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useUser } from '../../hooks/useUser';
import { useUserData } from '../../hooks/useUserData';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';
import Spacer from '../../components/Spacer';
import Friends from '../../components/friends'; 
import ThemedLoader from '../../components/ThemedLoader';
import { useAppData } from '../../hooks/useAppData';

const GAMES_DATA = [
    { id: '1', name: 'Game', type: 'Action' },
    { id: '2', name: 'Game', type: 'Puzzle'  },
    { id: '3', name: 'Game', type: 'Action'  },
    { id: '4', name: 'Game', type: 'Action'  },
];

const Dashboard = () => {
    const { user } = useUser();
    const { userData, fetchUserDataByID } = useUserData();
    const { fetchAllGames, games } = useAppData()

    const [sortedGenres, setSortedGenres] = useState([]);

    useEffect(() => {
        if (user?.$id) {
            fetchUserDataByID(user.$id);
        }
        fetchAllGames();
    }, [user]);

    useEffect(() => {
        if(!userData || !games) return;

        const allGames = games.rows;
        console.log(allGames)
        const processedData = allGames.map(game => game.genre)
        console.log(processedData)

        // categories.sort((a, b) => {
        //     if (a.isPreferred && !b.isPreferred) return -1; 
        //     if (!a.isPreferred && b.isPreferred) return 1;  
        //     return 0; 
        // });

        // setSortedGenres(categories);
    },[userData])

    if(userData === null){
        return (
            <ThemedLoader />
        )
    }

    const renderGameCard = ({ item }) => (
        <TouchableOpacity style={styles.gameCard}>
            {/* Placeholder for Game Image */}
            <View style={styles.gameIconPlaceholder} /> 
            <ThemedText style={styles.gameCardText}>{item.name}</ThemedText>
            <ThemedText style={styles.gameActiveText}>{item.active_players}</ThemedText>
        </TouchableOpacity>
    );

    const renderCategory = ({ item }) => (
        <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ThemedText style={styles.categoryTitle}>{item.genre}</ThemedText>
                    
                    {/* Optional: Add a 'FOR YOU' badge if it matches preferences */}
                    {item.isPreferred && (
                        <View style={styles.preferredBadge}>
                            <ThemedText style={styles.preferredText}>FOR YOU</ThemedText>
                        </View>
                    )}
                </View>
                <ThemedText style={styles.categoryArrows}>{'< >'}</ThemedText>
            </View>
            <FlatList 
                data={item.games}
                renderItem={renderGameCard}
                keyExtractor={game => game.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gamesList}
            />
        </View>
    );

    return (
        <ThemedView  style={styles.page} safe={true}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <Spacer height={10} />
                
                <View style={styles.welcomeContainer}>
                    <ThemedText title={true} style={styles.welcomeText}>welcome, </ThemedText>
                    <ThemedText title={true} style={styles.usernameText}>{user.name}</ThemedText>
                </View>

                <Spacer height={20} />

                <ThemedText title={true} style={styles.cardTitle}>Your Status</ThemedText>
                <ThemedCard style={styles.statusCard}>
                    
                    <Spacer height={10} />
                    
                    <View style={styles.rankingRow}>
                        <ThemedText style={styles.rankingText}>Bronze 1247 (Global)</ThemedText>
                    </View>
                    <View style={styles.rankingRow}>
                        <ThemedText style={styles.rankingText}>Silver 238 (Snake)</ThemedText>
                    </View>
                    <View style={styles.rankingRow}>
                        <ThemedText style={styles.rankingText}>Gold 23 (Chess)</ThemedText>
                    </View>

                    <TouchableOpacity style={styles.seeMoreContainer}>
                        <ThemedText style={styles.seeMoreText}>SEE MORE...</ThemedText>
                    </TouchableOpacity>
                </ThemedCard>

                <Spacer height={25} />

                <Friends />

                <Spacer height={25} />

                <ThemedText title={true} style={styles.cardTitle}>Matchmaking</ThemedText>

                <ThemedCard>
                <Spacer height={15} />

                {GAMES_DATA.map(category => (
                    <View key={category.genre}>
                        {renderCategory({ item: category })}
                        <Spacer height={15} />
                    </View>
                ))}

                {GAMES_DATA.length === 0 && (
                     <ThemedText style={{opacity: 0.5, fontStyle: 'italic', marginLeft: 10}}>Loading games...</ThemedText>
                )}

                 <TouchableOpacity style={[styles.seeMoreContainer, { paddingRight: 10 }]}>
                    <ThemedText style={styles.seeMoreText}>See More...</ThemedText>
                </TouchableOpacity>

                </ThemedCard>

                <Spacer height={25} />

                <ThemedText title={true} style={styles.cardTitle}>Community</ThemedText>
                <ThemedCard style={[styles.statusCard, { height: 150 }]}>
                    <ThemedText style={styles.cardTitle}>LATEST NEWS</ThemedText>
                    <Spacer height={10} />

                    <TouchableOpacity style={styles.communityItem}>
                        <View style={styles.newsTag}><ThemedText style={styles.tagText}>EVENT</ThemedText></View>
                        <View style={{flex: 1}}>
                            <ThemedText style={styles.communityTitle}>Weekend Tournament!</ThemedText>
                            <ThemedText style={styles.communitySub}>Double XP for all Action games starts in 2h.</ThemedText>
                        </View>
                    </TouchableOpacity>

                    <Spacer height={10} />

                    <TouchableOpacity style={styles.communityItem}>
                        <View style={[styles.newsTag, {backgroundColor: '#FF9800'}]}><ThemedText style={styles.tagText}>UPDATE</ThemedText></View>
                        <View style={{flex: 1}}>
                            <ThemedText style={styles.communityTitle}>Season 4 Rewards</ThemedText>
                            <ThemedText style={styles.communitySub}>Check your inventory for new skins.</ThemedText>
                        </View>
                    </TouchableOpacity>
                            </ThemedCard>

                            <Spacer height={40} />
                        </ScrollView>
        </ThemedView>
    );
}

export default Dashboard;

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    // welcome
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    usernameText: {
        fontSize: 26,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    // status card
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 15,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 5,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    rankingRow: {
        marginBottom: 8,
        marginLeft: 5
    },
    rankingText: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    seeMoreContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },
    seeMoreText: {
        fontSize: 10,
        fontWeight: '700',
        opacity: 0.5,
        textTransform: 'uppercase'
    },
    // --- MATCHMAKING ---
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    categoryArrows: {
        fontSize: 14,
        fontWeight: '800',
        opacity: 0.5,
    },
    gamesList: {
        gap: 15,
        paddingBottom: 10,
    },
    gameCard: {
        width: 100,
        height: 120,
        backgroundColor: '#1E293B', 
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameCardText: {
        color: 'white',
        fontWeight: '600',
    }
});