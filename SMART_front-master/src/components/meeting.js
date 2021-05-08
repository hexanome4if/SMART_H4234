import moment from 'moment';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { List, Card } from 'react-native-paper';

export default function Meeting(props) {
  const { meetings } = props;

  const renderMeetings = [];
  if (meetings && meetings.length) {
    for (let i = 0; i < 3 && i < meetings.length; ++i) {
      renderMeetings.push(
        <List.Item
          key={meetings[i].meetingId}
          title={meetings[i].label}
          description={moment(meetings[i].date).format('DD/MM/YYYY HH:mm')}
          left={(props) => <List.Icon {...props} icon='calendar' />}
        />,
      );
    }
  }

  return (
    <Card style={styles.meetings}>
      <Card.Content>
        {meetings && meetings.length ? (
          renderMeetings
        ) : (
          <Text style={{ textAlign: 'center' }}>Aucun rendez vous prévu</Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  meetings: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
});
