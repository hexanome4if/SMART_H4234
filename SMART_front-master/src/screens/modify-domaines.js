import React, {useState} from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, Card, Appbar, Portal, Dialog, Paragraph, Button, TextInput, Modal, IconButton} from 'react-native-paper';
import { connect } from 'react-redux';
import constants from '../constants';
import actions from '../store/actions';

/* UNUSED COMPONENT (FOR NOW) */

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

function ModifyDomaines(props) {
    const { profile, userToken, getProfile } = props;


    const handleClickOnDelete = (tag) => {
        setCurrentTag(tag);
        showDialog();
    }

    const tagAlreadyExist = (label, type) => {
        console.log("hey")
        if(type == "ability") {
            for(var i = 0 ; i < profile.userAbilityTags.length ; i++) {
                if(profile.userAbilityTags[i].label.toLowerCase() == label.toLowerCase()) {
                    return true;
                }
            }
        } else {
            for(var i = 0 ; i < profile.userInterestTags.length ; i++) {
                if(profile.userInterestTags[i].label.toLowerCase() == label.toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    }
    
    const handleClickAddTag = () => {
        if(currentTag.label.length>0 && !tagAlreadyExist(currentTag.label, currentTag.type)) {
            addTag(currentTag)
        }
    }

    const deleteTag = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        fetch(`${constants.apiUrl}/tag/${currentTag.type}/${currentTag.tagId}`, {
            method: 'DELETE',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify({userId: profile.userId, userName:profile.userName}),
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .catch((err) => {
                console.error(err);
            })
        getProfile();
        hideDialog();
    }

    const addTag = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        fetch(`${constants.apiUrl}/tag/${currentTag.type}/${currentTag.label}`, {
            method: 'PUT',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify({userId: profile.userId, userName:profile.userName}),
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .catch((err) => {
                console.error(err);
            })
        getProfile();
    }

    const [currentTag, setCurrentTag] = useState({tagId:0, label:"", type:""});

    /* Modal */
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    /* Dialog */
    const [visible, setVisible] = useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    return (
        <ScrollView>
            <Appbar>
                <Appbar.BackAction onPress={() => { props.history.goBack() }} />
                <Appbar.Content title={'Modifier vos domaines'} />
            </Appbar>
            <Card style={styles.skills}>
                <Card.Content>
                    <View style={styles.view}>
                        <Card.Title
                            style={{ flex: 1 }}
                            title='Peut renseigner sur' />
                        <IconButton
                            icon="plus-box"
                            color='gray'
                            onPress={() => {setCurrentTag({...currentTag,type:'ability'}); showModal();}}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {profile.userAbilityTags.map((skill, index) => (
                            <TouchableOpacity key={index}>
                                <Chip key={index}
                                    style={{ marginRight: 5, marginBottom: 5 }}
                                    onClose={() => handleClickOnDelete({...skill,type:'ability'})}>
                                    {skill.label}
                                </Chip>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card.Content>
            </Card>
            <Card style={styles.interests}>
                <Card.Content>
                    <View style={styles.view}>
                        <Card.Title
                            style={{ flex: 1 }}
                            title='Est intéressé par ' />
                        <IconButton
                            icon="plus-box"
                            color='gray'
                            onPress={() => { setCurrentTag({ ...currentTag, type: 'interests' }); showModal(); }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {profile.userInterestTags.map((interest, index) => (
                            <TouchableOpacity key={index}>
                                <Chip key={index}
                                    style={{ marginRight: 5, marginBottom: 5 }}
                                    onClose={() => handleClickOnDelete({...interest,type:'interests'})}>
                                    {interest.label}
                                </Chip>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card.Content>
            </Card>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Confirmer</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Voulez-vous vraiment supprimer ce tag : "{currentTag.label}"</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={deleteTag}>Oui, supprimer</Button>
                        <Button onPress={hideDialog}>Annuler</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}>
                    <TextInput
                        style={styles.text_input, { height: 50 }}
                        label='Nouveau tag'
                        value={currentTag.label}
                        onChangeText={(value) => setCurrentTag({...currentTag, label:value})}
                    />
                    <Button onPress={handleClickAddTag} mode='contained'>Ajouter ce tag</Button>
                </Modal>
            </Portal>
        </ScrollView>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyDomaines);

const styles = StyleSheet.create({
    interests: {},
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});
