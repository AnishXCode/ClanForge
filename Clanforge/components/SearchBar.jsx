import { StyleSheet, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import ThemedCard from './ThemedCard';

const ThemedSearchBar = ({ style }) => {
    const [searchText, setSearchText] = useState('')

  return (
    <ThemedCard style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput 
          placeholder="SEARCH" 
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
    </ThemedCard>
  )
}

export default ThemedSearchBar

const styles = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      elevation: 2,
      paddingVertical: 0
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      fontSize: 14,
      fontWeight: '600',
    },
})