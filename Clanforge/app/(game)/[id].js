import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Alert, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";
import { SNAKE_GAME_HTML } from "../../assets/games/snake";

import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedLoader from "../../components/ThemedLoader";
import { useUser } from "../../hooks/useUser";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";
import ThemedButton from "../../components/ThemedButton";
import Spacer from "../../components/Spacer";
import { useAppData } from "../../hooks/useAppData";
import { appwriteConfig, client, databases } from "../../lib/appwrite";
import { ID } from "react-native-appwrite";
import { Colours } from "../../constants/colours";

const Lobby = () => {
  const { fetchGameInLobby } = useAppData();
  const { user } = useUser();
  const params = useLocalSearchParams()
  const { 
    id: gameId, 
    name, 
    genre,
    game_url, 
    maxPlayers, 
    scoreSelector, 
    gameOverSelector, 
    scoreIndex, 
    finalScoreSelector 
  } = params;  

  const [loading, setLoading] = useState(true);
  const [lobbyData, setLobbyData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [hasFinishedLocally , setHasFinishedLocally] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const router = useRouter();
  const colourScheme = useColorScheme();
  const theme = Colours[colourScheme] ?? Colours.light;
  const isSubmittingRef = useRef(false);

  const [generatedURL] = useState(() => {
    const timestamp = new Date().getTime();
    const seperator = game_url.includes('?') ? '&' : '?';
    return `${game_url}${seperator}ts=${timestamp}`
  })

  useEffect(() => {
    if(isSubmittingRef.current){
      return;
    }

    let isMounted = true;

    if(!gameId || !user){
      return;
    }

    const findLobby = async () => {
      try {
      const activeGame = await fetchGameInLobby(gameId);

      if (activeGame?.rows.length > 0) {
        const matchToJoin = activeGame.rows[0];
        const isAlreadyInGame = matchToJoin.currentPlayers.includes(user.$id);

        if (isAlreadyInGame) {
          if(isMounted){
            setLobbyData(matchToJoin);
          }
          return;
        }

        if(matchToJoin.currentPlayers.length >= maxPlayers) {
             Alert.alert("Lobby Full", "This game is already full.");
             router.back();
             return;
          }

        const updatedPlayers = [...matchToJoin.currentPlayers, user.$id];

        const updatedMatch = await databases.updateRow({
          databaseId: appwriteConfig.DATABASE_ID,
          tableId: appwriteConfig.LOBBY_TABLE_ID,
          rowId: matchToJoin.$id,
          data: {
            currentPlayers: updatedPlayers,
            gameStatus: "waiting",
          },
        });

        if(isMounted){
            setLobbyData(updatedMatch);
            Alert.alert("Game Found to join, joining match!")
        }

      } else {
        const newMatch = await databases.createRow({
          databaseId: appwriteConfig.DATABASE_ID,
          tableId: appwriteConfig.LOBBY_TABLE_ID,
          rowId: ID.unique(),
          data: {
            gameId: gameId,
            maxPlayers: parseInt(maxPlayers) || 2,
            hostUserId: user.$id,
            currentPlayers: [user.$id],
            gameStatus: "waiting",
            genre: genre,
            gameState: JSON.stringify({}),
          },
        });

        if(isMounted){
            setLobbyData(newMatch);
            Alert.alert("New match created, waiting for players to join!")
        }
      } 
    } catch (error) {
      console.error("Matchmaking failed:", error);
      router.replace('/(dashboard)/dashboard');
      Alert.alert("Error", "Failed to join lobby.");
    } finally {
      if(isMounted) setLoading(false);
    }
    }

    findLobby()

    return () => {
        isMounted = false; 
    };
    
  }, [gameId, user]);

  useEffect(()=> {
    if(lobbyData?.currentPlayers.length === parseInt(maxPlayers)){
       setIsDisabled(false);
    }
  },[lobbyData?.currentPlayers])

  useEffect(() => {
    if (!lobbyData?.$id) return;

    const channel = `databases.${appwriteConfig.DATABASE_ID}.tables.${appwriteConfig.LOBBY_TABLE_ID}.rows.${lobbyData.$id}`

    const unsubscribe = client.subscribe(channel, response => {
      if(response.events.includes("databases.*.tables.*.rows.*.update")) {
          setLobbyData(response.payload)
      }
    })

    return () => {
      setLobbyData(null)
      unsubscribe();
    };

  },[lobbyData?.$id])

  const injectedJavaScript = `
   (function() {
   try {
    var currentScoreSelector = "${scoreSelector}";
    var gameOverSelector = "${gameOverSelector}";
    var scoreIndex = parseInt("${scoreIndex}") || 0;
    var finalScoreSelector = "${finalScoreSelector}";

    var lastSentScore = -1;
    var lastGameStatus = false; 

    function checkGameState() {
      try{
        var currentScore = 0;
        var isGameOver = false;

        var gameOverElement = document.querySelector(gameOverSelector);
        if (gameOverElement) {
          var text = gameOverElement.innerText || "";
          var style = window.getComputedStyle(gameOverElement);
          if (text.toLowerCase().includes("game over") && style.display !== 'none') {
            isGameOver = true;
          }
        }

        if(isGameOver && finalScoreSelector) {
          var finalElement = document.querySelector(finalScoreSelector);
          var rawText = finalElement ? finalElement.innerText : "0";
          var finalText = rawText.slice(0, 12)
          currentScore = parseInt(finalText.replace(/\\D/g, '')) || 0;

        } else {
          var allItems = document.querySelectorAll(currentScoreSelector);
          var scoreElement = null;
          if (allItems.length > scoreIndex) {
            scoreElement = allItems[scoreIndex];
          }
          var rawText = scoreElement ? scoreElement.innerText : "0";
          currentScore = parseInt(rawText.replace(/\\D/g, '')) || 0;
        }

        if (currentScore !== lastSentScore || isGameOver !== lastGameStatus) {
          lastSentScore = currentScore;
          lastGameStatus = isGameOver;

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'GAME_UPDATE',
            payload: { score: currentScore, isGameOver: isGameOver }
          }));
        }
      
      } catch (loopError) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'ERROR',
          message: 'Loop Error: ' + loopError.message
        }));
      }
    }
    setInterval(checkGameState, 1000);

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();

      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    } catch(e) {}

    } catch (setupError) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'ERROR',
          message: 'Setup Error: ' + setupError.message
        }));
    }
    })();

    true;
  `;

  const handleWebViewMessage = async (event) => {
    try{
      const data = JSON.parse(event.nativeEvent.data)

      if (data.type === 'ERROR') {
        console.error("webview error:", data.message);
        return;
      }

      if(data.type === 'GAME_UPDATE') {
        const { score, isGameOver } = data.payload
        console.log(`Current Score: ${score} | Game Over: ${isGameOver}`)

        if(isGameOver && !hasFinishedLocally && !isSubmittingRef.current) {
          isSubmittingRef.current = true;
          setUserScore(score);
          setHasFinishedLocally(true);
          Alert.alert("Game Over", `Final Score: ${score}`);

          const freshData = await databases.getRow({
            databaseId: appwriteConfig.DATABASE_ID,
            tableId: appwriteConfig.LOBBY_TABLE_ID,
            rowId: lobbyData.$id
          })

          const currentScores = JSON.parse(freshData.gameState || '{}');
          const newScores = {...currentScores, [user.$id]: score }
          const allPlayersFinished = Object.keys(newScores).length >= freshData.currentPlayers.length

          let winnerId = null;

          if(allPlayersFinished) {
            winnerId = Object.keys(newScores).reduce((a, b) => 
              newScores[a] > newScores[b] ? a : b
            );
          }

          console.log("WinnerID: ", winnerId)

          const response = await databases.updateRow({
            databaseId: appwriteConfig.DATABASE_ID,
            tableId: appwriteConfig.LOBBY_TABLE_ID,
            rowId: freshData.$id,
            data: {
              gameStatus: allPlayersFinished ? "completed" : "playing",
              gameState: JSON.stringify(newScores),
              winner: winnerId
            },
          });

          console.log(response)
        }
      }
    } catch (error) {
      console.error("Error parsing game data", error);
    }
  };

  const handleStartGame = async () => {
    if (!lobbyData || loading) return;

    try{
      const updateGame = await databases.updateRow({
        databaseId: appwriteConfig.DATABASE_ID,
        tableId: appwriteConfig.LOBBY_TABLE_ID,
        rowId: lobbyData.$id,
        data: {
          gameStatus: "playing"
        }
      })
      setLobbyData(updateGame)
    } catch (error) {
      console.error("Error Starting the Game: ", error)
    }
  }

  if (loading || !lobbyData) {
    return <ThemedLoader />;
  }

  const matchStatus = lobbyData.gameStatus;

  return (
    <ThemedView style={styles.container} safe={true}>

      {matchStatus === "waiting" && (
        <View style={styles.waiting}>
          <ThemedText title={true} style={[styles.heading, { marginBottom: 10 }]}>LOBBY</ThemedText>
          <ThemedText style={{ marginBottom: 10 }}>ID: {lobbyData.$id}</ThemedText>
          <ThemedText style={styles.heading}>GAME: {name}</ThemedText>
          <Spacer height={30} />
          <ThemedCard style={styles.playerList}>
                <ThemedText title={true}>Players Joined ({lobbyData.currentPlayers.length}/{maxPlayers}):</ThemedText>
                <Spacer height={10} />
                {lobbyData.currentPlayers.map((pid, index) => (
                <ThemedText key={pid} style={styles.playerRow}>
                    {index + 1}. {pid === user.$id ? "You" : `Player ${pid}`}
                </ThemedText>
                ))}
          </ThemedCard>

          <Spacer height={40} />

          {lobbyData.hostUserId === user.$id ? (
                <ThemedButton onPress={handleStartGame} disabled={isDisabled}>
                <ThemedText button={true}>START GAME</ThemedText>
                </ThemedButton>
           ) : (
                <ThemedText>Waiting for host to start...</ThemedText>
         )}
        </View>
      )}

      {matchStatus === "playing" && !hasFinishedLocally && (
        <WebView
          source={{ uri: generatedURL }}
          style={styles.webview}
          javaScriptEnabled={true}
          onMessage={handleWebViewMessage}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
          incognito={true}
          cacheEnabled={false}
          startInLoadingState={true}
        />
      )}

      {matchStatus === "playing" && hasFinishedLocally && (
        <View style={styles.finished}>
            <ActivityIndicator size="large" color={theme.text}/>
            <Spacer height={20} />
            <ThemedText title={true} style={{ fontSize: 22, fontWeight: 700 }}>Game Finished!</ThemedText>
            <Spacer height={20} />
            <ThemedText>Your Score: {userScore}</ThemedText> 
            <Spacer height={10} />
            <ThemedText style={{ opacity: 0.7 }}>Waiting for opponent to complete his game...</ThemedText>
        </View>
      )}

      {matchStatus === "completed" && (
        <View style={styles.resultsContainer}>
            <ThemedText title={true} style={styles.heading}>GAME OVER</ThemedText>
            
            <ThemedText style={styles.winnerText}>
                {lobbyData.winner === user.$id ? "YOU WON!" : "YOU LOST!"}
            </ThemedText>

            <Spacer height={40} />

            <ThemedCard style={styles.scoreCard}>
                <ThemedText title={true} style={{ textAlign: 'center', fontSize: 20, fontWeight: 600 }}>FINAL SCORES</ThemedText>
                {lobbyData.currentPlayers.map((player) => {
                    return (
                        <View key={player} style={styles.scoreRow}>
                            <ThemedText style={{ fontSize: 16, fontWeight: 500 }}>{player === user.$id ? "You" : `${player}`}</ThemedText>
                            <ThemedText style={{ fontSize: 16, fontWeight: 500 }}>{player === user.$id ? userScore : JSON.parse(lobbyData?.gameState)[player]}</ThemedText>
                        </View>
                    );
                })}
            </ThemedCard>

            <Spacer height={30} />
            
            <ThemedButton onPress={() => router.replace('/dashboard')}>
                <ThemedText button={true}>BACK TO DASHBOARD</ThemedText>
            </ThemedButton>
          </View>
      )}

    </ThemedView>
  );
};

export default Lobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waiting: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  playing: {
    flex: 1,
  },
  playerList: { 
    width: "100%", 
    padding: 20 
  },
  playerRow: { 
    fontSize: 16, 
    marginBottom: 5, 
    fontWeight: "600" 
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: 10,
    textAlign: 'center'
  },
  scoreCard: {
    marginTop: '5%',
  }, 
  scoreRow: {
    marginLeft: 15,
    marginTop: 15,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 15
  },
  heading: { 
    fontWeight: 700, 
    fontSize: 22, 
    textAlign: 'center' 
  },
  finished: {
    display: 'flex',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
