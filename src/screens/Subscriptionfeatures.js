import React, { Component } from 'react'
import WebView from 'react-native-webview'
import {  SafeAreaView } from 'react-native';

export default class Subscriptionfeatures extends Component {
  render() {
    return (

      <SafeAreaView style={{flex:1,backgroundColor: '#648e9c' }} >

      <WebView source={{ uri: 'https://www.challenge2021.com/-mzaya-alashtrakat' }} style={{ marginBottom: 20 }} />
      
      </SafeAreaView>

    );
    
    

    
  }
}