import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import Ellipsis from '../components/ellipsis';
import Parcours from '../components/parcours';
import PorfilePhoto from '../components/profile_photo';
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
    visitProfile: storeState.visitProfile.visitProfile,
    visitProfileState: storeState.visitProfile.visitProfileState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVisitProfile: (id) => dispatch(actions.visitProfile.getVisitProfile(id)),
  };
};

const Tab = createMaterialTopTabNavigator();

function VisitProfile(props) {
  const { visitProfile, getVisitProfile, visitProfileState } = props;

  useEffect(() => {
    getVisitProfile(props.match.params.id);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!visitProfile ? (
        <ActivityIndicator size='large' color='#1abc9c' />
      ) : (
        <View style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{}}>
            <Ellipsis name='ellipsis-horizontal-outline' status='r' userId={visitProfile.userId} />
            <View style={{ flexDirection: 'row', right: 10, marginTop: -20 }}>
              <View style={{ marginLeft: 30 }}>
                <PorfilePhoto image_url={visitProfile.avatar} counselor={visitProfile.counselor} />
              </View>
              <View style={styles.infoContainer}>
                <Text style={[styles.text, { fontWeight: '200', fontSize: 30, textAlign: 'center' }]}>
                  {visitProfile.displayName}
                </Text>
                <Text style={[styles.text, { fontWeight: '200', fontSize: 14 }]}>@{visitProfile.userName}</Text>
                <Text style={[styles.text, { fontWeight: '200', fontSize: 14 }]}>Bac+{visitProfile.levelId}</Text>
                <Text style={[styles.text, { color: '#1abc9c', fontSize: 14 }]}>
                  {visitProfile.counselor ? 'Disponible pour orienter' : 'En recherche de renseignement'}
                </Text>
                <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14, textAlign: 'center' }]}>
                  {visitProfile.status}
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
                <Parcours userProfile={visitProfile} />
              </TabScreen>
              <TabScreen label='Domaines'>
                <ScrollView>
                  <Skills userProfile={visitProfile} />
                  <Interests userProfile={visitProfile} />
                </ScrollView>
              </TabScreen>
              <TabScreen label='FAQ'>
                <FAQ faqs={visitProfile.faqs}/>
              </TabScreen>
            </Tabs>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitProfile);

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
