import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import {
    List,
    Card,
    IconButton,
    Portal,
    Dialog,
    Paragraph,
    Button,
    Modal,
    Appbar
} from "react-native-paper";
import ModifyFormation from '../components/modify-formation'
import ModifyExperience from '../components/modify-experience'
import constants from '../constants';
import actions from '../store/actions';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (storeState, ownProps) => {
    return {
        ...ownProps,
        profile: storeState.profile.profile,
        userToken: storeState.auth.userToken,
        profileHeader: storeState.auth.currentUser,
        profileState: storeState.profile.profileState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: () => dispatch(actions.profile.getProfile()),
    };
};

function ModifyParcours(props) {

    const { profile, userToken, getProfile, profileHeader, profileState } = props;
    const experiences = profile.experiences;
    const formations = profile.educations;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentExp, setCurrentExp] = useState([]);
    const [currentForm, setCurrentForm] = useState([])
    const [visible, setVisible] = useState(false);
    const [isCurrentFormation, setIsCurrentFormation] = useState(false);
    const [visibleExp, setVisibleExp] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    const showDialogExp = () => setVisibleExp(true);
    const hideDialogExp = () => setVisibleExp(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    const handlePressModifyFormation = (formation) => {
        setIsCurrentFormation(true);
        setCurrentForm(formation);
        showModal();
    }

    const handleClickAddFormation = () => {
        setIsCurrentFormation(true);
        setCurrentForm(null);
        showModal();
    }

    const handlePressDeleteFormation = (formation) => {
        setCurrentForm(formation);
        showDialog();
    }

    const handleDeleteForm = () => {
        deleteFormation();
        hideDialog();
    }

    const handlePressModifyExperience = (experience) => {
        setIsCurrentFormation(false);
        setCurrentExp(experience);
        showModal();
    }

    const handleClickAddExperience = () => {
        setIsCurrentFormation(false);
        setCurrentExp(null);
        showModal();
    }

    const handlePressDeleteExperience = (experience) => {
        setCurrentExp(experience);
        showDialogExp();
    }

    const handleDeleteExp = () => {
        deleteExperience();
        hideDialogExp();
    }



    const handleDismiss = () => {
        hideModal();
    }

    const deleteFormation = () => {
        console.log("DELETE")
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        fetch(`${constants.apiUrl}/education/${currentForm.educationId}`, {
            method: 'DELETE',
            headers: myHeaders,
            cache: 'default',
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .catch((err) => {
                console.error(err);
            })
        getProfile();
    }

    const deleteExperience = () => {
        console.log("DELETE")
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        fetch(`${constants.apiUrl}/experience/${currentExp.experienceId}`, {
            method: 'DELETE',
            headers: myHeaders,
            cache: 'default',
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .catch((err) => {
                console.error(err);
            })
        getProfile();
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar>
                <Appbar.BackAction onPress={() => { props.history.goBack() }} />
                <Appbar.Content title={"Modifier votre parcours"} />
            </Appbar>
            <ScrollView>
                <Card style={styles.parcours}>
                    <Card.Content>
                        <View style={styles.view}>
                            <Card.Title title="Expérience profesionnelle" style={{ flex: 1 }} />
                            <IconButton
                                icon="plus-box"
                                color='gray'
                                onPress={() => handleClickAddExperience()}
                            />
                        </View>
                        {profileState === 'fetching' ?
                            <ActivityIndicator size="large" color="#1abc9c" /> :
                            experiences.map((experience) => (
                                <View style={styles.view}>
                                    <List.Item
                                        style={{ flex: 1 }}
                                        title={experience.label}
                                        description={`${experience.description} • ${experience.yearBegin.slice(0, 4)} - ${experience.yearEnd ? experience.yearEnd.slice(0, 4) : "présent"}`}
                                        left={(props) => <List.Icon {...props} icon="briefcase" />}
                                    />
                                    <View>
                                        <IconButton
                                            icon="pencil"
                                            color='gray'
                                            onPress={() => handlePressModifyExperience(experience)}
                                        />
                                        <IconButton
                                            icon="delete"
                                            color='red'
                                            onPress={() => handlePressDeleteExperience(experience)}
                                        />
                                    </View>
                                </View>
                            ))
                        }
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.view}>
                            <Card.Title title="Formation" style={{ flex: 1 }} />
                            <IconButton
                                icon="plus-box"
                                color='gray'
                                onPress={() => handleClickAddFormation()}
                            />
                        </View>
                        {profileState === 'fetching' ?
                            <ActivityIndicator size="large" color="#1abc9c" /> :
                            formations.map((forma) => (
                                <View style={styles.view}>
                                    <List.Item
                                        style={{ flex: 1 }}
                                        title={forma.label}
                                        description={`${forma.description} • ${forma.yearBegin.slice(0, 4)} - ${forma.yearEnd ? forma.yearEnd.slice(0, 4) : "présent"}`}
                                        left={(props) => <List.Icon {...props} icon="school" />}
                                    />
                                    <View>
                                        <IconButton
                                            icon="pencil"
                                            color='gray'
                                            onPress={() => handlePressModifyFormation(forma)}
                                        />
                                        <IconButton
                                            icon="delete"
                                            color='red'
                                            onPress={() => handlePressDeleteFormation(forma)}
                                        />
                                    </View>
                                </View>

                            ))
                        }
                    </Card.Content>
                </Card>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Voulez-vous vraiment supprimer cette formation ?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDeleteForm}>Supprimer</Button>
                            <Button onPress={hideDialog}>Annuler</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={visibleExp} onDismiss={hideDialogExp}>
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Voulez-vous vraiment supprimer cette expérience?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDeleteExp}>Supprimer</Button>
                            <Button onPress={hideDialogExp}>Annuler</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Modal visible={modalVisible} onDismiss={handleDismiss} contentContainerStyle={{ backgroundColor: 'white', height: 400, justifyContent: 'center' }}>
                        {isCurrentFormation ? <ModifyFormation formation={currentForm} /> : <ModifyExperience experience={currentExp} />}
                    </Modal>
                </Portal>

            </ScrollView>
        </View>

    )
}
export default connect(mapStateToProps, mapDispatchToProps)(ModifyParcours);

const styles = StyleSheet.create({
    text_input: {
        height: 50,
        flex: 1,
        padding: 2,
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});