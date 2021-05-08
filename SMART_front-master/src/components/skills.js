import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, Card } from 'react-native-paper';

export default function Skills(props) {
  const {userProfile} = props;
  return (
    <Card style={styles.skills}>
      <Card.Content>
        <Card.Title title='Peut renseigner sur' />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {userProfile.userAbilityTags.map((skill, index) => (
            <TouchableOpacity key={index}>
              <Chip key={index} style={{ marginRight: 5, marginBottom: 5 }}>
                {skill.label}
              </Chip>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  skills: {},
});
