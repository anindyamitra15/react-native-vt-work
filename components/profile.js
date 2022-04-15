import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Provider, Avatar, FAB, Portal, Modal, Button} from 'react-native-paper';

const Profile = () => {
  const [recentImage, setrecentImage] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcdsC6_g4tHOfg6UsEMCzvW4cqwK6nXUCljg&usqp=CAU',
  );

  const [visibility, setVisibility] = useState(false);

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
      if (pic.assets) {
        setrecentImage(pic.assets[0].uri);
        setVisibility(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <Provider>
      <Portal>
        <Modal
          contentContainerStyle={containerStyle}
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
      </View>
    </Provider>
  );
};

export default Profile;
