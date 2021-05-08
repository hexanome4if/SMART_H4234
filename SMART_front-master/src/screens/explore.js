import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, Searchbar, Button, withTheme, Card, Chip } from 'react-native-paper';
import Suggestions from '../components/suggestions';
import { withRouter } from 'react-router';
import actions from '../store/actions';
import { connect } from 'react-redux';
import store from '../store';
import ResultCard from '../components/resultCard';
const filters = [
  {
    value: 'all',
    label: 'Tout',
  },
  {
    value: 'user',
    label: 'Utilisateur',
  },
  {
    value: 'formation',
    label: 'Formation',
  },
];

const sortingModes = [
  {
    value: 'compatibility',
    label: 'Compatibilité',
  },
  {
    value: 'disponibility',
    label: 'Disponibilité',
  },
];

/*
interface User {
  displayName: String;
  userName: String;
  status: String;
}

interface Recommandation {
  index: Number;
  recommandations: {
    type: 'formation' | 'experience' | 'interests',
    data: Any;
  }[]
}
*/

const userRecommandation = [
  {
    user: {
      displayName: 'Fouz Hachim',
      userName: 'faouz_hachim',
      status: "Etudiant en Informatique à L'Insa de Lyon",
    },
    recommandation: {
      index: 95,
      recommandations: [
        {
          type: 'formation',
          data: 'Insa de Lyon',
        },
        {
          type: 'experience',
          data: 'Thalès',
        },
        {
          type: 'interests',
          data: ['Informatique', 'Botanique', 'Physique', 'Science'],
        },
      ],
    },
  },
];


const mapStateToProps = (storeState, ownProps) => {
  return {
    ...ownProps,
    results: storeState.search.results,
    resultsState: storeState.search.resultsState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getResults: (label) => dispatch(actions.search.getResults(label)),
  };
};

const Explore = (props) => {

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filter, setFilter] = useState(filters[0]);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortMode, setSortMode] = useState(sortingModes[0]);

  const { getResults, results } = props;

  console.log("results:", results);

  return (
    <View style={styles.container}>
      {/* Search container */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Recherche"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar} />
        <Button style={styles.button} mode='contained' onPress={() => getResults(searchQuery)}>Recherche</Button>

        <View>
          <Text>Filtre</Text>
          <Menu
            visible={showFilterMenu}
            anchor={
              <Button compact onPress={() => setShowFilterMenu(true)} mode='outlined'>
                {filter.label}
              </Button>
            }
            onDismiss={() => setShowFilterMenu(false)}
          >
            {filters.map((filt) => (
              <Menu.Item
                title={filt.label}
                key={filt.value}
                onPress={() => setFilter(filt)}
                titleStyle={{ color: filt.value === filter.value ? props.theme.colors.primary : '#000' }}
              />
            ))}
          </Menu>
        </View>
      </View>
      {/* Sorting */}
      <View style={styles.sortContainer}>
        <Menu
          visible={showSortMenu}
          anchor={
            <Button icon='tune' onPress={() => setShowSortMenu(true)} mode='text'>
              Trier par
            </Button>
          }
          onDismiss={() => setShowSortMenu(false)}
        >
          {sortingModes.map((sort) => (
            <Menu.Item
              title={sort.label}
              key={sort.value}
              onPress={() => setSortMode(sort)}
              titleStyle={{ color: sort.value === sortMode.value ? props.theme.colors.primary : '#000' }}
            />
          ))}
        </Menu>
        <View style={{ flexGrow: 100 }} />
      </View>
      {/* Recommandations / Results */}
      <ScrollView>
        <Text style={{ fontSize: 20, marginBottom: 10, marginLeft: 5, fontWeight: 'bold' }}>Résultats de la recherche</Text>
        {results ? results.map(result => (
          <ResultCard
            key={result.userId}
            recProfile={result}
          />)) : null}

        {/* Recommandations / Results */}
        <Text style={{ fontSize: 20, marginBottom: 10, marginLeft: 5, fontWeight: 'bold' }}>Recommandations</Text>
        <Suggestions />
      </ScrollView>
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withRouter(Explore)));
