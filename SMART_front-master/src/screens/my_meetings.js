import moment from 'moment';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  receivedRequests: storeState.meeting.receivedRequests,
  sentRequests: storeState.meeting.sentRequests,
  scheduledMeetings: storeState.meeting.scheduledMeetings,
});

const mapDispatchToProps = (dispatch) => ({
  getReceivedRequests: () => dispatch(actions.meeting.getReceivedRequests()),
  getSentRequests: () => dispatch(actions.meeting.getSentRequests()),
  getScheduledMeetings: () => dispatch(actions.meeting.getScheduledMeetings()),
  acceptMeeting: (request) => dispatch(actions.meeting.acceptOrRefuseRequest(request.meetingId, true)),
  refuseMeeting: (request) => dispatch(actions.meeting.acceptOrRefuseRequest(request.meetingId, false)),
  createMeeting: (meetingLabel, date, otherUserId) =>
    dispatch(actions.meeting.createMeeting(meetingLabel, date, otherUserId)),
  cancelMeeting: (meeting) => dispatch(actions.meeting.cancelMeeting(meeting.meetingId)),
});

const state = 'ok';

const ReceivedMeetingRequest = (props) => {
  const { request, acceptMeeting, refuseMeeting } = props;
  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        marginBottom: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 20,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'column', marginRight: 100, flexShrink: 0 }}>
        <Text style={{ fontSize: 20, flexGrow: 100, flexShrink: 100 }}>{request.label}</Text>
        <Text style={{ fontSize: 14, flexGrow: 100, flexShrink: 100, color: '#AEB5BC' }}>
          {moment(request.date).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginRight: 10, flexShrink: 0, width: 75 }}>
        <IconButton icon={'check'} color={'#0f0'} style={{ margin: 0 }} onPress={() => acceptMeeting(request)} />
        <IconButton icon={'close'} color={'#f00'} style={{ margin: 0 }} onPress={() => refuseMeeting(request)} />
      </View>
    </View>
  );
};

const SentMeetingRequest = (props) => {
  const { request, cancelRequest } = props;
  const handleClick = () => {
    cancelRequest(request);
  };
  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        marginBottom: 10,
        flexDirection: 'row',
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: 'column', marginRight: 80, flexShrink: 0, paddingLeft: 20 }}>
        <Text style={{ fontSize: 20, flexGrow: 100, flexShrink: 100 }}>{request.label}</Text>
        <Text style={{ fontSize: 14, flexGrow: 100, flexShrink: 100, color: '#AEB5BC' }}>
          {moment(request.date).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginRight: 10, flexShrink: 0 }}>
        <Button onPress={handleClick} mode='contained'>
          Annuler
        </Button>
      </View>
    </View>
  );
};

const UpcomingMeeting = (props) => {
  const { meeting, cancelMeeting } = props;
  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        marginBottom: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 20,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'column', marginRight: 5, flex: 6 }}>
        <Text style={{ fontSize: 20, flexGrow: 100, flexShrink: 100 }}>{meeting.label}</Text>
        <Text style={{ fontSize: 14, flexGrow: 100, flexShrink: 100, color: '#AEB5BC' }}>
          {moment(meeting.date).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', marginRight: 10, flex: 4, justifyContent: 'flex-end' }}>
        <Button onPress={() => cancelMeeting(meeting)} mode='contained'>
          Annuler
        </Button>
      </View>
    </View>
  );
};

function MyMeetings(props) {
  const {
    history,
    receivedRequests,
    sentRequests,
    scheduledMeetings,
    getReceivedRequests,
    getSentRequests,
    getScheduledMeetings,
    createMeeting,
    cancelMeeting,
    acceptMeeting,
    refuseMeeting,
  } = props;

  console.log('Sent requests from redux', sentRequests);

  useEffect(() => {
    if (!receivedRequests) {
      getReceivedRequests();
    }
    if (!sentRequests) {
      getSentRequests();
    }
    if (!scheduledMeetings) {
      getScheduledMeetings();
    }
    // createMeeting('Test meeting', new Date(), 3);
  }, [state]);

  return (
    <FlatList
      style={styles.container}
      data={[
        <View style={{}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Demandes reçues</Text>
          <FlatList
            style={{ marginTop: 10, marginBottom: 10 }}
            data={receivedRequests}
            renderItem={({ item }) => (
              <ReceivedMeetingRequest request={item} acceptMeeting={acceptMeeting} refuseMeeting={refuseMeeting} />
            )}
            keyExtractor={(item) => item.meetingId}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Aucune demande reçue</Text>}
          />
        </View>,
        <View style={{}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Demandes envoyées</Text>
          <FlatList
            style={{ marginTop: 10, marginBottom: 10 }}
            data={sentRequests}
            renderItem={({ item }) => <SentMeetingRequest request={item} cancelRequest={cancelMeeting} />}
            keyExtractor={(item) => item.meetingId}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Aucune demande envoyée</Text>}
          />
        </View>,
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Rendez-vous prévus</Text>
          <FlatList
            style={{ marginTop: 10, marginBottom: 10 }}
            data={scheduledMeetings}
            renderItem={({ item }) => <UpcomingMeeting meeting={item} cancelMeeting={cancelMeeting} />}
            keyExtractor={(item) => item.meetingId}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Aucun rendez-vous prévu</Text>}
          />
        </View>,
      ]}
      renderItem={({ item }) => item}
      keyExtractor={(item, index) => index}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyMeetings));
