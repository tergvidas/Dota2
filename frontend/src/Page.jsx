import React from 'react';
import Ratings from './Matches/Ratings.jsx';
import "./Page.css";

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="Header">
                    <h1>Dota2 match reviews</h1>
                </div>
                <div className="Matches">
                    <Ratings/>
                </div>
            </div>
        );
    }
}

export default Page;