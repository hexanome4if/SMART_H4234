import React from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  List,
  Card,
} from "react-native-paper";

export default function FAQ(props) {
  const {faqs} = props

  return (
    <ScrollView>
      <Card style={styles.faq}>
        <Card.Content>
          {faqs.map((qa) => (
            <List.Item
            title= {qa.question}
            description={qa.answer}
            titleNumberOfLines={100000}
            descriptionNumberOfLines={100000}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  faq: {
  },
});