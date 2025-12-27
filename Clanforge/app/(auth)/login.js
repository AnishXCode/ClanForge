import { Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import { useState } from 'react'
import { Link } from 'expo-router'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import Spacer from '../../components/Spacer'
import { useUser } from '../../hooks/useUser'
import { Colours } from '../../constants/colours'



const login = () => {
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

  const { login } = useUser();

  const handleSubmit = async () => {
    setLoading(true)
    if(!email || !password){
      Alert.alert("Email and password are required to login")
      return;
    }
    setError(null)
    
    try{
      await login(email, password)
    } catch (error) {
      setError(error.message)
    }
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ThemedView style={ styles.page }>
      <ThemedLogo style={styles.logo} />
      <Spacer height={80}/>
      <ThemedText title={true} style={[ styles.title, {textTransform: 'uppercase'} ]} >Sign In</ThemedText>
      <Spacer height={30}/>

      <ThemedTextInput 
          style = {{ width: '85%', marginBottom: 20 }}
          placeholder='Email' 
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor= {theme.text}
          autoCapitalize="none"
      />

      <ThemedTextInput 
          style = {{ width: '85%', marginBottom: 20 }}
          placeholder='Password'        
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor= {theme.text}
          autoCapitalize="none"
      />

      <ThemedButton onPress={handleSubmit} style={styles.btn} disabled={loading}>
        <ThemedText style={{ color: Colours.primaryTextColour, fontWeight: 600, fontSize: 18 }} title={true}>Login</ThemedText>
      </ThemedButton>


      {error && 
      <Text style={styles.error}>{error}</Text>    
      }
      <Spacer height={10}/>



      <View style={styles.singup}>
      <ThemedText  style={styles.text} >Do not have an account?   </ThemedText>
      <ThemedButton style={styles.signupbtn}>
      <Link href={'/signup'}>
      <ThemedText style = {styles.register}>SignUp</ThemedText>
      </Link>
      </ThemedButton>
      </View>

    </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default login

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 700
  },
  text: {
    fontSize: 16
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  logo: {
     margin: 20,
  },
  btn: {
   width: '85%',
   justifyContent: 'center',
   alignItems: 'center'
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
  singup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 70
  },
  register: {
    color: Colours.primaryTextColour,
    fontWeight: 600
  },
  signupbtn: {
    paddingVertical: 10,
    borderRadius: 6
  }
})