import React from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  List,
  Card,
  Text
} from "react-native-paper";

export default function Parcours(props) {

  const {userProfile} = props;
  return (
    <ScrollView>
      <Card style={styles.parcours}>
        <Card.Content>
          <Card.Title title="Expérience profesionnelle" />
          {userProfile.experiences.map((experience) => (
            <List.Item
              key={experience.experienceId}
            title={experience.label}
            description={`${experience.description} • ${experience.yearBegin.slice(0,4)} - ${experience.yearEnd ? experience.yearEnd.slice(0,4) : "présent"}`}
            left={(props) => <List.Icon {...props} icon="briefcase" />}
            />
          ))
          }
        </Card.Content>
        <Card.Content>
          <Card.Title title="Formation" />
          {userProfile.educations.map((forma) => (
            <List.Item
              key={forma.educationId}
            title={forma.label}
            description={`${forma.description} • ${forma.yearBegin.slice(0,4)} - ${forma.yearEnd ? forma.yearEnd.slice(0,4) : "présent"}`}
            left={(props) => <List.Icon {...props} icon="school" />}
            />
          ))
          }
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parcours: {},
});
