import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Avatar } from 'react-native-paper';
import Ellipsis from '../components/ellipsis';
import Parcours from '../components/parcours';
import PorfilePhoto from '../components/profile_photo';
import { SceneMap } from 'react-native-tab-view';
import FAQ from '../components/faq';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Skills from '../components/skills';
import Interests from '../components/interests';
import { Tabs, TabScreen } from 'react-native-paper-tabs';
import actions from '../store/actions';
import { connect } from 'react-redux';

const LeftContent = (props) => <Avatar.Icon {...props} icon='school' />;

const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    profile: storeState.profile.profile,
    profileState: storeState.profile.profileState,
    profileHeader: storeState.auth.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(actions.profile.getProfile()),
  };
};

const renderScene = SceneMap({
  parcours: Parcours,
});

const TabContent = () => (
  <View>
    <Text>Hi</Text>
  </View>
);

const Tab = createMaterialTopTabNavigator();

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function Profile(props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const { profile, getProfile, profileState } = props;

  if (profileState === 'not_loaded') {
    getProfile();
  }

  console.log(profile)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProfile();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {profileState !== 'ready' ? (
          <ActivityIndicator size='large' color='#1abc9c' />
        ) : (
          <View style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 10 }}>
              <Ellipsis name='ellipsis-horizontal-outline' status='rw' />
              <View style={{ flexDirection: 'row', right: 10, marginTop: -20 }}>
                <View style={{ marginLeft: 20 }}>
                  <PorfilePhoto image_url={profile.avatar} counselor={profile.counselor} />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.text, { fontWeight: '200', fontSize: 30, textAlign: 'center' }]}>
                    {profile.displayName}
                  </Text>
                  <Text style={[styles.text, { fontWeight: '200', fontSize: 14 }]}>@{profile.userName}</Text>
                  <Text style={[styles.text, { fontWeight: '200', fontSize: 14 }]}>{profile.level.label}</Text>
                  <Text style={[styles.text, { color: '#1abc9c', fontSize: 14 }]}>
                    {profile.counselor ? 'Disponible pour orienter' : 'En recherche de renseignement'}
                  </Text>
                  <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14, textAlign: 'center' }]}>
                    {profile.status}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, flexGrow: 100, flexShrink: 100 }}>
              <Tabs
                uppercase={false}
                style={{ backgroundColor: '#fff', underlayColor: '#27ae60' }}
                underlayColor={'gray'}
              >
                <TabScreen label='Parcours'>
                  <Parcours userProfile={profile} />
                </TabScreen>
                <TabScreen label='Domaines'>
                  <ScrollView>
                    <Skills userProfile={profile} />
                    <Interests userProfile={profile} />
                  </ScrollView>
                </TabScreen>
                <TabScreen label='FAQ'>
                  <FAQ faqs = {profile.faqs} />
                </TabScreen>
              </Tabs>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: '#52575D',
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
    alignSelf: 'flex-end',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 0,
    flex: 1,
    justifyContent: 'center',
  },
  tabs: {
    paddingTop: 20,
    flex: 1,
  },
});
