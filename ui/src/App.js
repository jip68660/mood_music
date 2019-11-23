import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUri: null
    }; 
    this.onTakePhotoAnimationDone = this.onTakePhotoAnimationDone.bind(this);
    this.retakePhoto = this.retakePhoto.bind(this);
  }
  onTakePhotoAnimationDone (dataUri) {
    console.log('Take Photo');
    this.setState({
      dataUri: dataUri
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
          />
        }
      </div>
    );
  }
}

export default App;
