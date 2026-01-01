import { StyleSheet, useColorScheme, Image } from 'react-native'

import DarkLogo from '../assets/DarkLogo.png'
import LightLogo from '../assets/LightLogo.png'

const ThemedLogo = ({style, header = false, ...props}) => {
    const colourScheme = useColorScheme()
    const logo = colourScheme === "dark" ? DarkLogo : LightLogo

  return (
    <Image 
        source={logo}
        style={header ? styles.headerlogo : styles.logo}
        {...props}
    />
  )
}

export default ThemedLogo

const styles = StyleSheet.create({
    logo: {
        height: 180.75,
        width: 200
    },
    headerlogo: {
      height: 60,
      width: 70
    }
})