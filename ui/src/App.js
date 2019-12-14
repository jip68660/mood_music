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
import admin from 'firebase-admin';

import './App.css';

const API_KEY = 'AIzaSyA1rFHnFYY7C0Dfmeyo7H6TtMVSu0hKqFQ';
const term = 'music when you are depressed';

dotenv.config()

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

    // initialize Firebase Admin
    admin.initializeApp({
      apiKey: process.env.MOOD_MUSIC_API_KEY,
      // authDomain: '<your-auth-domain>',
      // databaseURL: '<your-database-url>',
      storageBucket: process.env.MOOD_MUSIC_BUCKET_URI,
    });
    this.bucket = admin.storage().bucket();
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

  onTakePhotoAnimationDone (dataUri) {
    console.log('Take Photo');
    this.setState({
      // dataUri: dataUri
      dataUri: avatar 
    });
    console.log(this.state.dataUri);
    const data = new FormData();
    data.append('file', this.state.dataUri);

    // upload photo
    console.log(`data URI: ${dataUri}`)
    this.bucket.upload(dataUri, function(err, file, apiResponse) {
      // Your bucket now contains:
      // - "image.png" (with the contents of `/local/path/image.png')
      console.log(`done uploading ${dataUri}`);

      // `file` is an instance of a File object that refers to your new file.
    });









    /*
    // trigger face API call
    axios.post("https://us-central1-moodmusic-280e5.cloudfunctions.net/face", data, {
    })
    .then(res => {
      console.log(res.statusText)
    });
    this.videoSearch(term);
    */
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
