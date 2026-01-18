import { Text, useColorScheme } from 'react-native'
import { Colours } from '../constants/colours'


const ThemedText = ({style, title = false , button = false, ...props}) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

    const textColour = title ? theme.title : theme.text
    const buttonColour = button ? "#000": textColour

  return (
      <Text 
      style={[{ color: buttonColour }, style ]} 
      {...props}
      />
  )
}

export default ThemedText