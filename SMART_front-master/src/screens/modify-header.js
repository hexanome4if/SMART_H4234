import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator
} from "react-native";
import {
    Text,
    TextInput,
    Button,
    Menu,
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

function ModifyHeader(props) {

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        fetch(`${constants.apiUrl}/levels`, {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => setLevels(data))
            .catch((err) => {
                console.error(err);
            })
    }, []);


    const { profile, userToken, getProfile, profileHeader, profileState } = props;
    const username = profile.userName;
    const [displayName, setDisplayName] = useState(profile.displayName);
    const [tel, setTel] = useState(profile.tel);
    const [counselor, setCounselor] = useState(profile.counselor);
    const [status, setStatus] = useState(profile.status);
    const [levelId, setLevelId] = useState(profile.levelId);
    const [showLevelsMenu, setShowLevelsMenu] = useState(false);
    const [levels, setLevels] = useState([{ label: 'niveaux', levelId: 55 }]);
    const [levelLabel, setLevelLabel] = useState(profile.level.label);

    const handleClick = () => {
        sendModifications();
        props.history.goBack();
    }

    const sendModifications = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', userToken);
        const payload = {
            userName: username,
            displayName: displayName,
            mail: profile.mail,
            birth: profile.birth,
            verify: profile.verify,
            status: status,
            photo: null,
            identityDocument: null,
            levelId: levelId,
            avatarId: profile.avatarId,
            tel: tel ? tel : null
        }
        console.log(payload)
        fetch(`${constants.apiUrl}/profile/${profile.userId}`, {
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

    }

    return (
        <View style = {{flex:1}}>
            <Appbar>
                <Appbar.BackAction onPress={() => { props.history.goBack() }} />
                <Appbar.Content title={"Modifier l'en-tête"} />
            </Appbar>
            <ScrollView style={styles.container}>

                <TextInput
                    style={styles.text_input}
                    label='Pseudonyme'
                    value={displayName}
                    onChangeText={(displayName) => setDisplayName(displayName)}
                />
                <TextInput
                    style={styles.text_input}
                    label='Username'
                    value={username}
                    onChangeText={() => { }}
                    disabled={true}
                />
                <View style={styles.view}>
                    <Text style={styles.text, { flex: 1 }}>
                        Plus haut niveau d'études :
                </Text>
                    <Menu
                        visible={showLevelsMenu}
                        anchor={
                            <Button compact onPress={() => setShowLevelsMenu(true)} mode='outlined'>
                                {levelLabel}
                            </Button>
                        }
                        onDismiss={() => setShowLevelsMenu(false)}
                    >
                        {levels.map((lvl) => (
                            <Menu.Item
                                title={lvl.label}
                                key={lvl.levelId}
                                onPress={() => { setLevelId(lvl.levelId); setLevelLabel(lvl.label); setShowLevelsMenu(false) }}
                                titleStyle={{ color: 'green' }}
                            />
                        ))}
                    </Menu>
                </View>
                <TextInput
                    style={styles.text_input, { height: 100 }}
                    label='Statut'
                    value={status}
                    onChangeText={(status) => setStatus(status)}
                    multiline={true}
                />
                <TextInput
                    style={styles.text_input}
                    label='Numéro de téléphone'
                    value={tel ? tel : ''}
                    onChangeText={(tel) => setTel(tel)}
                />
                <Button style={{ marginTop: 20 }} onPress={handleClick} mode='contained'>Valider les modifications</Button>
            </ScrollView>
        </View>

    )
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyHeader);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
    text: {
        textAlign: 'justify',
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});