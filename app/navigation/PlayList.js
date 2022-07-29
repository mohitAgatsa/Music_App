import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PlayList = () => {
  return (
    <View style = {styles.container}>
      <Text>Playlist</Text>
    </View>
  )
}

export default PlayList

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:'center'
      }
})