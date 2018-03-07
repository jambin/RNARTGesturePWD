/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';

import GesturePassword from './rnlibary/views/GesturePWD/GesturePassword.js';

class App extends Component {
	constructor(props){
        super(props);
        this.state = {
            pwd:[]
        };
    }
   render() {
     return (
       <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text style={{ margin:20,fontSize: 20, color: '#666666' }} >{"密码如下:" + JSON.stringify(this.state.pwd)}</Text>
                <GesturePassword ref={(gpwd)=>this.gesturePassword = gpwd} getPWD={this._getPWD.bind(this)} />
                <TouchableOpacity activeOpacity={0.7} onPress={()=>this.gesturePassword.reset()}>
                    <Text style={{marginTop:20, width:50, height:30, backgroundColor:'#999999', textAlign:'center'}}>重置</Text>
                </TouchableOpacity>
        </View>
     );
   }
   _getPWD(arr){
        this.setState({pwd:arr});
   }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;