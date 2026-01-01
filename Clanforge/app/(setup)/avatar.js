import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, Alert, Image } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '../../hooks/useUser';
import * as ImagePicker from 'expo-image-picker';
import { useUserData } from '../../hooks/useUserData'
import Person from '../../assets/person.png'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'
import { Colours } from '../../constants/colours'
import { getAvatar, uploadAvatar } from '../../contexts/ImageContext';

const avatar = () => {
  const router = useRouter()
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light
  const { user } = useUser()
  const { updateDataLocal } = useUserData()

  const [image, setImage] = useState(null)
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false)

  const initialCheck = () => {
    try{
      if(user){
      const response = getAvatar(user.$id);
      if(response){
        setImage()
      }
    }
    } catch(error) {
      console.log(error.message)
    }
  }

  // useEffect(() => {
  //   initialCheck()
  // },[user])

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageInfo) => {
    try {
        const avatar = await uploadAvatar(imageInfo, user.$id)
        return avatar;
    } catch (error) {
        setError(error.message)  
    }
  }

  const handleNext = async () => {
    if(!user){
        router.push('/login')
        return;
    }
    if(!image && user){
        router.push('/genrepreferences')
        return;
    }
    setUploading(true)
    try{

        const avatarId = await uploadImage(image);
        updateDataLocal({
            avatar: avatarId
        })

        router.push('/genrepreferences');

    } catch (error) {
      setError(error.message)
      Alert.alert("Upload Failed", "There was an error uploading your avatar. Please try again.");
    } finally {
      setUploading(false);
    }
    }
  return (
    <ThemedView style={ styles.page }>
      <ThemedText title={true} style={[styles.title, {textTransform: 'uppercase'}]} >Sign Up</ThemedText>
      <Spacer height={40} />

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {image ? (
            <Image source={{ uri: image.uri }} style={styles.avatar} />
        ) : (
            <Image source={Person} style={styles.avatar}/>
        )}
      </TouchableOpacity>

        <Spacer height={30}/>

      <TouchableOpacity onPress={pickImage}>
        <ThemedText style={styles.text} title={true}>Choose An Avatar</ThemedText>
      </TouchableOpacity>
      <Spacer height={60}/>

      
    <View style={styles.buttonpanel}>
      <ThemedButton onPress={handleNext} style={styles.btn} disabled={uploading} >
        <ThemedText style={{ color: Colours.primaryTextColour, fontWeight: 600, fontSize: 18}} title={true}>Next</ThemedText>
      </ThemedButton>

      <ThemedButton onPress={() => router.push('/genrepreferences')} style={[styles.btn, {backgroundColor: theme.uiBackground}]} disabled={uploading} >
        <ThemedText style={{ color: Colours.primaryTextColour, fontWeight: 600, fontSize: 18}} title={true}>Skip</ThemedText>
      </ThemedButton>
    </View>

      {error && 
        <Text style={styles.error}>{error}</Text>    
      }
    </ThemedView>
  )
}

export default avatar

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 700
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  btn: {
    width: 'auto',
   justifyContent: 'center',
   alignItems: 'center',
   margin: 20,
   paddingVertical: 10,
   paddingHorizontal: 25,
   borderRadius: 6
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
  buttonpanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  avatarContainer: {
    margin: 10
  },
  avatar: {
    width: 170,
    height: 170,
    aspectRatio: 1/1,
    borderRadius: 100
  },
  text: {
    fontSize: 24,
    fontWeight: 600
  },
  placeholderAvatar: {
    backgroundColor: Colours.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colours.border,
    textTransform: 'capitalize'
  },
})