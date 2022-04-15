import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  Dimensions,
  ScrollView,
} from 'react-native';
import {TextInput, Caption, RadioButton, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginPage = ({navigation}) => {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Gender, setGender] = useState('male');
  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [hiddenPass, sethiddenPass] = useState(true);
  const [ConfirmPass, setConfirmPass] = useState('');
  const [hiddenConfirmPass, sethiddenConfirmPass] = useState(true);
  const [Processing, setProcessing] = useState(false);
  const [ShowDialog, setShowDialog] = useState(false);
  const [Code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  //planning to make the image dynamic in future
  const [Img, setImg] = useState(
    'https://picsum.photos/id/870/200/300?grayscale&blur=2',
  );

  const requestLogin = () => {
    if (
      Name === '' ||
      Email === '' ||
      Password === '' ||
      ConfirmPass === '' ||
      Gender === ''
    ) {
      return ToastAndroid.show(`Required fields are empty`, ToastAndroid.SHORT);
    }
    if (ConfirmPass !== Password)
      return ToastAndroid.show(`Passwords aren't matching`, ToastAndroid.SHORT);

    ToastAndroid.show(
      `Successfully requesting with your details`,
      ToastAndroid.SHORT,
    );
    callEmailAuth();
    // callPhoneAuth();
  };

  const callPhoneAuth = () => {
    setProcessing(true);
    auth()
      .signInWithPhoneNumber(Phone)
      .then(confirmation => {
        setShowDialog(true);
        setProcessing(false);
        setConfirm(confirmation);
      })
      .catch(e => {
        setProcessing(false);
        ToastAndroid.show(`Error ${e}`, ToastAndroid.SHORT);
      });
  };

  const callEmailAuth = () => {
    setProcessing(true);
    auth()
      .createUserWithEmailAndPassword(Email, Password)
      .then(() => {
        setProcessing(false);
        const uid = auth().currentUser.uid;
        firestore()
          .collection('accounts')
          .doc(uid)
          .set({name: Name, email: Email, gender: Gender, phone: Phone})
          .then(() => {
            ToastAndroid.show(`account details added`, ToastAndroid.SHORT);
            navigation.navigate('Login App');
          });
      })
      .catch(e => {
        setProcessing(false);
        navigation.navigate('Login App');
        if (e.code === 'auth/email-already-in-use') {
          return ToastAndroid.show(
            `That email address is already in use!`,
            ToastAndroid.SHORT,
          );
        }

        if (e.code === 'auth/invalid-email') {
          return ToastAndroid.show(
            `That email address is invalid!`,
            ToastAndroid.SHORT,
          );
        }

        ToastAndroid.show(`error:` + e, ToastAndroid.SHORT);
      });
  };

  const confirmCode = async () => {
    try {
      setProcessing(true);
      if (!confirm)
        return ToastAndroid.show(`Coudn't confirm`, ToastAndroid.SHORT);
      await confirm.confirm(Code);
      setShowDialog(false);
      setProcessing(false);
      ToastAndroid.show(`Phone number authenticated`, ToastAndroid.SHORT);
      navigation.navigate('Login App');
    } catch (err) {
      ToastAndroid.show('Invalid code', ToastAndroid.SHORT);
      navigation.navigate('Login App');
    }
  };

  return (
    <>
      {ShowDialog ? (
        <>
          <TextInput
            value={Code}
            onChangeText={text => setCode(text)}
            placeholder={`Put the 6-digit OTP here`}
            label={`OTP`}
          />
          <View style={styles.submit}>
            <Button
              style={styles.submitBtn}
              mode="contained"
              dark={true}
              color="#009688"
              loading={Processing}
              onPress={() => {
                confirmCode();
              }}
              onLongPress={() => {
                ToastAndroid.show(`Press to confirm`, ToastAndroid.SHORT);
              }}>
              Confirm Code
            </Button>
          </View>
        </>
      ) : (
        <ScrollView style={styles.container}>
          <ImageBackground style={styles.background} source={{uri: Img}}>
            <View style={styles.form}>
              <Caption style={styles.caption}>Login</Caption>
              <TextInput
                style={styles.fields}
                label={`Full Name`}
                placeholder={`Write Your Full Name`}
                value={Name}
                onChangeText={v => setName(v)}
                keyboardType="default"
                left={<TextInput.Icon name={`database-edit`} />} //TODO: person icon cannot be added
              />
              <View style={styles.radioGroup}>
                <Caption style={[{fontSize: 16}, styles.texts]}>
                  Gender:{' '}
                </Caption>
                <RadioButton.Group
                  value={Gender}
                  onValueChange={v => setGender(v)}>
                  <View style={styles.radios}>
                    <RadioButton value="male" />
                    <Text style={styles.texts}>Male</Text>
                    <RadioButton value="female" />
                    <Text style={styles.texts}>Female</Text>
                    <RadioButton value="other" />
                    <Text style={styles.texts}>Other</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <TextInput
                style={styles.fields}
                label={`Email ID`}
                placeholder={`yourmail@email.com`}
                value={Email}
                onChangeText={v => setEmail(v)}
                keyboardType="email-address"
                left={<TextInput.Icon name={`email`} />}
              />
              <TextInput
                style={styles.fields}
                label={`Phone Number`}
                placeholder={`+91xxxxxxxxxx`}
                value={Phone}
                onFocus={()=>{Phone || setPhone('+91')}}
                onChangeText={v => setPhone(v)}
                keyboardType="phone-pad"
                left={<TextInput.Icon name={`phone`} />}
              />
              <TextInput
                style={styles.fields}
                label={`Password`}
                placeholder={`choose a strong password`}
                value={Password}
                onChangeText={v => setPassword(v)}
                keyboardType="default"
                secureTextEntry={hiddenPass}
                left={<TextInput.Icon name={`form-textbox-password`} />}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => sethiddenPass(!hiddenPass)}
                  />
                }
              />
              <TextInput
                style={styles.fields}
                label={`Confirm Password`}
                placeholder={`Passwords should match`}
                value={ConfirmPass}
                onChangeText={v => setConfirmPass(v)}
                keyboardType="default"
                secureTextEntry={hiddenConfirmPass}
                left={<TextInput.Icon name={`form-textbox-password`} />}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => sethiddenConfirmPass(!hiddenConfirmPass)}
                  />
                }
              />

              <View style={styles.submit}>
                <Button
                  style={styles.submitBtn}
                  mode="contained"
                  dark={true}
                  color="#009688"
                  loading={Processing}
                  onPress={() => {
                    requestLogin();
                  }}
                  onLongPress={() => {
                    ToastAndroid.show(
                      `Press to proceed with your login`,
                      ToastAndroid.SHORT,
                    );
                  }}>
                  Proceed
                </Button>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      )}
    </>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    // height: Dimensions.get('screen').height,
  },
  background: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height,
  },
  texts: {
    color: 'white',
  },
  form: {
    margin: 20,
  },
  caption: {
    alignSelf: 'center',
    fontSize: 25,
    padding: 10,
    color: 'white',
    width: 300,
    textAlign: 'center',
  },
  fields: {
    margin: 5,
  },
  radioGroup: {
    // backgroundColor: '#e7e7e7',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  radios: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    // width: 200,
    marginHorizontal: 80,
  },
});
