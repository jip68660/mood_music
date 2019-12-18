import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const Video_detail = ({ video }) => {
    if (!video) {
        return <div className="loading"> <FontAwesomeIcon icon={ faCompactDisc } className="fa-spin" /> </div>
    }

    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="displayed">
            <iframe src= { url }></iframe>
            <div className="displayed_title">
                {video.snippet.title}
            </div>
        </div>
    )
}

export default Video_detail;