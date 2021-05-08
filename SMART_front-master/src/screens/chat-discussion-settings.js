import React from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Modal, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownprops) => ({
  ...ownprops,
  currentDiscussion: storeState.chat.currentDiscussion,
});

const mapDispatchToProps = (dispatch) => ({
  leaveDiscussion: (chatId, history) => dispatch(actions.chat.leaveDiscussion(chatId, history)),
});

const UserEntry = (props) => {
  const { user, participants, history } = props;

  return (
    <TouchableOpacity
      onPress={() => history.push(`/visit-profile/${user.userId}`)}
      style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, flex: 1 }}
    >
      <Image source={{ uri: user.avatar }} style={{ height: 40, width: 40 }} resizeMode='cover' />
      <Text style={{ flexGrow: 1, fontSize: 18, fontWeight: 'bold', marginHorizontal: 10 }}>{user.displayName}</Text>
    </TouchableOpacity>
  );
};

const ChatDiscussionSettings = (props) => {
  const { history, currentDiscussion, leaveDiscussion } = props;

  return (
      <View style={{ flex: 1 }}>
        <Appbar>
          <Appbar.BackAction onPress={() => history.goBack()} />
          <Appbar.Content title={'Détails'} />
        </Appbar>
        <View style={{ padding: 20, flex: 1 }}>
          <Text style={{ fontSize: 18 }}>Discussion</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{currentDiscussion.label}</Text>
          <Text style={{ fontSize: 18 }}>Participants</Text>
          <FlatList
            data={currentDiscussion.users}
            renderItem={({ item }) => (
              <UserEntry user={item} participants={currentDiscussion.participants} history={history} />
            )}
            keyExtractor={(item) => item.userId.toString()}
            refreshing={!currentDiscussion.users}
            onRefresh={() => null}
          />
          <Button mode='contained' onPress={() => history.push('/book-meeting-current-discussion')} style={{ marginBottom: 20 }}>
            Planifier un rendez-vous
          </Button>
          <Button mode='contained' onPress={() => leaveDiscussion(currentDiscussion.chatId, history)}>
            Quitter la discussion
          </Button>
        </View>
      </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatDiscussionSettings));
