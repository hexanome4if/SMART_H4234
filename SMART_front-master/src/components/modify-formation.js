import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import {
    TextInput,
    Title,
    Button,
    HelperText,
    Snackbar,
    Card,
    Chip,
    IconButton,
    Modal,
    Portal
} from "react-native-paper";
import { connect } from 'react-redux';
import constants from '../constants';
import actions from '../store/actions';


const mapStateToProps = (storeState, ownProps) => {
    return {
        ...ownProps,
        userToken: storeState.auth.userToken,
        profile: storeState.profile.profile
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: () => dispatch(actions.profile.getProfile()),
    };
};


function ModifyFormation(props) {


    function isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
            !isNaN(parseInt(str))
    }

    const addFormation = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        const payload = {
            description: description,
            instituteId: null,
            yearBegin: yearBegin + '-01-01',
            yearEnd: yearEnd.length < 1 ? null : (yearEnd + '-01-01'),
            userId: profile.userId,
            label: label
        }
        console.log(payload)
        fetch(`${constants.apiUrl}/education`, {
            method: 'POST',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify(payload),
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .then(() => getProfile())
            .catch((err) => {
                console.error(err);
            })
        onToggleSnackBar();
    }

    const modifyFormation = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        const payload = {
            description: description,
            instituteId: null,
            yearBegin: yearBegin + '-01-01',
            yearEnd: yearEnd.length < 1 ? null : (yearEnd + '-01-01'),
            userId: profile.userId,
            label: label,
            educationTags: educationTags
        }
        console.log(payload)
        fetch(`${constants.apiUrl}/education/${formation.educationId}`, {
            method: 'PUT',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify(payload),
        })
            .then((data) => data.json())
            .then(data => { console.log(data) })
            .then(() => getProfile())
            .catch((err) => {
                console.error(err);
            })
        getProfile();
        onToggleSnackBar();
    }

    const handleClick = () => {
        if (formation) {
            modifyFormation();
        } else {
            addFormation();
        }
    }

    const matchYear = (year) => {
        if (isNumeric(year)) {
            if (year.length == 4) {
                return false
            }
        }
        return true;
    }

    const deleteEducationTag = (label) => {
        var arr = [...educationTags]
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].label == label) {
                arr.splice(i, 1);
                i--;
            }
        }
        setEducationTags(arr);
    }

    const addEducationTag = (label) => {
        var arr = [...educationTags];
        arr.push({ label: label });
        setEducationTags(arr);
    }

    const tagAlreadyExist = (label) => {
        for (var i = 0; i < educationTags.length; i++) {
            if (educationTags[i].label.toLowerCase() == label.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    const handleClickAddTag = () => {
        if (newTag.length > 0 && !tagAlreadyExist(newTag)) {
            addEducationTag(newTag)
        }
    }

    const { formation, userToken, getProfile, profile } = props;
    const emptyForm = {
        description: 'Description',
        insituteId: 1234,
        label: 'Ecole',
        userId: profile.userId,
        yearBegin: '2021-01-01',
        yearEnd: null,
        educationTags: []
    }

    const initForm = formation ? formation : emptyForm;
    const [description, setDescription] = useState(initForm.description);
    const [label, setLabel] = useState(initForm.label);
    const [yearBegin, setYearBegin] = useState(initForm.yearBegin.slice(0, 4));
    const [yearEnd, setYearEnd] = useState(initForm.yearEnd ? initForm.yearEnd.slice(0, 4) : '');
    const [educationTags, setEducationTags] = useState(initForm.educationTags.map((tag) => { return { label: tag.label } }));
    const [newTag, setNewTag] = useState("");

    /* Snackbar */
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    /* Modal */
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>{formation ? 'Modifier la' : 'Ajouter une'} formation</Title>
            <TextInput
                style={styles.text_input}
                label='Ecole/Lycée/Etablissement'
                value={label}
                onChangeText={(label) => setLabel(label)}
            />
            <TextInput
                style={styles.text_input, { height: 100 }}
                label='Description de la formation'
                value={description}
                onChangeText={(description) => setDescription(description)}
                multiline={true}
            />
            <TextInput
                style={styles.text_input}
                label='Année de début'
                value={yearBegin}
                onChangeText={(begin) => setYearBegin(begin)}
            />
            {matchYear(yearBegin) ?
                <HelperText type='error'>
                    L'année est incorrect
            </HelperText> : null}
            <TextInput
                style={styles.text_input}
                label='Année de fin'
                value={yearEnd}
                onChangeText={(end) => setYearEnd(end)}
            />
            {matchYear(yearEnd) && yearEnd.length > 0 ?
                <HelperText type='error'>
                    L'année est incorrect
            </HelperText> : null}
            <HelperText type='info'>
                (Laisser le champs vide si la formation est en cours)
            </HelperText>
            {   formation ?
                <Card style={styles.skills}>
                    <Card.Content>
                        <View style={styles.view}>
                            <Card.Title
                                style={{ flex: 1 }}
                                title='Tags associés :' />
                            <IconButton
                                icon="plus-box"
                                color='gray'
                                onPress={() => showModal()}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {educationTags.map((tag) => (
                                <TouchableOpacity>
                                    <Chip
                                        style={{ marginRight: 5, marginBottom: 5 }}
                                        onClose={() => deleteEducationTag(tag.label)}>
                                        {tag.label}
                                    </Chip>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Portal>
                            <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}>
                                <TextInput
                                    style={styles.text_input, { height: 50 }}
                                    label='Nouveau tag'
                                    value={newTag}
                                    onChangeText={(newTag) => setNewTag(newTag)}
                                />
                                <Button onPress={handleClickAddTag} mode='contained'>Ajouter ce tag</Button>
                            </Modal>
                        </Portal>
                    </Card.Content>
                </Card> : null
            }
            <Button onPress={handleClick} mode='contained'>Valider</Button>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Ok',
                    onPress: () => {
                    },
                }}>
                Modification réalisée
            </Snackbar>
        </ScrollView>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyFormation);


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    text_input: {
        height: 50,
        flex: 1,
        padding: 2,
    },
    title: {
        alignSelf: 'center',
        marginTop: 10,
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});