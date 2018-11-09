/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Image, ImageBackground } from 'react-native';
import Forecast from './Forecast';
import MomentList from './MomentList'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    resizeMode: 'repeat'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    height: "auto",
    width: "50%"
  }
});





export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '',
      forecast: {
        main: 'Cloud',
        description: 'few clouds',
        temp: 45.7
      }
    }
  }
  handleTextChange = (event) => {
    console.log(event.nativeEvent.text);
    let city = event.nativeEvent.text;
    this.setState((prev, props) => Object.assign(prev, { city }))
    fetch(`http://wthrcdn.etouch.cn/weather_mini?city=${encodeURIComponent(city)}`)
      .then((resp) => resp.text())
      .then((respText) => {
        let respObject = JSON.parse(respText);
        this.setState((prev, props) => {
          try {
            return Object.assign(prev, {
              forecast: {
                main: respObject.data.forecast[0].type,
                description: respObject.data.forecast[0].fengxiang,
                temp: `${respObject.data.forecast[0].low}~${respObject.data.forecast[1].high}`
              }
            })
          } catch{
            return prev
          }
        }
        )
        return respText
      })
      .then((respText) => console.log(respText))
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <ImageBackground source={require('./img/sample_photo_0.png')} style={styles.container}>
        <MomentList />
      </ImageBackground>
    );
  }
}


