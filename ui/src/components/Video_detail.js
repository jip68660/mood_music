import React from 'react';

const Video_detail = ({ video }) => {
    if (!video) {
        return <div> Loading... </div>
    }

    const videoId = video.id.videoId;
    const url = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div>
            <iframe src= { url }></iframe>
            <div>
                {video.snippet.title}
            </div>
            <div>
                {video.snippet.description}
            </div>
        </div>
    )
}

export default Video_detail;