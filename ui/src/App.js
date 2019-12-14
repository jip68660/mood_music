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
    /*
    bucket.upload(dataUri, function(err, file, apiResponse) {
      // Your bucket now contains:
      // - "image.png" (with the contents of `/local/path/image.png')
      console.log(`done uploading ${dataUri}`);

      // `file` is an instance of a File object that refers to your new file.
    });
    */
    this.videoSearch(term);

    // var imgPathRef = storage.ref('faces/user1/image1.png');
		// imgPathRef.getDownloadURL().then(function(url) {
		// 	// `url` is the download URL for 'images/stars.jpg'

		// 	// This can be downloaded directly:
		// 	var xhr = new XMLHttpRequest();
		// 	xhr.responseType = 'blob';
		// 	xhr.onload = function(event) {
		// 		var blob = xhr.response;
		// 		console.log(blob);
    //     console.log('done');
    //   };
      
		// 	xhr.open('GET', url);
		// 	return xhr.send();

		// }).catch(function(error) {
		// 	// Handle any errors
    // });
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
