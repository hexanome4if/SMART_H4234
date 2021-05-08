import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import actions from '../store/actions';
import { connect } from 'react-redux';
import { Button, TextInput } from 'react-native-paper';
import { registerForPushNotificationsAsync } from '../services/push-notif';

const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    authState: storeState.auth.authState,
    loginError: storeState.auth.loginError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password, deviceToken) => dispatch(actions.auth.login(username, password, deviceToken)),
  };
};

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (props.authState === 'logged') {
      props.history.replace('/profile');
    }
  }, [props.authState]);

  async function handleClick() {
    const token = await registerForPushNotificationsAsync();
    console.log('Device token', token);
    props.login(username, password, token);
  }

  const isLoading = props.authState === 'login_processing';

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/orientify.png')} />
      <StatusBar style='auto' />
      {props.loginError ? <Text style={{ color: 'red' }}> {props.loginError} </Text> : null}

      <View style={{ paddingHorizontal: 30, width: '100%', marginBottom: 20 }}>
        <TextInput
          label={"Nom d'utilisateur"}
          onChangeText={(value) => setUsername(value)}
          value={username}
          style={{ marginBottom: 10, backgroundColor: 'transparent' }}
        />
        <TextInput
          label='Mot de passe'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={{ backgroundColor: 'transparent' }}
          value={password}
        />
      </View>
      <Button onPress={handleClick} mode='contained' loading={isLoading} disabled={isLoading}>
        Me connecter
      </Button>

      <TouchableOpacity>
        <Button mode='text' style={{ marginTop: 20 }} disabled={isLoading}>
          Mot de passe oubié ?
        </Button>
      </TouchableOpacity>

      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      <Text style={styles.noAcc_button}> Pas encore inscrit ? </Text>

      <Button mode='contained' onPress={() => props.history.push('/registration')} disabled={isLoading}>
        M'inscrire
      </Button>

      {/* <Button onPress={() => props.history.replace('/profile')}>Bypass connection</Button> */}
    </View>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7ecee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: '#7ed6df',
    borderRadius: 30,
    width: '80%',
    height: 45,
    marginBottom: 20,

    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 10,
  },

  noAcc_button: {
    height: 30,
    marginTop: 40,
  },

  loginBtn: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22a6b3',
    marginBottom: 40,
  },

  signUpBtn: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a085',
  },
});
