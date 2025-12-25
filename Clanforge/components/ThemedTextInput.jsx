import { TextInput, useColorScheme } from 'react-native'
import { Colours } from '../constants/colours'

const ThemedTextInput = ({ style, ...props }) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

  return (
    <TextInput 
        style={[{
            backgroundColor: theme.uiBackground,
            padding: 20,
            color: theme.text,
            borderRadius: 6
        },
        style
    ]}
    {...props}
    />
  )
}

export default ThemedTextInput
