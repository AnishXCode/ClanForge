import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colours } from '../constants/colours'


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
      }} >
        <Stack.Screen name="index" options={{title: "Home"}} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})