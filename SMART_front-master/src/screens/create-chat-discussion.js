import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  isCreatingDiscussion: storeState.chat.isCreatingDiscussion,
  availableUsers: storeState.chat.availableUsers,
});

const mapDispatchToProps = (dispatch) => ({
  getAvailableUsers: () => dispatch(actions.chat.getAvailableUsers()),
  createDiscussion: (discussionName, participantsId) =>
    dispatch(actions.chat.createDiscussion(discussionName, participantsId)),
});

const UserEntry = (props) => {
  const { user, addUser, removeUser, isAdded, history } = props;

  return (
    <TouchableOpacity
      onPress={() => history.push('/visit-profile/' + user.userId)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 4 }}>
        <Image
          source={{ uri: user.avatar }}
          style={{ height: 40, width: 40, flexShrink: 0 }}
          resizeMode='cover'
        />
        <Text
          ellipsizeMode='tail'
          numberOfLines={1}
          style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 10, flexShrink: 100 }}
        >
          {user.displayName}
        </Text>
      </View>
      {isAdded ? (
        <Button style={{ flexShrink: 0, flex: 1 }} mode='text' onPress={removeUser}>
          Retirer
        </Button>
      ) : (
        <Button style={{ flexShrink: 0, flex: 1 }} mode='outlined' onPress={addUser}>
          Ajouter
        </Button>
      )}
    </TouchableOpacity>
  );
};

const CreateChatDiscussion = (props) => {
  const { history, isCreatingDiscussion, createDiscussion, getAvailableUsers, availableUsers } = props;
  const users = [
    {
      id: 1,
      displayName: 'Faouz',
    },
    {
      id: 2,
      displayName: 'Zakaria',
    },
    {
      id: 3,
      displayName: 'Fabien',
    },
    {
      id: 4,
      displayName: 'Léa',
    },
    {
      id: 5,
      displayName: 'Zihao',
    },
    {
      id: 6,
      displayName: 'Sana',
    },
  ];

  const [addedUsers, setAddedUsers] = useState([]);
  const [discussionName, setDiscussionName] = useState('');

  useEffect(() => {
    if (!availableUsers) {
      getAvailableUsers();
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.BackAction onPress={() => history.goBack()} />
        <Appbar.Content title={'Créer une discussion'} />
      </Appbar>
      <View style={{ padding: 20, flex: 1 }}>
        <TextInput
          label={'Nom de la discussion'}
          placeholder={'Nom...'}
          value={discussionName}
          onChangeText={(value) => setDiscussionName(value)}
        />
        <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: 'bold' }}>Ajouter des personnes</Text>
        <FlatList
          data={availableUsers}
          renderItem={({ item }) => (
            <UserEntry
              user={item}
              isAdded={addedUsers.includes(item.userId)}
              addUser={() => setAddedUsers([...addedUsers, item.userId])}
              removeUser={() => setAddedUsers(addedUsers.filter((user) => user !== item.userId))}
              history={history}
            />
          )}
          keyExtractor={(item) => item.userId.toString()}
          refreshing={!availableUsers}
          onRefresh={getAvailableUsers}
        />
        <Button
          mode='contained'
          onPress={() => createDiscussion(discussionName, addedUsers)}
          disabled={isCreatingDiscussion}
          loading={isCreatingDiscussion}
        >
          Créer
        </Button>
      </View>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateChatDiscussion));
