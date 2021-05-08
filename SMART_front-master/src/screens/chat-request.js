import React, { useState } from 'react';

import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import actions from '../store/actions';

const mapDispatchToProps = (dispatch) => ({
  createChat: (discussionName, userId) => dispatch(actions.chat.createDiscussion(discussionName, [userId])),
});

const ChatRequest = (props) => {
  const { match, history, createChat } = props;

  const [discussionName, setDiscussionName] = useState('');

  const handlePress = () => {
    history.replace('/visit-profile/' + match.params.userId);
    createChat(discussionName, match.params.userId);
  };

  return (
    <View style={{ flex: 1, padding: 30, marginTop: 40 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Démarez une nouvelle discussion</Text>
      <TextInput
        placeholder='Nom de la discussion...'
        label='Nom de la discussion'
        value={discussionName}
        onChangeText={(value) => setDiscussionName(value)}
      />
      <Button mode='contained' style={{ marginTop: 20 }} onPress={handlePress}>
        Confirmer
      </Button>
    </View>
  );
};

export default connect(null, mapDispatchToProps)(withRouter(ChatRequest));
