import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, Searchbar, Button, withTheme, Card, Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import VisitProfile from '../screens/visit-profile';
import actions from '../store/actions';
import { withRouter } from 'react-router';
import ProfilePhoto from './profile_photo';

const ResultCard = (props) => {
    const { recProfile, suggestion, history } = props;

    console.log("suggestion dans user card");
    console.log(recProfile);
    return (
        <Card style={styles.userCard}>
            <Card.Content>
                <TouchableOpacity onPress={() => history.push(`/visit-profile/${recProfile.userId}`)} >
                    {/* Top content */}
                    <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', marginTop: 10 }}>
                        {/* Picture */}
                        <ProfilePhoto image_url={recProfile.avatar}/>
                        {/* User basic infos */}
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{recProfile.displayName}</Text>
                            <Text style={{ color: '#555' }}>@{recProfile.userName}</Text>
                            <Text style={{ fontSize: 16, marginTop: 10 }}>{recProfile.status}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Card.Content>
        </Card>
    );
};
export default withRouter(ResultCard);

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
