import React, { useRef } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { Button, Colors } from 'react-native-paper';

export default class NotificationProvider extends React.Component {
  static instance;

  currentAnimation = null;
  closeTimeout = null;

  constructor(props) {
    super(props);
    NotificationProvider.instance = this;
    this.state = {
      notifications: [],
      isAppearing: false,
      isDisappearing: false,
      yPosition: new Animated.Value(-100),
      opacity: new Animated.Value(0),
      shownNotification: null,
    };
  }

  static showNotification = (message, status, duration, cantRemove = false, buttonTitle, buttonCallback) => {
    return NotificationProvider.instance.pushNotification(
      message,
      status,
      duration,
      cantRemove,
      buttonTitle,
      buttonCallback,
    );
  };

  static dismissNotification = (id) => {
    NotificationProvider.instance.removeNotification(id);
  };

  render = () => {
    console.log(this.state.shownNotification);
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        {this.props.children}
        {this.state.shownNotification ? this.renderNotification(this.state.shownNotification) : null}
      </View>
    );
  };

  renderNotification = (notification) => {
    console.log('Render notif');
    return (
      <Animated.View
        style={{
          opacity: this.state.opacity,
          transform: [{ translateY: this.state.yPosition }],
          backgroundColor: this.colorFromStatus(notification.status),
          position: 'absolute',
          top: 5,
          left: 5,
          right: 5,
          borderRadius: 10,
          zIndex: 100,
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => (notification.cantRemove ? null : this.removeNotification(notification.id))}
        >
          <Text style={{ color: 'white' }}>{notification.message}</Text>
          {notification.buttonTitle ? (
            <Button
              onPress={() => {
                this.removeNotification(notification.id);
                if (notification.buttonCallback) notification.buttonCallback();
              }}
            >
              <Text style={{ color: 'white' }}>{notification.buttonTitle}</Text>
            </Button>
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  pushNotification = (message, status, duration, cantRemove = false, buttonTitle, buttonCallback) => {
    const id = Math.floor(Math.random() * 100000);
    this.state.notifications.push({
      message,
      status,
      duration,
      id,
      cantRemove,
      buttonTitle,
      buttonCallback,
    });
    this.setState(this.state);
    this.handleQueue();
    return id;
  };

  removeNotification = (id) => {
    if (this.state.shownNotification && this.state.shownNotification.id === id) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
      this.hideNotification();
    } else {
      const index = this.state.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        this.state.notifications.splice(index, 1);
      }
    }
  };

  colorFromStatus = (status) => {
    switch (status) {
      case 'error':
        return Colors.red400;
      case 'info':
        return Colors.blue400;
      case 'success':
        return Colors.green400;
    }
  };

  handleQueue = () => {
    if (!this.state.shownNotification && this.state.notifications.length) {
      const notification = this.state.notifications[0];
      this.showNotification(notification);
    }
  };

  showNotification = (notification) => {
    this.currentAnimation = Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        easing: Easing.linear,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yPosition, {
        toValue: 0,
        easing: Easing.back(1),
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    this.currentAnimation.start(() => {
      console.log('End animation');
      this.currentAnimation = null;
      this.setState({ isAppearing: false });
    });

    if (notification.duration) {
      this.closeTimeout = setTimeout(this.hideNotification, notification.duration * 1000);
    }

    this.setState({ isAppearing: true, shownNotification: notification });
  };

  hideNotification = () => {
    this.closeTimeout = null;
    console.log('Remove notification after some time');
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }
    this.currentAnimation = Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        easing: Easing.linear,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yPosition, {
        toValue: -100,
        easing: Easing.back(0),
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
    this.currentAnimation.start(() => {
      console.log('End close animation');
      this.currentAnimation = null;
      this.state.notifications.shift();
      this.setState({ isAppearing: false, shownNotification: null });
      this.handleQueue();
    });
    this.setState({ isDisappearing: true, isAppearing: false });
  };
}
