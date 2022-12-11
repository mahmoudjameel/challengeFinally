import React, { Component } from 'react';
import { View, Text , TouchableOpacity, I18nManager,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import I18n from '../Translation/I18n';
 import ActionSheet from 'react-native-actionsheet'
 import {Restart} from 'fiction-expo-restart';
 import { LinearGradient } from "expo-linear-gradient";

 import * as Animatable from 'react-native-animatable';
 import { ActionSheetProvider } from '@expo/react-native-action-sheet'

export default class lang extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  showActionSheet = () => {
    this.ActionSheet.show()
}

  async Action(index) {
    if (index == 0) {
        try {
            await AsyncStorage.setItem("language", "ar");
            I18n.locale = "ar";
            I18n.defaultLocale = "ar";
        } catch (error) {
            console.log(` Hi Errorrrr : ${error}`);
        }
        I18nManager.forceRTL(true);
        Restart();

    } else if (index == 1) {
        try {
            await AsyncStorage.setItem("language", "en");
            I18n.locale = "en";
            I18n.defaultLocale = "en";
        } catch (error) {
            console.log(` Hi Errorrrr : ${error}`);
        }
        I18nManager.forceRTL(false);
        Restart();
      }
}


  render() {

    return (
      <LinearGradient colors={["#2b5876", "#4e4376"]} style={{    flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
    }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop:50 }}>
      <Image source={require('../../../logo.png')} style={{ resizeMode: 'center'}}/>

                            <Animatable.View animation="bounceInLeft"  style={{marginVertical : 15}}>

     <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                            <Text style={{ fontFamily: "Feather",fontSize : 17 ,color : 'white'  }}>{I18n.t('language')}</Text>
                            <TouchableOpacity style={{ }} onPress={this.showActionSheet}>
                                <ActionSheet
                                    ref={o => this.ActionSheet = o}
                                    title={I18n.t('SelectLanguage')}
                                    options={['العربية', 'English', 'cancel']}
                                    destructiveButtonIndex={I18nManager.isRTL ? 0 : 1}
                                    onPress={(index) => { this.Action(index) }}
                                />
                                <Text style={{ color: "#0C9EBF", fontFamily: "Roboto", marginLeft:10}}>{I18n.t('changeLanguage')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" , marginTop:10}}>
                        <Text note style={{ fontFamily: "Roboto", fontSize : 16 ,color : '#2a9d8f' }}>{I18nManager.isRTL ? 'العربية': I18n.t('english')}</Text>
                        </View>
                        </Animatable.View>
      </View>
      </LinearGradient>
    );
  }
}
