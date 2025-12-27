import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colours } from '../constants/colours'
import { UserProvider } from '../contexts/UserContext'
import { UserDataProvider } from '../contexts/UserDataContext'


const RootLayout = () => {

  const colourScheme = useColorScheme() 
  const theme = Colours[colourScheme] ?? Colours.light

  return (
    <UserProvider>
      <UserDataProvider>
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
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(setup)" options={{ headerShown: false }} />
      </Stack>
      </UserDataProvider>
    </UserProvider>
  )
}

export default RootLayout
