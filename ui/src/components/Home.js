import React from 'react';
import './Home.css';

const Home = (props) => {
    return(
        <div 
            className="container"
            style={{ display: props.showSub ? 'none':'block' }}    
        >
            <p><i class="fas fa-compact-disc"></i>Mood Music</p>

            <p>Express your feelings</p>
            <button onClick={ props.handleAccess }>click</button>
        </div>
    )
};

export default Home;