import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View style={styles.test}>
      <Text>index</Text>
      <Link href="/(tabs)/profile">go to profile</Link>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    test: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})