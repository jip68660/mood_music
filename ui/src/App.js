import React from 'react';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import axios from 'axios';
import FormData from 'form-data';

import Home from './components/Home'
import VideoResult from './components/VideoResult'
import './App.css';

import _ from 'lodash';
import YTSearch from 'youtube-api-search';

import dotenv from 'dotenv';
import * as firebase from 'firebase';

var term = '';
var themeclass = ['App', 'default'];

dotenv.config();
const API_KEY = process.env.REACT_APP_API_KEY;
console.log(process.env.REACT_APP_API_KEY);
var firebaseConfig = {
  apiKey: API_KEY,
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
      selectedVideo: null,
      mainTheme: "",
      region: "",
      genre: ""
    }; 
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    // this.retakePhoto = this.retakePhoto.bind(this);
    this.handleAccess = this.handleAccess.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  videoSearch(term) {
    YTSearch({ key: API_KEY, term: term }, videos => {
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
    term = this.state.region + " " + this.state.genre + " music when you are ";
    console.log(term);
  }
  handleChange = (e, value) => {
    this.setState({
      [ value ]: e.target.value
    });
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
      const emotion = await axios.get("https://us-central1-moodmusic-280e5.cloudfunctions.net/face", {
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
      //Default
      this.setState({
        mainTheme: 'joy'
      });
      var defaultEmotion = 'joy';
      var emotionList = "";
      for (let i = 0; i < emotion.length; i++ ){ 
        for (let[ key, value ] of Object.entries(emotion[i])) {
          if (value === "VERY_LIKELY" || value === "LIKELY" || value === "POSSIBLE") {
            emotionList += key;
            //Need to think how to select main theme
            this.setState({
              mainTheme: key
            });
          }
        }
      }
      if (emotionList !== "") {
        term = term + emotionList;
      }else {
        term = term + defaultEmotion;
      }
      // search YouTube
      this.videoSearch(term);
      this.setState({
        dataUri: dataUri,
      });
    } else {
      console.warning('failed to upload photo!');
    };
  }
  // retakePhoto = () => {
  //   this.setState({
  //     dataUri: null
  //   });
  //   console.log(this.state.dataUri);
  // }
  
  render() {
    const videoSearch = _.debounce(term => {
      this.videoSearch(term);
    }, 300);
    
    if (this.state.mainTheme) {
      themeclass.pop();
      themeclass.push(this.state.mainTheme);
    }

    return (
      <div className={themeclass.join(' ')} >
        <Home 
          handleAccess={ this.handleAccess } 
          showSub={ this.state.showSub }
          region={ this.state.region }
          genre={ this.state.genre }
          handleChange={ this.handleChange }
        />
        <div 
          className="subContainer" 
          style={{ display: this.state.showSub ? 'block':'none' }}
        >
          {
            (this.state.dataUri) 
            ? <VideoResult 
                video={ this.state.selectedVideo }
                onSelectVideo={ selectedVideo => this.setState({ selectedVideo })}
                videolist={ this.state.videos }
            />           
            : <Camera
                onTakePhotoAnimationDone={ this.onTakePhotoAnimationDone }
                imageType={ IMAGE_TYPES.PNG }
                idealResolution={{ width: 800, height: 600 }}
            />
          }
        </div>
         
      </div>
    );
  }
}

export default App;
