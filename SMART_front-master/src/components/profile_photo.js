import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePhoto(props) {
  const { counselor } = props;
  return (
    <View style={{ alignSelf: 'center', position: 'relative' }}>
      <View style={styles.profileImage}>
        <Image source={{ uri: props.image_url }} style={styles.image} resizeMode='cover'></Image>
      </View>
      {counselor ? (
        <View style={styles.counselor}>
          <Ionicons name='ios-school' size={30} color='#1abc9c' style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  counselor: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
});
