import { useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colours } from '../constants/colours'
import { UserProvider } from '../contexts/UserContext'
import { UserDataProvider } from '../contexts/UserDataContext'
import { AppDataProvider } from '../contexts/AppDataContext';


const RootLayout = () => {

  const colourScheme = useColorScheme() 
  const theme = Colours[colourScheme] ?? Colours.light

  return (
    <UserProvider>
      <UserDataProvider>
        <AppDataProvider>
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
            <Stack.Screen name="(game)" options={{ headerShown: false }} />
            <Stack.Screen name="(navigation)" options={{ headerShown: false }} />
          </Stack>
        </AppDataProvider>
      </UserDataProvider>
    </UserProvider>
  )
}

export default RootLayout
