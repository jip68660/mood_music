import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            clicked: false,
            isHovered: false
        };
        this.handleRegion = this.handleRegion.bind(this);
        this.handleGenre = this.handleGenre.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
    }
    handleRegion = (e) => {
        this.props.handleChange(e, "region");
    }
    handleGenre = (e) => {
        this.props.handleChange(e, "genre");
    }
    toggleHover = () => {
        this.setState(prevState => ({
            isHovered: !prevState.isHovered
        }));
    }

    render(){
        return(
            ( !this.state.clicked )
            ? <div 
                className="container"
                style={{ display: this.props.showSub ? 'none':'block' }} 
                onClick = { () => { this.setState({clicked: true}) } }   
            >
                <div className="container_header">
                    <p><FontAwesomeIcon icon={ faCompactDisc } className="fa-spin" /> Mood Music</p>
                </div>
                <div className="container_body">
                    <p>Express your feelings</p>
                </div>
            </div>
            : <div 
                className="container_ask"
                style={{ display: this.props.showSub ? 'none': 'flex' }}
            >
                <div className="inputForm"> 
                    <div className="inputRegion">
                        <span>Region: </span>
                        <input value={ this.props.region } onChange={ this.handleRegion } />
                    </div>
                    <div className="inputGenre">
                        <span>Genre: </span>
                        <input value={ this.props.genre } onChange={ this.handleGenre } /> 
                    </div>
                    <p>&#9674; Not Required</p>
                </div>
                <div className="submitButton" onMouseEnter={ this.toggleHover } onMouseLeave={ this.toggleHover }>
                    <FontAwesomeIcon 
                        icon={ faCompactDisc } 
                        onClick={ this.props.handleAccess } 
                        className={ this.state.isHovered ? "fa-spin" : "" } 
                        size="3x"
                    />
                </div>            
            </div>
    )
    }
};

export default Home;