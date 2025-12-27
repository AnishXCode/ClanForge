import { StyleSheet, Text, View, useColorScheme, Alert, FlatList, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser';
import { useUserData } from '../../hooks/useUserData'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedCard from '../../components/ThemedCard'
import Spacer from '../../components/Spacer'
import { Colours } from '../../constants/colours'

const genrepreferences = () => {
  const router = useRouter()
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light
  const { user } = useUser()
  const { updateDataLocal } = useUserData()

  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([])
  const PREDEFINED_GENRES = [
    "Action", "Adventure", "Puzzle", 
    "Strategy", "RPG", "FPS", 
    "MOBA", "Sports", "Racing"
  ];

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };


  const handleNext = async () => {
    if(!user){
        router.push('/login')
        return;
    }
    if(!selectedGenres && user){
        router.push('/userpreferences')
        return;
    }
    try{
        updateDataLocal({
            genrePreferences: selectedGenres
        })

        router.push('/userpreferences');

    } catch (error) {
      setError(error.message)
      Alert.alert("Selection Failed", "Please try again.");
    }
    }

  const renderItem = ({ item }) => {
    const isSelected = selectedGenres.includes(item);

    return (
      <TouchableOpacity onPress={() => toggleGenre(item)} style={styles.cardWrapper}>
        <ThemedCard style={[
            styles.card, 
            isSelected && { borderColor: theme.border, backgroundColor: Colours.primary}
        ]}>
          <ThemedText style={[
            [styles.cardText, {color: theme.text}],
            isSelected && { color: Colours.primaryTextColour }
          ]}>
            {item}
          </ThemedText>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={ styles.page }>
      <Spacer height={80} />
      <ThemedText title={true} style={[styles.title, {textTransform: 'uppercase'}]} >Sign Up</ThemedText>
      <Spacer height={30} />

      <ThemedText style={styles.text} title={true}>Choose preferred game genres</ThemedText>
      <Spacer height={40}/>

      <FlatList
        data={[...PREDEFINED_GENRES]}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
      <Spacer height={15}/>

      <View style={styles.footer}>
        <ThemedButton onPress={handleNext} style={styles.btnNext} >
            <ThemedText style={{ color: Colours.primaryTextColour, fontWeight: 600, fontSize: 18, textAlign: 'center'}} title={true}>Next</ThemedText>
          </ThemedButton>

        <View style={styles.buttonpanel}>
          <ThemedButton onPress={() => router.back()} style={[styles.btn, {backgroundColor: theme.uiBackground}]}>
            <ThemedText style={[styles.btnSecondaryText, { color: theme.text}]} title={true}>Back</ThemedText>
          </ThemedButton>

          <ThemedButton onPress={handleNext} style={[styles.btn, {backgroundColor: theme.uiBackground}]} >
            <ThemedText style={[styles.btnSecondaryText, { color: theme.text}]} title={true}>Skip</ThemedText>
          </ThemedButton>
        </View>
        </View>
    <Spacer />

      {error && 
        <Text style={styles.error}>{error}</Text>    
      }
    </ThemedView>
  )
}

export default genrepreferences

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 700
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 80
  },
  error: {
   color: Colours.warning,
   padding: 10,
   marginTop: 10,
   backgroundColor: '#f5c1c8',
   borderColor: Colours.warning,
   borderWidth: 1,
   borderRadius: 6,
   marginHorizontal: 10,
   width: '90%'
  },
  text: {
    fontSize: 22,
    fontWeight: 600
  },
  // Footer
  footer: {
    marginBottom: 40,
    width: '100%',
  },
  buttonpanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    gap: 20
  },
  btn: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   paddingVertical: 10,
   borderRadius: 6,
  },
  btnNext: {
   width: '100%',
   height: 50,
   justifyContent: 'center',
   alignItems: 'center',
   paddingVertical: 10,
   marginBottom: 15,
   borderRadius: 8
  },
  btnSecondaryText: {
    fontWeight: 600, 
    fontSize: 16
  },
  // Cards
  row: {
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20
  },
  cardWrapper: {
    width: '30%', 
    aspectRatio: 1,
  },
  card: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent', 
  },
  cardText: {
    fontWeight: 600,
    fontSize: 16,
    textAlign: 'center',
  },
})