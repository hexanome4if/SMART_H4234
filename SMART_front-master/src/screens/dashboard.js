import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import Suggestions from '../components/suggestions';
import { Card } from 'react-native-paper';
import Meeting from '../components/meeting';
import ProfilePhoto from '../components/profile_photo';
import { connect } from 'react-redux';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  profile: storeState.profile.profile,
  meetings: storeState.meeting.scheduledMeetings,
});

const mapDispatchToProps = (dispatch) => ({
  getSuggestions: () => dispatch(actions.suggestions.getSuggestions()),
  getMeetings: () => dispatch(actions.meeting.getScheduledMeetings()),
});

function Dashboard(props) {
  const { history, profile, meetings, getMeetings, getSuggestions } = props;
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!meetings) {
      getMeetings();
    }
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMeetings();
    getSuggestions();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
    >
      {/* Chat requests */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', marginTop: 10 }}>
          {/* Picture */}
          <ProfilePhoto image_url={profile.avatar} counselor={profile.counselor} />
          {/* User basic infos */}
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{profile.displayName}</Text>
            <Text style={{ color: '#555' }}>@{profile.userName}</Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>{profile.status}</Text>
          </View>
        </View>
      </View>

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mes rendez-vous</Text>
      <TouchableOpacity
        style={{
          flex: 2,
        }}
        onPress={() => history.push(`/meetings`)}
      >
        <View>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Meeting meetings={meetings} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ flex: 4 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mes recommandations</Text>
        <ScrollView style={{ marginTop: 10, marginBottom: 10 }}>
          <Suggestions />
          {/* TODO: liens vers les users*/}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});
