import {StyleSheet, Text, useColorScheme } from 'react-native'
import { Colours } from '../constants/colours'


const ThemedText = ({style, title = false , ...props}) => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

    const textColor = title ? theme.title : theme.text

  return (
      <Text 
      style={[ title ? styles.title : styles.body  ,{ color: textColor }, style ]} 
      {...props}
      />
  )
}

export default ThemedText

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        fontWeight: 700,
        textTransform: 'uppercase',
        textAlign: 'center'
    }, 
    body: {
        fontSize: 20,
        fontWeight: 500,
    }
})