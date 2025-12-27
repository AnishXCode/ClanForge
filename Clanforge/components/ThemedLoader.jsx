import { ActivityIndicator, useColorScheme } from "react-native"
import { Colours } from "../constants/colours"
import ThemedView from "./ThemedView"

const ThemedLoader = () => {
    const colourScheme = useColorScheme()
    const theme = Colours[colourScheme] ?? Colours.light

    return(
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator 
            size={"large"}
            color={theme.text}
        />
        </ThemedView>
    )
}

export default ThemedLoader