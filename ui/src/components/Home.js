import React from 'react';

const Home = (props) => {
    return(
        <div 
            className="container"
            style={{ display: props.showSub ? 'none':'block' }}    
        >
            <h1>Mood Music</h1>

            <p>Express your feelings</p>
            <button onClick={ props.handleAccess }>click</button>
        </div>
    )
};

export default Home;