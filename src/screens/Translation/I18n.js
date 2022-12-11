import I18n from 'react-native-i18n'

import en from './en';
import ar from './ar';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

I18n.fallbacks = true;
I18n.translations = {
  ar,
  en
};


 //Set language according to selected lang
 AsyncStorage.getItem('language').then(async (value) => {
   (I18n.locale == 'ar-EG') || (value == 'ar') ? I18nManager.forceRTL(true) : 
                                              I18nManager.forceRTL(false);
   I18n.locale = (value == 'ar') ? 'ar-EG' : I18n.locale ;
 });


export default I18n;