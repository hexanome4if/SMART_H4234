import React from 'react';
import { View } from 'native-base';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import actions from '../store/actions';
import { withTheme } from 'react-native-paper';

const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    authState: storeState.auth.authState,
  };
};

const mapDispatchToProps = (dispatch) => ({
  init: (history) => dispatch(actions.init(history)),
});

const Splash = (props) => {
  const { history, authState, init, theme } = props;

  useEffect(() => {
    init(history);
  }, []);

  useEffect(() => {
    if (authState === 'login') {
      history.replace('/login');
    } else if (authState === 'logged') {
      //history.replace('/chat');
      history.replace('/profile');
    }
  }, [authState]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/orientify.png')} />
      <ActivityIndicator animating={true} color={theme.colors.primary} size='large' />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTheme(Splash)));

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
});
