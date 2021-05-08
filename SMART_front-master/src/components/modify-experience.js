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
        profileHeader: storeState.auth.currentUser
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: () => dispatch(actions.profile.getProfile()),
    };
};


function ModifyExperience(props) {


    function isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
               !isNaN(parseInt(str))
    }

    const addExperience = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        const payload = {
            description: description,
            siret: null,
            yearBegin: yearBegin+'-01-01',
            yearEnd: yearEnd.length < 1 ? null : (yearEnd+'-01-01'),
            userId: profileHeader.userId,
            label:label
        }
        fetch(`${constants.apiUrl}/experience`, {
            method: 'POST',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify(payload),
          })
          .then((data) => data.json())
            .catch((err) => {
              console.error(err);
            })
        getProfile();
        onToggleSnackBar();
    }

    const modifyExperience = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        const payload = {
            description: description,
            siret: null,
            yearBegin: yearBegin+'-01-01',
            yearEnd: yearEnd.length < 1 ? null : (yearEnd+'-01-01'),
            userId: profileHeader.userId,
            label:label,
            experienceTags:experienceTags
        }
        fetch(`${constants.apiUrl}/experience/${experience.experienceId}`, {
            method: 'PUT',
            headers: myHeaders,
            cache: 'default',
            body: JSON.stringify(payload),
          })
          .then((data) => data.json())
          .then(data => { console.log(data) })
            .catch((err) => {
              console.error(err);
            })
        getProfile();
        onToggleSnackBar();
    }

    const handleClick = () => {
        if(experience) {
            modifyExperience();
        } else {
            addExperience();
        }
    }

    const matchYear = (year) => {
        if(isNumeric(year)) {
            if(year.length==4) {
                return false
            }
        }
        return true;
    }

    const deleteExperienceTag = (label) => {
        var arr = [...experienceTags]
        for(var i = 0 ; i < arr.length ; i++) {
            if(arr[i].label == label) {
                arr.splice(i, 1); 
                i--; 
            }
        }
        setExperienceTags(arr);
    }

    const addExperienceTag = (label) => {
        var arr = [...experienceTags];
        arr.push({label:label});
        setExperienceTags(arr);
    }

    const tagAlreadyExist = (label) => {
        for(var i = 0 ; i < experienceTags.length ; i++) {
            if(experienceTags[i].label.toLowerCase() == label.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    const handleClickAddTag = () => {
        if(newTag.length>0 && !tagAlreadyExist(newTag)) {
            addExperienceTag(newTag)
        }
    }


    const {experience, userToken, getProfile, profileHeader} = props;
    const emptyExp = {
        description: 'Description',
        siret: null,
        label: 'Titre',
        userId: profileHeader.userId,
        yearBegin: '2021-01-01',
        yearEnd: null,
        experienceTags:[]
    }
    console.log(experience)
    const initExp = experience ? experience : emptyExp;
    const [description, setDescription] = useState(initExp.description);
    const [label, setLabel] = useState(initExp.label);
    const [yearBegin, setYearBegin] = useState(initExp.yearBegin.slice(0,4));
    const [yearEnd, setYearEnd] = useState(initExp.yearEnd ? initExp.yearEnd.slice(0,4) : '');
    const [experienceTags, setExperienceTags] = useState(initExp.experienceTags.map((tag) => {return {label:tag.label}}))
    const [newTag, setNewTag] = useState("");


    /* Snackbar */
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    /* Modal */
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return(
        <ScrollView style={styles.container}>
            <Title style={styles.title}>{experience ? "Modifier l'" : "Ajouter une "}expérience</Title>
            <TextInput
                style={styles.text_input}
                label='Titre'
                value={label}
                onChangeText={(label) => setLabel(label)}
            />
            <TextInput
                style={styles.text_input}
                label="Description de l'expérience"
                value={description}
                onChangeText={(description) => setDescription(description)}
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
            {matchYear(yearEnd) && yearEnd.length> 0?
                <HelperText type='error'>
                    L'année est incorrect
            </HelperText> : null}
            <HelperText type='info'>
               (Laisser le champs vide si l"expérience est d'actualité)
            </HelperText>
            {   experience ?
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
                            {experienceTags.map((tag) => (
                                <TouchableOpacity>
                                    <Chip
                                        style={{ marginRight: 5, marginBottom: 5 }}
                                        onClose={() => deleteExperienceTag(tag.label)}>
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

  export default connect(mapStateToProps,mapDispatchToProps)(ModifyExperience);


  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom:20,
        marginTop:20,
        marginLeft:20,
        marginRight:20
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
