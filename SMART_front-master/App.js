import React, { useEffect } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NativeRouter, Route, Switch, withRouter } from 'react-router-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';
import BottomNavigation, { FullTab } from 'react-native-material-bottom-navigation';
import { BackHandler, View, StyleSheet, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import routes, { getCurrentRoute } from './src/routes';
import Stack from 'react-router-native-stack';
import SpringWsProvider from './src/components/spring-ws-provider';
import NotificationProvider from './src/components/notification-provider';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1abc9c',
  },
  // Do whatever you want here
};

const Bottombar = (props) => {
  const tabs = routes.reduce((prev, cur) => {
    if (cur.bottomBar) {
      prev.push({
        key: cur.path,
        title: cur.bottomBar.title,
        icon: cur.bottomBar.icon,
        barColor: cur.bottomBar.color,
      });
    }
    return prev;
  }, []);

  const routesPath = routes.map((r) => r.key);

  const RenderIcon = (icon) => ({ isActive }) => <Icon size={24} color='white' name={icon} />;

  const RenderTab = ({ tab, isActive }) => (
    <FullTab isActive={isActive} key={tab.key} label={tab.title} renderIcon={RenderIcon(tab.icon)} />
  );

  useEffect(() => {
    const currentRoute = getCurrentRoute(props.location);
    if (currentRoute?.bottomBar) {
      props.setActiveTab(currentRoute.path);
    }
  }, [props.location]);

  const onTabPress = (newTab) => {
    props.history.replace(newTab.key);
  };

  const onBackPress = () => {
    if (props.history.index > 0) {
      props.history.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return getCurrentRoute(props.location)?.showBottomBar ? (
    <BottomNavigation activeTab={props.activeTab} onTabPress={onTabPress} renderTab={RenderTab} tabs={tabs} />
  ) : null;
};

const RouterBottombar = withRouter(Bottombar);

// App wrapper
const App = () => {
  const [activeTab, setActiveTab] = React.useState('/profile');
  return (
    <ReduxProvider store={store}>
      <SpringWsProvider>
        <PaperProvider theme={theme}>
          <NativeRouter>
            <View style={{ flex: 1 }}>
              <Stack animationType='slide-horizontal'>
                <View style={styles.appContainer}>

                  <NotificationProvider>
                    <StatusBar barStyle='dark-content' hidden={false} translucent={true} />
                    {routes.map((route) => (
                      <Route key={route.path} exact path={route.path} component={route.component} />
                    ))}

                  </NotificationProvider>
                </View>
              </Stack>
            </View>
            <RouterBottombar activeTab={activeTab} setActiveTab={setActiveTab} />
          </NativeRouter>
        </PaperProvider>
      </SpringWsProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});

export default App;
