import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Webcam from 'react-webcam';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Photo
      dataUri: null
    }; 
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    this.retakePhoto = this.retakePhoto.bind(this);
  }
  // componentDidMount() {    
  //   var constraints = { audio: true, video: true};
  //   if (navigator.mediaDevices === undefined) {
  //     navigator.mediaDevices = {};
  //   }
  //   if (navigator.mediaDevices.getUserMedia === undefined) {
  //     navigator.mediaDevices.getUserMedia = function(constraints) {
  //       var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  //       if (!getUserMedia) {
  //         return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  //       }
  //       return new Promise(function(resolve, reject) {
  //         getUserMedia.call(navigator, constraints, resolve, reject);
  //       });
  //     }
  //   }
  //   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  //   .then(function(stream) {
  //     var video = document.querySelector('video');
  //     if ("srcObject" in video) {
  //       video.srcObject = stream;
  //     } else {
  //       video.src = window.URL.createObjectURL(stream);
  //     }
  //     video.onloadedmetadata = function(e) {
  //       video.play();
  //     };
  //   })
  //   .catch(function(err) {
  //     console.log(err.name + ": " + err.message);
  //   });
  // }

  onTakePhotoAnimationDone (dataUri) {
    console.log('Take Photo');
    this.setState({
      dataUri: dataUri
    });
    const data = new FormData();
    data.append('file', this.state.dataUri);
    axios.post("https://us-central1-moodmusic-280e5.cloudfunctions.net/face", data, {
    })
    .then(res => {
      console.log(res.statusText)
    });
  }
  retakePhoto = () => {
    this.setState({
      dataUri: null
    });
  }
  
  render() {
    return (
      <div className="App">
        <h1>Mood Music</h1>
        {/* <Webcam /> */}
        {
          (this.state.dataUri) 
          ? <div>
              <img src={ this.state.dataUri } />
              <button
                className={ "retake"}
                onClick={ this.retakePhoto }
              >
              Want to take another one?
              </button>
            </div>
          : <Camera
              onTakePhotoAnimationDone = { this.onTakePhotoAnimationDone }
              imageType = { IMAGE_TYPES.PNG }
          />
        }
      </div>
    );
  }
}

export default App;
