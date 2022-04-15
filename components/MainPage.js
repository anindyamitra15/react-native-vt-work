import React, {useEffect} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
const MainPage = ({navigation}) => {
  return (
    <>
      <Text>Only Login</Text>
      <Button style = {styles.submitBtn}
        mode="contained"
        onPress={() => {
          navigation.navigate('Sign Up');
        }}>
        Login
      </Button>
    </>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  submitBtn: {
    marginHorizontal: 80,
  },
});
