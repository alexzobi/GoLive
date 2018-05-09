import React, { Component } from 'react';
import io from 'socket.io-client';
window.io = io;
import RTCMultiConnection from 'rtcmulticonnection-v3';
import { connect } from 'react-redux';
import MediaElement from './MediaElement';
import { Image } from 'semantic-ui-react';
import UserMini from './UserMini';

const mapState = state => ({
  broadcast: state.broadcast,
  isLive: false
});

const fakeUsers = [
  {
    id: 1,
    fullName: 'Geoff Bass',
    broadcastRating: 5,
    callerRating: 5,
    imageUrl: "/images/fakeData/Geoff.jpeg",
    isBroadcasting: true,
    isCalling: false
  },
  {
    id: 2,
    fullName: 'Omri Bernstein',
    broadcastRating: 5,
    callerRating: 5,
    imageUrl: "/images/fakeData/omri.png",
    isBroadcasting: false,
    isCalling: true
  },
  {
    id: 3,
    fullName: 'Corey Greenwald',
    broadcastRating: 5,
    callerRating: 3,
    imageUrl: "/images/fakeData/Corey.jpg",
    isBroadcasting: false,
    isCalling: true
  },
  {
    id: 4,
    fullName: 'Karen MacPherson',
    broadcastRating: 5,
    callerRating: 5,
    imageUrl: "/images/fakeData/karen.jpeg",
    isBroadcasting: false,
    isCalling: true
  },
  {
    id: 5,
    fullName: "Scott D'Alessandro",
    broadcastRating: 4,
    callerRating: 5,
    imageUrl: "/images/fakeData/scott.jpg",
    isBroadcasting: true,
    isCalling: false
  }
];

export class Broadcast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null
    };
    this.startBroadcast = this.startBroadcast.bind(this);
  }

  startBroadcast(id) {
    this.connection = new window.RTCMultiConnection();
    this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    this.setState({isLive: !this.state.isLive});
    //session setup
    this.connection.session = {
      audio: true,
      video: false,
      oneway: true
    };

    //make sure I also don't see the video
    this.connection.mediaConstraints.video = false;
    this.connection.autoCreateMediaElement = false;

    // append it to the body
    this.connection.onstream = event => {
      this.setState({event});
    };
    this.connection.openOrJoin(id);
  }

  render() {
    const broadcasters = fakeUsers.filter(user => {
      if (user.isBroadcasting) return user;
    });

    const callers = fakeUsers.filter(user => {
      if (user.isCalling) return user;
    });

    const myID = this.props.match.params.broadcastId;
    return (
      <div id="container broadcast">
        <h1 id="broadcast-title">AwesomeCast</h1>
        <div id="live-button">
          {myID ? (
            <Image size="small" onClick={this.startBroadcast} src={this.state.isLive ? '/images/record_on.png' : '/images/record.png'} />
          ) : null}
          {
            this.state.event ?
              <MediaElement event={this.state.event} />
              : null
          }
        </div>
        <div  id="broadcaster-list">
          <h1>Broadcasters</h1>
          {
            broadcasters.map(user => {
              return (
                <UserMini
                  key={user.id}
                  user={user}
                  rate={user.broadcastRating}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(mapState)(Broadcast);