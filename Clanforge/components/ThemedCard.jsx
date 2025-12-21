import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colours } from '../constants/colours'

const ThemedCard = (style, ...props) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

  return (
    <View 
        style={[ { backgroundColor: theme.uiBackground,
                    borderColor: theme.border
        }, styles.card, style]}
        {...props}
    />
  )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20
    }
})