import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  List,
  Card,
  Portal,
  Modal,
  TextInput,
  Dialog,
  IconButton,
  Appbar,
  Button,
  Paragraph,
  FAB
} from "react-native-paper";
import { connect } from 'react-redux';
import constants from '../constants';
import actions from '../store/actions';

const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    profile: storeState.profile.profile,
    userToken: storeState.auth.userToken,
    profileState: storeState.profile.profileState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(actions.profile.getProfile()),
  };
};

function ModifyFAQS(props) {

  const handleClick = () => {
    // ADD/MODIFY
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', userToken);
    if(currentQA.qaId !== 0) { //MODIFY
      fetch(`${constants.apiUrl}/faq/answer/${currentQA.qaId}`, {
        method: 'PUT',
        headers: myHeaders,
        cache: 'default',
        body: JSON.stringify({ qaId: currentQA.qaId, question:currentQA.question, answer:currentQA.answer}),
      })
        .then((data) => data.json())
        .then(data => { console.log(data) })
        .catch((err) => {
          console.error(err);
        })
      
    } else { //ADD
      fetch(`${constants.apiUrl}/faq/ask/${profile.userId}`, {
        method: 'PUT',
        headers: myHeaders,
        cache: 'default',
        body: JSON.stringify({ question:currentQA.question, answer:currentQA.answer}),
      })
        .then((data) => data.json())
        .then(data => { console.log(data) })
        .catch((err) => {
          console.error(err);
        })
    }

    getProfile();
    hideModal();
  }

  const handlePressModify = (qa) => {
    console.log(qa)
    setCurrentQA(qa);
    showModal();
  }

  const handlePressDelete = (qa) => {
    setCurrentQA(qa);
    showDialog();
  }

  const deleteQA = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', userToken);
    fetch(`${constants.apiUrl}/faq/${currentQA.qaId}`, {
      method: 'DELETE',
      headers: myHeaders,
      cache: 'default',
      body: JSON.stringify({ userId:profile.userId, userName:profile.userName}),
    })
      .then((data) => data.json())
      .then(data => { console.log(data) })
      .catch((err) => {
        console.error(err);
      })
      getProfile();
    hideDialog();
  }

  const { profile, userToken, profileState, getProfile } = props

  const emptyQA = { question: "", answer: "", qaId: 0 };
  const [currentQA, setCurrentQA] = useState(emptyQA)

  /* Modal */
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  /* Dialog */
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);


  return (
    <View style={{flex:1}}>
      <Appbar>
        <Appbar.BackAction onPress={() => { props.history.goBack() }} />
        <Appbar.Content title={"Modifier votre FAQ"} />
      </Appbar>
      <ScrollView>
        <Card style={styles.faq}>
          <Card.Content>
            {profile.faqs.map((qa) => (
              <View style={styles.view}>
                <List.Item
                  style={{ flex: 1 }}
                  title={qa.question}
                  description={qa.answer}
                  titleNumberOfLines={100000}
                  descriptionNumberOfLines={100000}
                />
                <View>
                  <IconButton
                    icon="pencil"
                    color='gray'
                    onPress={() => handlePressModify(qa)}
                  />
                  <IconButton
                    icon="delete"
                    color='red'
                    onPress={() => handlePressDelete(qa)}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        <Portal>
          <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}>
            <TextInput
              style={styles.text_input}
              label='Question'
              value={currentQA.question}
              onChangeText={(value) => setCurrentQA({ ...currentQA, question: value })}
              multiline={true}
              disabled={currentQA.qaId !== 0}
            />
            <TextInput
              style={styles.text_input, { height: 100 }}
              label='Réponse'
              value={currentQA.answer}
              onChangeText={(value) => setCurrentQA({ ...currentQA, answer: value })}
              multiline={true}
            />
            <Button style={{marginTop:5}} onPress={handleClick} mode='contained'>Ajouter/Modifier cette question</Button>
            <Button style={{marginTop:5}} onPress={hideModal} mode='contained'>Annuler</Button>
          </Modal>
        </Portal>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirmer</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Voulez-vous vraiment supprimer cette question ?"</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={deleteQA}>Oui, supprimer</Button>
              <Button onPress={hideDialog}>Annuler</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => { setCurrentQA(emptyQA); showModal() }}
      />
    </View>
  )
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyFAQS);

const styles = StyleSheet.create({
  faq: {
  },
  text_input: {
    height: 60,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});