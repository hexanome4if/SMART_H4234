import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, Card } from 'react-native-paper';

export default function Interests(props) {
  const {userProfile} = props;
  return (
    <Card style={styles.interests}>
      <Card.Content>
        <Card.Title title='Est intéressé par' />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {userProfile.userInterestTags.map((interest, index) => (
            <TouchableOpacity key={index}>
              <Chip key={index} style={{ marginRight: 5, marginBottom: 5 }}>
                {interest.label}
              </Chip>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  interests: {},
});
