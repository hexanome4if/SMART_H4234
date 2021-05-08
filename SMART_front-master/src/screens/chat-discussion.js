import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  TextInput as NativeTextInput,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { Appbar, IconButton, TextInput, withTheme, ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import springWsProvider from '../components/spring-ws-provider';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  currentDiscussion: storeState.chat.currentDiscussion,
  currentUser: storeState.auth.currentUser,
  discussions: storeState.chat.discussions,
});

const mapDispatchToProps = (dispatch) => ({
  openDiscussion: (discussionId) => dispatch(actions.chat.openDiscussion(discussionId)),
  closeDiscussion: () => dispatch(actions.chat.closeDiscussion()),
  sendMessage: (content) => dispatch(actions.chat.sendMessage(content)),
  getDiscussions: () => dispatch(actions.chat.getDiscussions()),
});

const MessageEntry = (props) => {
  const { message, theme, currentUser, users } = props;
  const isCurrentUser = message.userId == currentUser.userId;

  const user = users.find((u) => u.userId == message.userId);

  return (
    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'flex-end', flex: 1 }}>
      {isCurrentUser ? null : (
        <Image source={{ uri: user.avatar }} style={{ height: 40, width: 40 }} resizeMode='cover' />
      )}
      <View style={{ marginLeft: 10, flex: 10, flexGrow: 1 }}>
        {isCurrentUser ? null : <Text style={{ color: '#555', marginLeft: 10 }}>{user?.displayName}</Text>}
        <View
          style={{
            padding: 10,
            backgroundColor: isCurrentUser ? theme.colors.primary : '#eee',
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: isCurrentUser ? 'white' : theme.colors.text,
              textAlign: isCurrentUser ? 'right' : 'left',
            }}
          >
            {message.content}
          </Text>
        </View>
        <Text
          style={{
            textAlign: isCurrentUser ? 'right' : 'left',
            marginHorizontal: 10,
            fontSize: 12,
            color: '#555',
          }}
        >
          {moment(new Date(message.msgDate)).format('DD MMM YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );
};

const ChatDiscussion = (props) => {
  const { history, match, theme, openDiscussion, currentDiscussion, currentUser, sendMessage, discussions, getDiscussions, closeDiscussion } = props;
  const { params } = match;
  const discussionId = params.discussion;

  const [message, setMessage] = useState('');

  const discussion = discussions?.find(d => d.chatId == discussionId);
  useEffect(() => {
    if (!discussion) {
      getDiscussions();
    }
  }, []);

  useEffect(() => {
    if (discussion) {
      openDiscussion(discussionId);
    }
  }, [discussions]);

  useEffect(() => {
    return () => {
      // closeDiscussion();
    }
  }, []);

  const displayCurrentDiscussion = () => (
    <>
      <FlatList
        data={currentDiscussion.messages}
        contentContainerStyle={{
          paddingHorizontal: 10,
          flexDirection: 'column-reverse',
        }}
        keyExtractor={(item) => item.messageId.toString()}
        renderItem={({ item }) => (
          <MessageEntry message={item} theme={theme} users={currentDiscussion.users} currentUser={currentUser} />
        )}
        inverted
      />

      <View style={{ height: 70, padding: 10 }}>
        <View style={{ flexDirection: 'row', height: 50, borderRadius: 50, borderWidth: 0.5, borderColor: 'black' }}>
          <TextInput
            underlineColor='transparent'
            style={{
              borderColor: undefined,
              color: 'black',
              backgroundColor: 'transparent',
              height: 50,
              width: Dimensions.get('window').width - 70
            }}
            theme={{ colors: { primary: 'transparent' } }}
            placeholder={'Votre message...'}
            value={message}
            onChangeText={(value) => setMessage(value)}
          />
          <IconButton style={{ flexShrink: 0 }} icon='send' onPress={() => sendMessage(message)} />
        </View>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Appbar>
          <Appbar.BackAction onPress={() => history.goBack()} />
          {/* <Image source={require('../../assets/paul.png')} style={{ height: 40, width: 40 }} resizeMode='center' /> */}
          {currentDiscussion ? (
            <>
              <Appbar.Content title={currentDiscussion.label} />
              <Appbar.Action
                icon='cog'
                onPress={() => history.push(`/chat/discussion/${currentDiscussion.chatId}/settings`)}
              />
            </>
          ) : null}
        </Appbar>
        {currentDiscussion && currentDiscussion.messages && currentDiscussion.users ? (
          displayCurrentDiscussion()
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withTheme(ChatDiscussion)));
