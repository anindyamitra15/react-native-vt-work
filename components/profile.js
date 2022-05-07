import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, ToastAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Provider, Avatar, FAB, Portal, Modal, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import * as session from './session';

const Profile = () => {
  useEffect(() => {
    //grab the auth
    const id = auth().currentUser.uid;
    setuserId(id);
    firestore()
      .collection('accounts')
      .doc(id)
      .get()
      .then(({_data}) => {
        setrecentImage(_data.image)
      }).catch(e => alert('You are offline'));
  }, [userId]);
  const [recentImage, setrecentImage] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdsC6_g4tHOfg6UsEMCzvW4cqwK6nXUCljg&usqp=CAU',
  );
  const [visibility, setVisibility] = useState(false);
  const [userId, setuserId] = useState('');

  const captureImage = async type => {
    let options = {
      quality: 1,
      saveToPhotos: true,
      mediaType: 'photo',
    };

    let pic;

    try {
      if (type === 'camera') {
        pic = await launchCamera(options);
      } else {
        pic = await launchImageLibrary(options);
      }
      if (pic?.assets) {
        setrecentImage(pic.assets[0].uri);
        setVisibility(false);
      } else {
        alert('Please try again');
      }
    } catch (e) {
      alert(e);
    }
  };

  const updateProfile = async () => {
    try {
      let stg;
      let task;
      let url;
      if (recentImage.indexOf('http') <= -1) {
        //if it isn't a hyperlink
        stg = storage().ref(`images/${userId}.jpg`);
        task = await stg.putFile(recentImage);
        url = await stg.getDownloadURL();
      } else url = recentImage;
      await firestore().collection('accounts').doc(userId).update({
        image: url,
      });
      ToastAndroid.show('Image updated', ToastAndroid.SHORT);
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  const refreshPhoto = () => {
    firestore()
      .collection('accounts')
      .doc(userId)
      .get()
      .then(({_data}) => {
        setrecentImage(_data.image);
      }).catch(e => alert(e));
  }

  return (
    <Provider>
      <Portal>
        <Modal
          contentContainerStyle={{backgroundColor: 'white', padding: 20}}
          visible={visibility}
          onDismiss={() => {
            setVisibility(false);
          }}>
          <View>
            <Button icon={'camera'} onPress={() => captureImage('camera')}>
              Camera
            </Button>
            <Button icon={'apps'} onPress={() => captureImage('library')}>
              Gallery
            </Button>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button
              onPress={() => {
                setVisibility(false);
              }}>
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>

      <Text style={{alignSelf: 'center', fontSize: 30}}>Profile</Text>
      <View style={[{alignItems: 'center', marginVertical: 20}]}>
        <Avatar.Image source={{uri: recentImage || ''}} size={100} />
      </View>
      <View style={{alignItems: 'center'}}>
        <FAB
          small
          icon={'pencil'}
          onPress={() => {
            setVisibility(true);
          }}
        />
        <Pressable
          style={{margin: 20}}
          onPress={updateProfile}>
          <Text style={{color: 'blue'}}>Update Profile</Text>
        </Pressable>
        <Pressable
          style={{margin: 20}}
          onPress={refreshPhoto}>
          <Text style={{color: 'blue'}}>Refresh Profile</Text>
        </Pressable>
      </View>
    </Provider>
  );
};

export default Profile;
