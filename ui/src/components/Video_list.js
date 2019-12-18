import React from 'react';
import Video_item from './Video_item';

const Video_list = (props) => {
    const videoList = props.videos.map(video => {
        return(
            <Video_item 
                onSelectVideo = { props.onSelectVideo }
                key={ video.etag }
                video={ video }
            />
        )
    });

    return(
        <ul className="otherList">
            { videoList }
        </ul>
    )
};

export default Video_list;