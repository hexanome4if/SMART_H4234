import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View,  RefreshControl } from 'react-native';
import { Menu, Searchbar, Button, withTheme, Card, Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import VisitProfile from '../screens/visit-profile';
import actions from '../store/actions';
import { withRouter } from 'react-router';
import ProfilePhoto from './profile_photo';

const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    suggestions: storeState.suggestions.suggestions,
    suggestionsState: storeState.suggestions.suggestionsState,
    recProfiles: storeState.recProfiles.recProfiles,
    recProfilesState: storeState.recProfiles.recProfilesState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSuggestions: () => dispatch(actions.suggestions.getSuggestions()),
    getRecProfiles: () => dispatch(actions.recProfiles.getRecProfiles()),
  };
};

const UserCard = (props) => {
  const { recProfile, suggestion, history } = props;
  let key = 0;
  if (!suggestion) return null;
  return (
    <Card style={styles.userCard}>
      <Card.Content>
        <TouchableOpacity onPress={() => history.push(`/visit-profile/${suggestion.userId}`)} >
          {/* Indice de recommandation */}
          <View style={styles.userCardRecommandationIndex}>
            <Text style={{ color: 'red' }}>
              Recommandé à <Text style={{ fontWeight: 'bold' }}>{Math.trunc(100 * suggestion.note)}%</Text>
            </Text>
          </View>
          {/* Top content */}
          <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', marginTop: 10 }}>
            {/* Picture */}
            <ProfilePhoto image_url={recProfile.avatar} />
            {/* User basic infos */}
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{recProfile.displayName}</Text>
              <Text style={{ color: '#555' }}>@{recProfile.userName}</Text>
              <Text style={{ fontSize: 16, marginTop: 10 }}>{recProfile.status}</Text>
            </View>
          </View>
          {/* Bottom content */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {/*
            <Text key={key++}>
              <Text style={{ fontWeight: 'bold' }}>Vous avez étudié dans la même école </Text>
              <Chip>{recProfile.educations[0].label}</Chip>
            </Text>
            <Text key={key++}>
              <Text style={{ fontWeight: 'bold' }}>Vous avez travaillé dans la même entreprise </Text>
              <Chip>{recProfile.experiences[0].label}</Chip>
            </Text>
            */}
            <View key={key++}>
              <Text style={{ fontWeight: 'bold' }}>Cette personne peut vous renseigner sur ces domaines qui vous intéressent</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {suggestion.tags.map((tag, index) => (
                  <Chip key={index} style={{ marginRight: 5, marginBottom: 5 , marginTop: 5}}>
                    {tag}
                  </Chip>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const Suggestions = (props) => {
  const { suggestions, suggestionsState, getSuggestions, recProfiles, getRecProfiles, recProfilesState, history } = props;
  /*console.log("sugg his");
  console.log(history);*/
  useEffect(() => {
    if (suggestionsState === 'not_loaded') {
      getSuggestions();
    }
  }, [suggestionsState]);

  //const recProfilesArray = recProfiles.map((s) => s);

  console.log("mes suggestions");
  console.log(suggestions);

  
  console.log("mes recs:");
  console.log(recProfiles);
  //console.log("mes recs en tableau:");
  //console.log(recProfilesArray);
  /*console.log("recProfiles length: " + recProfiles.length);*/
  //console.log("curr sugg");
  //console.log(suggestions[i++]);
  return (
    <View>
      {recProfiles.map((rec,index) =>
        <UserCard key={rec.userId} recProfile={rec} suggestion={suggestions[index]} history={history} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchBar: {
    flexGrow: 100,
    marginRight: 10,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  userCard: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    marginBottom: 10,
  },
  userCardRecommandationIndex: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Suggestions));
