import React from 'react';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios';
import FormData from 'form-data';

import Home from './components/Home'
import Video_detail from './components/Video_detail';
import Video_list from './components/Video_list';
import avatar from './avatar.png';

import _ from 'lodash';
import YTSearch from 'youtube-api-search';

import dotenv from 'dotenv';
import * as firebase from 'firebase';

import './App.css';

const API_KEY = 'AIzaSyA1rFHnFYY7C0Dfmeyo7H6TtMVSu0hKqFQ';
const term = 'music when you are depressed';

dotenv.config()
var firebaseConfig = {
  apiKey: 'AIzaSyB7jaWkH0KJWiADZKWd-JZVEgr-o6sezFs',
  // authDomain: '<your-auth-domain>',
  // databaseURL: '<your-database-url>',
  storageBucket: 'gs://moodmusic-280e5.appspot.com',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let storage = firebase.storage()

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Photo
      dataUri: null,
      showSub: false,
      videos: [],
      selectedVideo: null
    }; 
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    this.retakePhoto = this.retakePhoto.bind(this);
    this.handleAccess = this.handleAccess.bind(this);

  }

  videoSearch(term) {
    YTSearch({ key: API_KEY, term: term, maxResults: 4 }, videos => {
      this.setState({
        videos: videos,
        selectedVideo: videos[0] 
      });
    });
  }

  handleAccess = (e) => {
    console.log('clicked');
    this.setState({
      showSub: true
    });
    console.log(this.state.showSub);

  }

  async onTakePhotoAnimationDone (dataUri) {
    console.log('Take Photo');
    // upload photo
    var imgPathRef = storage.ref('faces/user1/image5.png');
    console.log('awaiting for PUT');

    // using string
    var metadata = {
        contentType: 'image/png',
    };
    console.log(dataUri);
    const result = await imgPathRef.putString(dataUri, 'data_url', metadata).then(function(snapshot) {
      console.log('Upload blob.');
      console.log(snapshot);
      return snapshot
    }).catch(err => {
      console.log('error....');
      console.error(err);
    });

    if (result.state === "success") {
      // trigger face detection
      const fullPath = result.metadata.fullPath
      console.log(`success! triggering face detection with ${fullPath}`);
      await axios.get("https://us-central1-moodmusic-280e5.cloudfunctions.net/face", {
        params: {
          fullPath,
        }
      }).then(res => {
        if (res.status === 200) {
          console.log(res.data.emotions);
          return res.data.emotions
        };
        console.warning(`got ${res.status} from Google Functions`);
        return [];
      });

      // search YouTube
      this.videoSearch(term);
      this.setState({
        dataUri: dataUri,
      });
    } else {
      console.warning('failed to upload photo!');
    };
  }
  retakePhoto = () => {
    this.setState({
      dataUri: null
    });
    console.log(this.state.dataUri);
  }
  
  render() {
    const videoSearch = _.debounce(term => {
      this.videoSearch(term);
    }, 300);

    return (
      <div className="App">
        <Home 
          handleAccess={ this.handleAccess } 
          showSub={ this.state.showSub }
        />
        <div 
          className="subContainer" 
          style={{ display: this.state.showSub ? 'block':'none' }}
        >
          {
            (this.state.dataUri) 
            ? <div>
                <Video_detail 
                  video={ this.state.selectedVideo } 
                />
                <Video_list 
                  onSelectVideo={ selectedVideo => this.setState({ selectedVideo })} 
                  videos={ this.state.videos } 
                />
              </div>
            : <Camera
                onTakePhotoAnimationDone = { this.onTakePhotoAnimationDone }
                imageType = { IMAGE_TYPES.PNG }
            />
          }
        </div>
         
      </div>
    );
  }
}

export default App;
