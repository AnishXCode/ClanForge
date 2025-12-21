import { View, useColorScheme} from 'react-native'
import { Colours } from '../constants/colours'


const ThemedView = ({ style, ...props }) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light;

  return (
    <View 
    style={[{ backgroundColor: theme.background }, style]} 
    { ...props }
    />
  )
}

export default ThemedView