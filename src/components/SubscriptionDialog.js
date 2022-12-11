import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../screens/Translation/I18n';

const SubscriptionDialog = ({ visible, onTouchOutside, onPressPayPal, onPressPayTaps }) => {
  const renderFooter = () => {
    return (
      <DialogFooter>
        <DialogButton align="center" text={I18n.t('cancel')} onPress={onTouchOutside} />
      </DialogFooter>
    );
  };

  return (
    <Dialog
      visible={visible}
      onTouchOutside={onTouchOutside}
      dialogStyle={{ backgroundColor: "#02aab0", width: "80%" }}
      dialogTitle={<DialogTitle style={{ backgroundColor: "#02aab0" }} align="center" title="اختر نوع الدفع" />}
      dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      footer={renderFooter()}
    >
      <DialogContent style={styles.dialogContent}>
        {/* <TouchableOpacity onPress={onPressPayTaps}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <FontAwesome5 name="credit-card" color="#fff" size={20} />
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, alignSelf: "center" }}>
            {I18n.t('Paybycard')}
            </Text>
          </LinearGradient>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={onPressPayPal}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <FontAwesome5 name="cc-paypal" color="#fff" size={20} />
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, alignSelf: "center" }}>
            {I18n.t('PaybyPayPal')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    marginTop: 40,
  },
  dialogContent: {
    backgroundColor: "#02aab0",
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    margin: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#fff",
  },
  input: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  cardinfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  month: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
});
