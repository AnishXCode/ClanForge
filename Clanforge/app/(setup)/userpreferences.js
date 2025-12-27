import { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import ThemedCard from '../../components/ThemedCard';
import { Colours } from '../../constants/colours';
import { useUser } from '../../hooks/useUser'; 
import { useUserData } from '../../hooks/useUserData';
import Spacer from '../../components/Spacer';

const userpreferences = () => {
  const router = useRouter();
  const { user } = useUser(); 
  const { localData, createUser } = useUserData();
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light

  const [bio, setBio] = useState('');
  const [region, setRegion] = useState('Asia'); 
  const [loading, setLoading] = useState(false);

  const REGIONS = [
    { id: 'ASIA', name: 'Asia' },
    { id: 'EU', name: 'Europe' },
    { id: 'AMERICA', name: 'America' },
];

  const handleFinish = async () => {
    setLoading(true);

    try {
      const finalPayload = {
        bio: bio,
        region: region,
        avatar: localData.avatar,
        genrePreferences: localData.genrePreferences
      };

      const response = await createUser(finalPayload)
      console.log("User Created: ",response)
      router.replace('/(dashboard)');

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not create profile.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = region === item.name;

    return (
      <TouchableOpacity onPress={() => setRegion(item.name)} style={styles.cardWrapper} activeOpacity={0.7}>
        <ThemedCard style={[
            styles.card, 
            isSelected && { borderColor: theme.border, backgroundColor: Colours.primary}
        ]}>
            <ThemedText style={[
              [styles.regionCode, {color: theme.text}],
              isSelected && { color: Colours.primaryTextColour }
            ]}>
              {item.id}
            </ThemedText>
            <ThemedText style={[
              styles.regionName,
              isSelected && { color: Colours.primaryTextColour }
          ]}>
              {item.name}
          </ThemedText>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.page}>

      <View style={styles.headerContainer}>
      <ThemedText title={true} style={[styles.header]}>sign up</ThemedText>
      <Spacer />
      <ThemedText title={true} style={[styles.subHeader]}>Set competitive preferences</ThemedText>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText title={true} style={styles.label}>1. Region</ThemedText>
        <Spacer height={15}/>
        <FlatList
          data={REGIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      </View>

        <View style={styles.inputGroup}>
          <ThemedText title={true} style={styles.label}>2. Bio (Optional)</ThemedText>
          <Spacer height={15}/>
            <ThemedTextInput 
            placeholder="What's your playstyle?"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            scrollEnabled={false}
            />
        </View>

        <Spacer height={40}/>

        <View style={styles.footer}>
        <ThemedButton onPress={handleFinish} style={styles.btnNext} disabled={loading}>
            {loading ? <ActivityIndicator color={theme.text}/> : <ThemedText style={{ color: Colours.primaryTextColour, fontWeight: 600, fontSize: 18, textAlign: 'center'}} title={true}>Finish</ThemedText> }
          </ThemedButton>

        <View style={styles.buttonpanel}>
          <ThemedButton onPress={() => router.back()} style={[styles.btn, {backgroundColor: theme.uiBackground}]} disabled={loading}>
            <ThemedText style={[styles.btnSecondaryText, { color: theme.text}]} title={true}>Back</ThemedText>
          </ThemedButton>

          <ThemedButton onPress={handleFinish} style={[styles.btn, {backgroundColor: theme.uiBackground}]} disabled={loading}>
            <ThemedText style={[styles.btnSecondaryText, { color: theme.text}]} title={true}>Skip</ThemedText>
          </ThemedButton>
        </View>
        </View>

    </ThemedView>
  );
}

export default userpreferences

const styles = StyleSheet.create({
  page: { 
    flex: 1, 
    paddingHorizontal: 30,
    paddingTop: 60,
    justifyContent: 'center' 
},
  header: { 
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center', 
    textTransform: 'uppercase'
},
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subHeader: { 
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 600,
    opacity: 0.8
  },
  inputGroup: { 
    marginBottom: 10
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  // Region Selection
  row: {
    justifyContent: 'space-between',
    gap: 10
  },
  cardWrapper: {
    width: '31%',
    aspectRatio: 1.7
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: 'transparent',
  },
  regionCode: {
    fontSize: 18,
    marginBottom: 2,
    fontWeight: '600',
  },  
  regionName: {
    fontSize: 11,
    textAlign: 'center',
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
  textArea: {
    height: 150, 
    textAlignVertical: 'top',
    padding: 15,
    borderRadius: 12,
  },
});