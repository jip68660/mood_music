import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import decode from 'unescape';

const Video_detail = ({ video }) => {
    if (!video) {
        return <div className="loading"> <FontAwesomeIcon icon={ faCompactDisc } className="fa-spin" /> </div>
    }

    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;
    console.log(video.snippet.title);
    const text = video.snippet.title;
    console.log(decode(text));

    return (
        <div className="displayed">
            <iframe src= { url }></iframe>
            <div className="displayed_title">
                { decode(video.snippet.title) }
            </div>
        </div>
    )
}

export default Video_detail;