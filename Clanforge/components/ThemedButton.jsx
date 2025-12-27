import { StyleSheet, Pressable} from 'react-native'
import { Colours } from '../constants/colours'

function ThemedButton ({ style, ...props }) {
  return (
    <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.press, style]}
        {...props}
    />
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colours.primary,
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    press: {
        opacity: 0.5
    }

})