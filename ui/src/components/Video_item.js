import React from 'react';

const Video_item = (props) => {
    const thumnail = props.video.snippet.thumbnails.default.url;

    return(
        <li>
            <div className="not_displayed">
                <img src={ thumnail } onClick={ () => props.onSelectVideo(props.video) } />
                {/* { props.video.snippet.title } */}
            </div>
        </li>
    )
};

export default Video_item;