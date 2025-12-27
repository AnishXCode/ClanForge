import { TextInput, useColorScheme } from 'react-native'
import { Colours } from '../constants/colours'


const ThemedTextInput = ({ style, ...props }) => {
  const colourScheme = useColorScheme()
  const theme = Colours[colourScheme] ?? Colours.light
  return (
    <TextInput 
        style={[{
            backgroundColor: theme.uiBackground,
            fontWeight: 500,
            color: theme.text,
            padding: 20,
            borderRadius: 8,
            fontSize: 14
        },
        style
    ]}
    {...props}
    />
  )
}

export default ThemedTextInput
