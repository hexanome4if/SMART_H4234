import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import actions from '../store/actions';
import { prettyPrintFromNow } from '../utils/date-util';
import NotificationProvider from '../components/notification-provider';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  isFetchingDiscussions: storeState.chat.isFetchingDiscussions,
  requests: storeState.chat.requests,
  discussions: storeState.chat.discussions,
  currentUserId: storeState.auth.currentUser.userId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDiscussions: () => dispatch(actions.chat.getDiscussions()),
  fetchRequests: () => dispatch(actions.chat.getRequests()),
  acceptRequest: (request) => dispatch(actions.chat.acceptOrRefuseRequest(request, true)),
  refuseRequest: (request) => dispatch(actions.chat.acceptOrRefuseRequest(request, false)),
});

const ChatRequest = (props) => {
  const { request, acceptRequest, refuseRequest } = props;
  const { label } = request;

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
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginRight: 10,
          flexShrink: 0,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon={'check'} color={'#0f0'} style={{ margin: 0 }} onPress={() => acceptRequest(request)} />
          <IconButton icon={'close'} color={'#f00'} style={{ margin: 0 }} onPress={() => refuseRequest(request)} />
        </View>
      </View>
    </View>
  );
};

const Discussion = (props) => {
  const { discussion, history, openDiscussion, userId } = props;
  const { label, messages } = discussion;

  const onClick = () => {
    history.push(`/chat/discussion/${discussion.chatId}`);
  };

  let lastMessage = null;
  let newMessages = false;
  if (messages.length) {
    lastMessage = (
      <>
        <Text>{messages[messages.length - 1].content}</Text>
        <Text style={{ fontSize: 12, color: '#555' }}>
          {prettyPrintFromNow(new Date(messages[messages.length - 1].msgDate))}
        </Text>
      </>
    );
    const meAsParticipant = discussion.participants.find((p) => p.userId === userId);
    if (moment(discussion.lastMessageDate) > moment(meAsParticipant.lastOpen)) {
      newMessages = true;
    }
  }

  return (
    <TouchableOpacity
      style={{
        marginBottom: 10,
      }}
      onPress={onClick}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 0.5,
          borderRadius: 10,
          alignItems: 'center',
          paddingLeft: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, color: newMessages ? 'red' : 'black' }}>{label}</Text>
          {lastMessage}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Chat = (props) => {
  const [state] = useState(null);
  const {
    history,
    isFetchingDiscussions,
    requests,
    discussions,
    fetchDiscussions,
    fetchRequests,
    acceptRequest,
    refuseRequest,
    openDiscussion,
    currentUserId,
  } = props;

  useEffect(() => {
    fetchRequests();
    if (!isFetchingDiscussions && (discussions === null || discussions === undefined)) {
      fetchDiscussions();
    }
    // NotificationProvider.showNotification('Test notifications', 'success', 0);
  }, [state]);

  return (
    <ScrollView style={styles.container}>
      {/* Chat requests */}
      {requests && requests.length ? (
        <View style={{}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Demandes de chat</Text>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            {requests.map((request) => (
              <ChatRequest
                key={request.chatId.toString()}
                request={request}
                acceptRequest={acceptRequest}
                refuseRequest={refuseRequest}
              />
            ))}
          </View>
        </View>
      ) : null}
      {/* Conversations */}
      <View style={{}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mes conversations</Text>
          <IconButton icon={'message-plus'} onPress={() => history.push('/chat/create')} />
        </View>
        {/* {isFetchingDiscussions ? <ActivityIndicator size='small' style={{ marginTop: 20 }} /> : null} */}
        <FlatList
          data={discussions}
          keyExtractor={(item) => item.chatId.toString()}
          refreshing={isFetchingDiscussions}
          renderItem={({ item }) => (
            <Discussion userId={currentUserId} discussion={item} history={history} openDiscussion={openDiscussion} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 35, fontWeight: 'bold', fontSize: 16 }}>
              Aucune conversations
            </Text>
          }
          onRefresh={fetchDiscussions}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Chat));
