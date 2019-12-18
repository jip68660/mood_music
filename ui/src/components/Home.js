import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const Home = (props) => {
    return(
        <div 
            className="container"
            style={{ display: props.showSub ? 'none':'block' }} 
            onClick = { props.handleAccess}   
        >
            <div className="container_header">
                <p><FontAwesomeIcon icon={ faCompactDisc } className="fa-spin" /> Mood Music</p>
            </div>
            <div className="container_body">
                <p>Express your feelings</p>
            </div>
        </div>
    )
};

export default Home;