import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, Image, Alert , I18nManager , Platform} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "./StarRating";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

const Card = ({ itemData, onPress, time }) => {
  //Share Challenge to social media
  const shareChallenge = async () => {
    try {
      const result = await Share.share({ title: itemData.title, message: `${I18n.t('Downloadchallengee')} : (${itemData.title}) ${I18n.t('Downloadchallenge')}
      https://www.challenge2021.com/download-
      `
   
    
    });
      if (result.action === Share.dismissedAction) alert(I18n.t('Notpublished'));
    } catch (error) {
      alert(error.message);
    }
  };


  const del = () => {
    Alert.alert(
      I18n.t('alert'),
      I18n.t('AreAredeletethischallenge'),
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('yes'),
          onPress: async () => {
            await Fire.deleteChallenge(itemData);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={itemData.rating > 2 ? ["#02aab0", "#00cdac"] : ["red", "#FD6161"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image
          style={styles.thumbnail}
          //source={{ uri: itemData.user?.image || "" }}   
          source={
            itemData.user?.image === "https://homepages.cae.wisc.edu/~ece533/images/boat.png"
              ? require("../../assets/cheering.png")
              : { uri: `${itemData.user?.image}` }
          }

          />

        <View style={styles.cardInfo}>
          <View style={styles.heading}>
          <Text style={styles.time}>{`${I18n.t('remainingtime')}${time}`}</Text>
            <View style={styles.icon}>
              <FontAwesome name="share-alt" color="#fff" size={25} onPress={shareChallenge} />
            </View>
            {itemData?.user?.uid == Fire.uid ? (
              <View style={styles.icon}>
                <FontAwesome name="trash-o" color="#fff" size={25} onPress={del} />
              </View>
            ) : null}
          </View>
          <View style={styles.heading}>
          <Text style={styles.cardTitle}>@{itemData.user?.username}</Text>
          </View>


          <Text style={styles.sub_title1}>{`${!itemData.isClosed ? I18n.t('open') : I18n.t('closed')} - ${itemData.country}`}</Text>

          <Text style={styles.sub_title}>
          {I18n.t('numberofparticipants')} {itemData.usersAnswered ? Object.keys(itemData.usersAnswered).length : 0}
          </Text>

          <View style={styles.prize}>
            <Text style={styles.sub_title}>{` ${I18n.t('firstprize')}: ${itemData.prizes?.[0]?.prize} ${I18n.t('balls')}`}</Text>
            <FontAwesome name="gift" color="#fff" size={15} style={{marginLeft:5}} />
          </View>
          <Text style={styles.sub_title}> {I18n.t('totalballs')} {`${itemData.balls || 0} ${I18n.t('silverball')}`}</Text>


          <View style={styles.balls}>
            <StarRating
              color="#fff"
              ratings={itemData.rating || 0}
              reviews={itemData.reviews ? itemData.reviews.length : 0}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    marginVertical: 9,
    borderRadius: 8,
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    shadowOpacity: 1,
  alignSelf: 'stretch',
    marginTop: 10,

    
  },
  thumbnail: {
    marginTop: 20,
    height: 160,
    width: 130,
    marginRight:10,
    marginLeft:10,
    borderRadius:10
    },
    
  cardInfo: {
    flex: 1,
    paddingStart: 5,
    marginLeft:10,
    marginRight:20,
    
  },
  cardTitle: {
    flex: 1,
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 15,
    paddingTop: 5,
    textAlign: "center",
    
  },
  sub_title: {
    color: "#fff",
    fontSize: 12,
    marginVertical: 5,
    paddingLeft:5,
    textAlign:'center'
    
    
  },
  sub_title1:{
    color: "#fff",
    fontSize: 12,
    marginVertical: 5,
    paddingLeft:0,
    textAlign:'center'

  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -3,

  },
  time: {
    flex: 1,
    fontSize: 12,
    color: "#F5F5F5",
    marginHorizontal: 5,
    textAlign:'center'
    
  },
  balls: {
    alignItems: "center",
    paddingTop:2

  },
  icon: {
    borderStartWidth: 1,
    borderStartColor: "#fff",
    paddingHorizontal: 5,
  },
  prize: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft:20

  },
});
