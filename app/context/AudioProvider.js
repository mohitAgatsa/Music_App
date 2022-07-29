import { Alert, Text, View } from 'react-native'
import React, { Component, createContext } from 'react'

import * as MediaLibrary from "expo-media-library";
import { DataProvider } from 'recyclerlistview';


export const AudioContext = createContext()
export class AudioProvider extends Component {
  //      canAskAgain: true
  //      expires: "never"
  //      granted: false
  //      status: "undetermined"

  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {}
    }
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs to read audio files !", [{
      text: 'I am ready',
      onPress: () => this.getPermission()
    }, {
      text: 'cancel',
      onPress: () => this.permissionAlert()
    }])
  }

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    })
    // console.log(media.assets.length)

    this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles: [...audioFiles, ...media.assets] });
  }

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    //     console.log(permission);
    if (permission.granted) {
      // we want to get all the audio files
      this.getAudioFiles()
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionError: true })

    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'denied' && canAskAgain) {
        // we are going to display alert so that user can allow permission access files
        this.permissionAlert();

      }

      if (status === 'granted') {
        // we get all the audio files
        this.getAudioFiles();
      }

      if (status === 'denied' && !canAskAgain) {
        // we are going to display error
        this.setState({ ...this.state, permissionError: true })

      }
    }



  }

  componentDidMount() {
    this.getPermission();
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState })
  }


  render() {
    const { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio } = this.state
    if (permissionError) return <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: 'center'
    }}>
      <Text style={{
        fontSize: 25, textAlign: 'center', color: 'red'
      }}>It looks like you haven't accept the permission.</Text>
    </View>
    return <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObj, soundObj, currentAudio, updateState:this.updateState }}>
      {this.props.children}
    </AudioContext.Provider>
  }
}

export default AudioProvider