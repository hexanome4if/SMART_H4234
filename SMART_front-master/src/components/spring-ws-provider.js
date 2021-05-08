import React from 'react';
import SockJsClient from 'react-stomp';
import constants from '../constants';
import EventEmitter from 'events';
import { connect } from 'react-redux';

const mapStateToProps = (storeState, ownProps) => ({
  ...ownProps,
  userToken: storeState.auth.userToken,
  currentUser: storeState.auth.currentUser,
});

export class SpringWsProvider extends React.Component {
  static instance;
  static getInstance = () => SpringWsProvider.instance;

  clientRef;
  isConnected = false;
  eventEmitter;

  constructor(props) {
    super(props);
    SpringWsProvider.instance = this;
    this.eventEmitter = new EventEmitter();
    this.state = {
      topics: [],
      sessionId: null,
    };
  }

  on = (event, listener) => {
    if (!this.state.topics.includes(event)) {
      this.setState({ topics: [...this.state.topics, event] });
    }
    this.eventEmitter.on(event, listener);
  };

  off = (event, listener) => {
    this.eventEmitter.off(event, listener);
  };

  send = (event, data) => {
    console.log('Sending event: ', `/app/${event}`);
    this.clientRef.sendMessage(`/app/${event}`, JSON.stringify(data));
  };

  render = () => {
    console.log('Topics', this.state.topics);
    return (
      <>
        {this.props.userToken ? (
          <SockJsClient
            url={`http://${constants.baseURL}${constants.sockJsPath}?token=${this.props.userToken.replace(
              'Bearer ',
              '',
            )}`}
            topics={this.state.topics}
            onMessage={this.onMessage}
            ref={(client) => {
              this.clientRef = client;
            }}
            onConnect={this.onConnect}
            onConnectFailure={this.onConnectFail}
          />
        ) : null}
        {this.props.children}
      </>
    );
  };

  onMessage = (message, topic) => {
    console.log(topic, message);
    this.eventEmitter.emit(topic, message);
  };

  onConnect = () => {
    this.isConnected = true;
    console.log('Connected to Spring WS');
    this.eventEmitter.emit('connect');
    this.send('test', {});
    // this.subscribe(`/user/queue/specific-user${this.props.currentUser.userName}`, (...data) => {
    //   console.log('Rececive message');
    //   console.log(data);
    // });
  };

  onConnectFail = (...data) => {
    console.log('Failed to connect to Spring WS');
    console.log(data);
  };
}

export default connect(mapStateToProps)(SpringWsProvider);
