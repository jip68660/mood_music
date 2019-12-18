import React from 'react';
import Video_detail from './Video_detail';
import Video_list from './Video_list';
import './VideoResult.css';

const VideoResult = (props) => {
    return(
        <div className="video_container">
            <Video_detail 
                video={ props.video } 
            />
            <Video_list 
                onSelectVideo={ props.onSelectVideo } 
                videos={ props.videolist } 
            />
        </div>
    )
}

export default VideoResult;


