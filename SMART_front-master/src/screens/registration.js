import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import {TextInput, Text, Title, TouchableRipple, HelperText, Button, Switch, Checkbox, Menu, Dialog, Portal, Paragraph} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import constants from '../constants';



export default function Registration(props) {  

  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [date, setDate] = useState(new Date());
  const [date_value, setDateValue] = useState("00-00-00");
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState([{ label: 'niveaux', levelId: 55 }]);
  const [level, setLevel] = useState(levels[0]);
  const [tel, setTel] = useState(null);
  const [isConditionSwitchOn, setIsConditionSwitchOn] = useState(false);
  const [showLevelsMenu, setShowLevelsMenu] = useState(false);
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("Pas d'information")

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const onToggleConditionSwitch = () => setIsConditionSwitchOn(!isConditionSwitchOn);
  
  /* GET LEVELS */
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

  const wellCompleted = () => {
    if(
      nickname.length < 1 ||
      username.length <1 ||
      email.length <1 ||
      password.length <1 ||
      passwordConfirmation <1 ||
      date_value == "00-00-00" ||
      level.levelId > 50 ||
      status.length < 1 ||
      mailError() ||
      passwordConfirmationError() ||
      passwordError() ||
      !isConditionSwitchOn
      ) { 
        showDialog();
        return false;
      }
      return true;
  }

  const handleClick = () => {
    if (wellCompleted()) {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const payload = {
        userName: username,
        displayName: nickname,
        mail: email,
        password: password,
        birth: date_value,
        tel: tel,
        counselor: checked,
        verify: true,
        status: status,
        photo: null,
        identityDocument: null,
        levelId: level.levelId,
        avatarId: 1
      }
      fetch(`${constants.apiUrl}/inscription`, {
        method: 'POST',
        headers: myHeaders,
        cache: 'default',
        body: JSON.stringify(payload),
      })
        .catch((err) => {
          console.error(err);
        })
    }
  }

  const convertDate = (inputFormat) => {
    function pad(s) {
      return s < 10 ? '0' + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(),  pad(d.getMonth() + 1), pad(d.getDate()) ].join('-');
  };

  const mailError = () => {
    if (email.length <= 0) {
      return false;
    }
    return !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  };

  const passwordError = () => {
    if (password.length <= 0) {
      return false;
    }
    if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
      return false;
    }
    return true;
  };
  const passwordConfirmationError = () => {
    if (password !== passwordConfirmation && passwordConfirmation.length > 0) {
      return true;
    }
    return false;
  };

  const _renderTouchText = (props) => {
    const { style} = props;
    return (
      <TouchableRipple style={style} onPress={() => setOpen(true)}>
        <Text>{date_value}</Text>
      </TouchableRipple>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Title style={styles.title}>Inscription</Title>
        <TextInput
          style={styles.text_input}
          label='Pseudonyme'
          value={nickname}
          onChangeText={(nickname) => setNickname(nickname)}
          mode='outlined'
        />
        <TextInput
          style={styles.text_input}
          label='Username'
          value={username}
          onChangeText={(username) => setUsername(username)}
          mode='outlined'
        />
        <Text style={(styles.text, { padding: 5, marginLeft:20, marginRight:20 })}>
          Votre username est unique. Il servira à vous identifier auprès des autres utilisateurs.
        </Text>
        <View>
          <TextInput
            style={styles.text_input}
            label='Adresse mail'
            value={email}
            onChangeText={(email) => setEmail(email)}
            mode='outlined'
          />
          {mailError() ?
           <HelperText type='error'>
               Addresse mail invalide !
            </HelperText> : null}
          
        </View>
        <TextInput
          style={styles.text_input}
          label='Numéro de téléphone (facultatif)'
          value={tel}
          onChangeText={(tel) => setTel(tel)}
          mode='outlined'
        />
        <View>
          <TextInput
            style={styles.text_input}
            label='Mot de passe'
            value={password}
            onChangeText={(password) => setPassword(password)}
            mode='outlined'
            secureTextEntry={true}
          />
          {passwordError() ?
           <HelperText type='error'>
               Le mot de passe doit contenir entre 6 et 20 caractères avec au moins un chiffre, une majuscule et une minuscule.Le mot de passe et sa confirmation ne sont pas identiques.
            </HelperText> : null}
        </View>
        <View>
          <TextInput
            style={styles.text_input}
            label='Confirmation du mot de passe'
            value={passwordConfirmation}
            onChangeText={(passwordConfirmation) => setPasswordConfirmation(passwordConfirmation)}
            mode='outlined'
            secureTextEntry={true}
          />
          {passwordConfirmationError() ?
           <HelperText type='error'>
               Le mot de passe et sa confirmation ne sont pas identiques.
            </HelperText> : null}
        </View>
        <TextInput
          style={styles.text_input}
          label='Date de naissance'
          value={date_value}
          render={_renderTouchText}
          mode='outlined'
        />
        <DateTimePicker
          date={date}
          isVisible={open}
          onConfirm={(date) => {setOpen(false); setDate(date); setDateValue(convertDate(date)); }}
          onCancel={(date) => setOpen(false)}
        />
        <View style={styles.view}>
          <Text style={styles.text, {flex:1}}>
            Plus haut niveau d'études :
          </Text>
          <Menu
              visible={showLevelsMenu}
              anchor={
                <Button compact onPress={() => setShowLevelsMenu(true)} mode='outlined'>
                  {level.label}
                </Button>
              }
              onDismiss={() => setShowLevelsMenu(false)}
          >
              {levels.map((lvl) => (
                <Menu.Item
                  title={lvl.label}
                  key={lvl.levelId}
                  onPress={() => {setLevel(lvl); setShowLevelsMenu(false)}}
                  titleStyle={{ color: lvl.value === level.value ? 'green' : '#000' }}
                />
              ))}
          </Menu>
        </View>
        <TextInput
          style={styles.text_input}
          label='Statut'
          value={status}
          onChangeText={(status) => setStatus(status)}
          mode='outlined'
          multiline={true}
        />
        <Text style={(styles.text, { padding: 5, marginLeft:20, marginRight:20 })}>
          Résumez en quelques mots ce vous faites actuellement.
        </Text>
        <View style={styles.view}>
          <View style={styles.switch}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          
          <Text style={styles.text, {flex:1}} >J'accepter d'aider des utilisateurs à s'orienter</Text>
        </View>
        <View style={styles.view}>
          <Switch style={styles.switch} value={isConditionSwitchOn} onValueChange={onToggleConditionSwitch} />
          <Text style={styles.text, {flex:1}}>J'ai lu et j'accepte les conditions générales d'utilisations</Text>
        </View>
        <Button mode='contained' onPress={handleClick} >Valider et s'inscrire</Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Informations invalides</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Impossible de valider. Certaines informations sont invalides ou manquantes. Assurez vous de bien avoir compléter les champs.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7ecee',
    padding: 10,
  },
  text_input: {
    backgroundColor: '#e4ffff',
    height: 50,
    flex: 1,
    padding: 2,
    marginLeft:20,
    marginRight:20
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
    marginLeft:20,
    marginRight:20
  },
  icon: {
    padding: 5,
  },
  switch: {
    marginRight:5
  }
});
