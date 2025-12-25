import { View, useColorScheme} from 'react-native'
import { Colours } from '../constants/colours'
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const ThemedView = ({ style, safe = false, ...props }) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light;

    if(safe) 
    return (
      <View
      style={[{ backgroundColor: theme.background }, style]} 
      { ...props }
      />
    )
    else {
      const insets = useSafeAreaInsets()
      return (
    <View
    style={[{
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }, 
    style
  ]} 
    { ...props }
    />
  )
    }
    
  
}

export default ThemedView