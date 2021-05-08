import * as React from 'react';

import { Button, Dialog, List, Paragraph, Portal } from 'react-native-paper';
import { ShadowPropTypesIOS, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { withRouter } from 'react-router-native';
import actions from '../store/actions';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
  logout: (history) => dispatch(actions.auth.logout(history)),
  openChat: (userId) => dispatch(actions.chat.createDiscussion('')),
});

const Ellipsis = (props) => {
  const { userId } = props;
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [visibleModify, setVisibleModify] = React.useState(false);
  const showDialogModify = () => setVisibleModify(true);
  const hideDialogModify = () => setVisibleModify(false);

  const icon_name = props.name;
  const status = props.status;

  const handlePressLogout = () => {
    props.logout(props.history);
  };

  const handlePressModify = () => {
    showDialogModify();
    //props.history.push('/modify-parcours')
  };
  const handlePressModifyProfile = () => {
    props.history.push('/modify-header');
    //props.history.push('/modify-parcours')
  };
  const handlePressModifyInterests = () => {
    //props.history.push('/modify-parcours')
    props.history.push('/modify-domaines');
  };
  const handlePressModifyParcours = () => {
    props.history.push('/modify-parcours');
  };
  const handlePressChatRequest = () => {
    props.history.push('/create-chat-request/' + userId);
    //props.history.push('/modify-parcours')
  };
  const handlePressMeetingRequest = () => {
    props.history.push('/book-meeting/' + userId);
  };
  const handlePressModifyFAQ = () => {
    props.history.push('/modify-faqs');
  }

  return (
    <View style={styles.titleBar}>
      <TouchableOpacity onPress={showDialog}>
        <Ionicons name={icon_name} size={24} color='#1abc9c'></Ionicons>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={styles.ellipsis}>
            <Dialog.Content>
              {status === 'rw' ? (
                <>
                  <TouchableOpacity onPress={handlePressLogout}>
                    <List.Item title='Se déconnecter' left={(props) => <List.Icon {...props} icon='logout' />} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePressModify}>
                    <List.Item title='Modifer le profil' left={(props) => <List.Icon {...props} icon='cog' />} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={handlePressChatRequest}>
                    <List.Item title='Demander un chat' left={(props) => <List.Icon {...props} icon='chat' />} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePressMeetingRequest}>
                    <List.Item title='Demander un RDV' left={(props) => <List.Icon {...props} icon='calendar' />} />
                  </TouchableOpacity>
                </>
              )}
            </Dialog.Content>
          </Dialog>
          <Dialog visible={visibleModify} onDismiss={hideDialogModify} style={styles.ellipsis, {height:250}}>
            <Dialog.Content>
              <TouchableOpacity onPress={handlePressModifyProfile}>
                <List.Item title='Modifier votre en-tête' />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePressModifyInterests}>
                <List.Item title='Modifier vos domaines' />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePressModifyParcours}>
                <List.Item title='Modifier votre parcours' />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePressModifyFAQ}>
                <List.Item title='Modifier votre FAQ' />
              </TouchableOpacity>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
    alignSelf: 'flex-end',
    zIndex: 10,
  },
  ellipsis: {
    position: 'absolute',
    top: 20,
    right: -20,
    width: 300,
    height: 150,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
});

export default connect(null, mapDispatchToProps)(withRouter(Ellipsis));
