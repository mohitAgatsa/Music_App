import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { pause, play, playNext, resume } from '../misc/audioController';

export class AudioList extends Component {
  static contextType = AudioContext

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
    }

    this.currentItem = {}
  }

  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );


  handleAudioPress = async (audio) => {
    const { soundObj, playbackObj, currentAudio, updateState } = this.context;

    // playing video first time 
    // if (this.state.soundObj === null) {
    //   // console.log(audio);
    //   const playbackObj = new Audio.Sound();
    //   const status = await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true })
    //   // console.log(status)
    //   return this.setState({ ...this.state, currentAudio: audio, playbackObj: playbackObj, soundObj: status })
    // }

    if (soundObj === null) {
      // console.log(audio);
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      // console.log(status)

      return updateState(this.context, { currentAudio: audio, playbackObj: playbackObj, soundObj: status })

    }



    // pause video 
    // if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
    //   // console.log('audio is already playing')
    //   const status = await this.state.playbackObj.setStatusAsync({ shouldPlay: false });
    //   return this.setState({ ...this.state, soundObj: status });
    // }

    if (soundObj.isLoaded && soundObj.isPlaying) {
      // console.log('audio is already playing')
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status })
      //helllo
    }





    //resume audio
    // if (this.state.soundObj.isLoaded && !this.state.soundObj.isPlaying && this.state.currentAudio.id === audio.id) {
    //   const status = this.state.playbackObj.playAsync();
    //   return this.setState({ ...this.state, soundObj: status });
    // }

    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status })

    }


    //select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      return updateState(this.context, { currentAudio: audio, soundObj: status })
    }


  };


  rowRenderer = (type, item) => {
    // console.log(item)
    // return <Text style = {{ 
    //     padding:10,
    //     borderBottomColor:'black',
    //     borderBottomWidth:2,}}>{item.filename}</Text>

    return <AudioListItem
      title={item.filename}
      duration={item.duration}
      onAudioPress={() => this.handleAudioPress(item)}
      onOptionPress={() => {
        // console.log("opening option")
        this.currentItem = item;
        this.setState({ ...this.state, OptionModalVisible: true });
      }} />
  }
  render() {
    return <AudioContext.Consumer>
      {({ dataProvider }) => {
        return (
          <Screen>
            <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer} />
            <OptionModal
              onPlayListPress={() => console.log("item added")}
              onPlayPress={() => console.log("Playing audio")}
              currentItem={this.currentItem}
              onClose={() =>
                this.setState({ ...this.state, OptionModalVisible: false })
              } visible={this.state.OptionModalVisible} />
          </Screen>

        );
      }}
    </AudioContext.Consumer>


    // return (
    //   <ScrollView >
    //   {this.context.audioFiles.map(item => (<Text 
    //     style={{
    //       padding:10,
    //       borderBottomColor:'black',
    //       borderBottomWidth:2,
    //     }}
    //     key={item.id}>{item.filename}</Text>))}
    //   </ScrollView>
    // )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  }

})

export default AudioList