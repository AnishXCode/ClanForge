import { Text, useColorScheme } from 'react-native'
import { Colours } from '../constants/colours'


const ThemedText = ({style, title = false , ...props}) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

    const textColor = title ? theme.title : theme.text

  return (
      <Text 
      style={[{ color: textColor }, style ]} 
      {...props}
      />
  )
}

export default ThemedText