import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons ,FontAwesome5} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
import AudioList from "./AudioList";
import Player from './Player';
import PlayList from './PlayList';


const Tab  = createBottomTabNavigator();

const AppNavigator = () => {
  return <Tab.Navigator>
  <Tab.Screen name="AudioList" component={AudioList} options={{
    tabBarIcon: ({color,size}) =>{
        return <MaterialIcons name="headset" size={size} color={color} />
    }
  }}/>
  <Tab.Screen name="Player" component={Player} options={{
    tabBarIcon: ({color,size}) =>
    {return <FontAwesome5 name="compact-disc" size={size} color={color} />
        
    }

  }}/>
  <Tab.Screen name="PlayList" component={PlayList} options={{
    tabBarIcon: ({color,size}) =>{
      return <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
    }
  }}/>
  </Tab.Navigator>
    
  
}

export default AppNavigator

const styles = StyleSheet.create({})