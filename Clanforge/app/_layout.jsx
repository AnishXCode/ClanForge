import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import { Colours } from '../constants/colours'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {

  const colourScheme = useColorScheme() 
  const theme = Colours[colourScheme] ?? Colours.light

  return (
    <>
      <StatusBar value="auto" />
        <Stack screenOptions={{
        headerStyle: {
          backgroundColor: theme.navBackground
        },
        headerTintColor: theme.title,
        headerTitleAlign: 'center'
      }}  >
        <Stack.Screen name="index" options={{title: "Home"}} />
        <Stack.Screen name="(auth)/login" options={{title: "Login", headerShown: false }} />
      </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})