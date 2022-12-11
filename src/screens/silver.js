
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import I18n from './Translation/I18n';

export default function silver({ navigation }) {
  return (
    <SafeAreaView style={{flex:1,backgroundColor: '#648e9c' }} >

    <View style={styles.container}>
          <Image source={require('../../assets/2.jpeg')}  style={styles.backgroundImage}/>
      </View>
      <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={["#bdc3c7", "#D3D3D3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}> {I18n.t('back')}  </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
          </SafeAreaView>
      );
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  
    alignItems: "center",
    // remove width and height to override fixed static size
  },
  backgroundImage:{
    flex: 1,
    resizeMode: 'stretch', // or 'stretch'
    width:'100%',

  },
  button: {
    alignItems: "center",
   margin:10
  },
  signIn: {
    flexDirection: "row",
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },



});
    





















