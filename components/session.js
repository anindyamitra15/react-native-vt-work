import AsyncStorage from '@react-native-async-storage/async-storage';
const LOGIN = 'log-in';


export const HoldSession = async () => {
  try {
    await AsyncStorage.setItem(LOGIN, true);
  } catch (e) {
    alert(e);
  }
};

export const CheckSession = async () => {
  return ((await AsyncStorage.getItem(LOGIN)) === 'true');
};

export const SAVE_DATA = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const GET_DATA = async key => {
  await AsyncStorage.getItem(key);
};

export const DELETE_ALL = async () => {
  await AsyncStorage.clear();
};
