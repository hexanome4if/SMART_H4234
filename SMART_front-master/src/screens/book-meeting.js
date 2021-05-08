import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,

} from "react-native";
import {
    Text,
    TextInput,
    Button,
    Menu,
    Title,
    TouchableRipple
} from "react-native-paper";
import DateTimePicker from 'react-native-modal-datetime-picker';
import constants from '../constants';
import actions from '../store/actions';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (storeState, ownProps) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createMeeting: (meetingLabel, date, otherUserId) =>
            dispatch(actions.meeting.createMeeting(meetingLabel, date, otherUserId)),
    };
};

function BookMeeting(props) {

    const [meetingTitle, setMeetingTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [date_value, setDateValue] = useState("00-00-00");
    const convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? '0' + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    };
    const _renderTouchText = (props) => {
        const { style } = props;
        return (
            <TouchableRipple style={style} onPress={() => setOpen(true)}>
                <Text>{date_value}</Text>
            </TouchableRipple>
        );
    };

    return (
        <ScrollView >
            <Title style={styles.title}>Demande de rendez-vous</Title>
            <View style={styles.container}>
                <TextInput
                    style={styles.text_input}
                    label='Objectif'
                    value={meetingTitle}
                    onChangeText={(meetingTitle) => setMeetingTitle(meetingTitle)}
                />
                {
                    <TextInput
                        style={styles.text_input}
                        label='Date du rendez-vous'
                        value={date_value}
                        render={_renderTouchText}
                        mode='outlined'
                    />}
                <DateTimePicker
                    date={date}
                    isVisible={open}
                    onConfirm={(date) => { setOpen(false); setDate(date); setDateValue(convertDate(date)); }}
                    onCancel={(date) => setOpen(false)}
                />
                <Button style={styles.button} mode='contained' onPress={() => props.createMeeting(meetingTitle, new Date(date), props.match.params.userId)}>Confirmer</Button>
            </View>
        </ScrollView>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BookMeeting);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '40%',
    },
    text_input: {
        height: 50,
        flex: 1,
        padding: 2,
        width: "80%",
        marginLeft: '10%',
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        alignSelf: 'center',
        marginTop: 50,
    },
    text: {
        textAlign: 'justify',
    },
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    button: {
        marginTop: 20,
        width: "50%",
        marginLeft: '25%',
        
    }
});