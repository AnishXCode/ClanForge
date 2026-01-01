import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';
import Spacer from '../../components/Spacer';
import { Colours } from '../../constants/colours';

// Mock Data matching your image
const LEADERBOARD_DATA = [
    { id: '1', name: 'PLAYER 1', rank: 1, score: 2500, league: 'BRONZE 2' },
    { id: '2', name: 'PLAYER 1', rank: 2, score: 2000, league: 'BRONZE 2' },
    { id: '3', name: 'PLAYER 1', rank: 3, score: 1700, league: 'BRONZE 2' },
    { id: '4', name: 'YOU', rank: 245, score: 500, league: 'BRONZE 2', isMe: true }, // "YOU" row
];

const Leaderboard = () => {

    // Helper to render the Rank Icon (Trophy or Number)
    const renderRank = (rank) => {
        if (rank === 1) return <FontAwesome5 name="trophy" size={24} color="#FFD700" />; // Gold
        if (rank === 2) return <FontAwesome5 name="trophy" size={24} color="#C0C0C0" />; // Silver
        if (rank === 3) return <FontAwesome5 name="trophy" size={24} color="#CD7F32" />; // Bronze
        return <ThemedText style={styles.rankNumber}>{rank}</ThemedText>;
    };

    return (
        <ThemedView style={styles.page} safe={true}> 
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <ThemedText title={true} style={styles.sectionTitle}>LEADERBOARD</ThemedText>
                <ThemedCard>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <ThemedText style={styles.headerText}>RANK</ThemedText>
                    <ThemedText style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>PLAYER</ThemedText>
                    <ThemedText style={styles.headerText}>SCORE</ThemedText>
                </View>

                {/* Leaderboard List */}
                <View style={styles.listContainer}>
                    {LEADERBOARD_DATA.map((player) => (
                        <ThemedCard key={player.id} style={[styles.card, player.isMe && styles.myCard]}>
                            <View style={styles.row}>
                                
                                {/* 1. Rank Column */}
                                <View style={styles.rankCol}>
                                    {renderRank(player.rank)}
                                </View>

                                {/* 2. Player Info Column */}
                                <View style={styles.playerCol}>
                                    {/* Avatar Circle */}
                                    <View style={styles.avatarContainer}>
                                        <Ionicons name="person" size={24} color="#fff" />
                                        {/* Green Online Dot */}
                                        <View style={styles.statusDot} />
                                    </View>
                                    
                                    <View style={styles.nameBlock}>
                                        <ThemedText style={styles.playerName}>{player.name}</ThemedText>
                                        <ThemedText style={styles.playerLeague}>{player.league}</ThemedText>
                                    </View>
                                </View>

                                {/* 3. Score Column */}
                                <View style={styles.scoreCol}>
                                    <ThemedText style={styles.scoreText}>{player.score}</ThemedText>
                                </View>
                            </View>
                        </ThemedCard>
                    ))}
                </View>
                </ThemedCard>

                <Spacer height={30}/>
                    
               
                <ThemedText title={true} style={styles.sectionTitle}>FRIENDS LEADERBOARD</ThemedText>
                <ThemedCard>
                 <View style={styles.tableHeader}>
                    <ThemedText style={styles.headerText}>RANK</ThemedText>
                    <ThemedText style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>PLAYER</ThemedText>
                    <ThemedText style={styles.headerText}>SCORE</ThemedText>
                </View>
                {/* Reusing the same list for demo purposes */}
                <View style={styles.listContainer}>
                    {LEADERBOARD_DATA.slice(0, 3).map((player) => (
                        <ThemedCard key={`friend-${player.id}`} style={styles.card}>
                            <View style={styles.row}>
                                <View style={styles.rankCol}>{renderRank(player.rank)}</View>
                                <View style={styles.playerCol}>
                                    <View style={styles.avatarContainer}>
                                        <Ionicons name="person" size={24} color="#fff" />
                                        <View style={styles.statusDot} />
                                    </View>
                                    <View style={styles.nameBlock}>
                                        <ThemedText style={styles.playerName}>{player.name}</ThemedText>
                                        <ThemedText style={styles.playerLeague}>{player.league}</ThemedText>
                                    </View>
                                </View>
                                <View style={styles.scoreCol}>
                                    <ThemedText style={styles.scoreText}>{player.score}</ThemedText>
                                </View>
                            </View>
                        </ThemedCard>
                    ))}
                </View>
                </ThemedCard>

                <Spacer height={80}/> 
            </ScrollView>
        </ThemedView>
    )
}

export default Leaderboard

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    headerText: {
        fontWeight: '700',
        fontSize: 14,
        opacity: 0.6,
    },
    listContainer: {
        gap: 10,
    },
    card: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 16,
        width: '100%',
        backgroundColor: '#F0F0F0', // Adjust based on your theme for light grey look
    },
    myCard: {
        backgroundColor: '#E3F2FD', // Slightly different blue tint for "YOU"
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // --- COLUMNS ---
    rankCol: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    playerCol: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Centers the content in the middle column
        gap: 10,
    },
    scoreCol: {
        width: 50,
        alignItems: 'flex-end',
    },
    // --- Player Details ---
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#90CAF9', // Light Blue Placeholder
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colours.success, // Green dot
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    nameBlock: {
        justifyContent: 'center',
    },
    playerName: {
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    playerLeague: {
        fontSize: 10,
        opacity: 0.6,
        textTransform: 'uppercase',
    },
    scoreText: {
        fontWeight: '600',
        fontSize: 14,
        opacity: 0.8,
    }
});