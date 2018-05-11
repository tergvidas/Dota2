import React from 'react';
import "./Ratings.css";
import EditRating from "./EditRating.jsx";

class Ratings extends React.Component
{
    constructor(props)
    {
        super(props);
       
        this.state = 
        {
            error: null,
            isLoading: false,
            ratings: [],
            review: {
                review : null
            }
        }
        this.showPopup = false;
        this.filterOptions = {
            filter: false,
            from: null,
            to: null,
            anonymous: false,
            both: false,
            showItems: 10
        }
        this.searchText = "";
    }

    componentDidMount() {
       this.updateData(false);
    }

    /**
     * @returns {String}
     */
    getFilterParam(){
        return '/' + this.filterOptions.filter + '&' + this.filterOptions.from + '&' + this.filterOptions.to + '&' 
                + this.filterOptions.anonymous + '&' + this.filterOptions.showItems + '&' + this.filterOptions.both;
    }

    /**
     * @param {Boolean} searchData 
     */
    updateData(searchData){
       this.setState({isLoading: true});
       let url = "http://localhost:3000/MatchRatings" + this.getFilterParam();

       if (this.searchText === "")
            searchData = false;
       if (searchData)
           url = "http://localhost:3000/MatchRating/"+this.searchText;

       fetch(url)
            .then(response => {
                if (response.ok)
                    return response.json();
                throw new Error('Something went wrong ...');
            })
            .then(data => this.setState({ ratings: data, isLoading: false}))
            .catch(error => this.setState({ error, isLoading: false }));
        this.filterOptions.filter = 'false';
    }

    changedData(){
        this.updateData(false);
        this.showPopup = !this.showPopup;
    }

    getMatchDiv(){
        let newReview = this.state.review;
        return( this.state.ratings.map((ratings) =>
        <div id="Rating" className="Rating"  onClick = {()=> {newReview.review = ratings, this.setState({review: newReview}), this.showPopup=true ;}}>
            <div className="RatingMatchText">Rating ID: {ratings.ratingId} </div>
            <div className="RatingMatchText">Match ID: {ratings.matchId} </div>
            <div className="RatingMatchText">Rating: {ratings.rating} </div>
            <div className="RatingMatchAnn">Rating anonymous: {ratings.anonymous}</div>
            <div className="RatingMatchAnn">Rating date: {ratings.createDate}</div>
        </div>
        ));
    }

    setSearchOptions(){
        this.searchText = document.getElementById('searchText').value;
        this.updateData(true);
        document.getElementById('searchText').value = "";
    }
    
    applyFilter(){
        this.filterOptions.filter = 'true';
        this.filterOptions.showItems = document.getElementById('showType').value;
        this.updateData(false)
    }

    handleChange(event){
        this.filterOptions[event.target.name] = event.target.value;
        if (event.target.value === "")
            this.filterOptions[event.target.name] = 'null';
    }

    render()
    {
        const {isLoading, error} = this.state;
        let newReview = this.state.review;

        return(
            <div>
                <div className = "SearchBox">
                    Search <input id="searchText" className="searchText" type="text"/>
                    <button className="Button"
                        onClick = {()=> {this.setSearchOptions()}}>
                        Search
                    </button>
                </div>
                {error? <p>{error.message}</p> : null}
                {isLoading? <p>Loading data ...</p> : null}
                <div className="MatchList">
                    {this.getMatchDiv()}
                </div>
                <div className="FilterBox">
                    <h2 className="FilterRating">Rating</h2>
                    <div>
                        <p className="FilterRatingPick">From</p>
                        <input type="number" name="from" className="FilterRatingInput" min="1" max="10" onChange = {this.handleChange.bind(this)}/>
                    </div>
                    <div>
                        <p className="FilterRatingPick">To</p>
                        <input type="number" name="to" className="FilterRatingInput" min="1" max="10" onChange = {this.handleChange.bind(this)}/>
                    </div>
                    <div className="FilterRating"> 
                        <input type="checkbox" value="true" onClick = {()=> {this.filterOptions.anonymous = !this.filterOptions.anonymous}}/>anonymous
                        <input type="checkbox" value="true" onClick = {()=> {this.filterOptions.both = !this.filterOptions.both}}/>both
                    </div>
                    <div className="FilterShowType"> Show items
                        <select className="showType" id="showType">
                            <option value="10">10</option>
                            <option value="20">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div>
                        <button className="FilterButton"
                            onClick = {()=> {this.applyFilter()}}>
                            Apply Filter
                        </button>
                        <button className="FilterButton"
                            onClick = {()=> {newReview.review = null, this.setState({review: newReview}), this.showPopup=true ;}}>
                            Add new rating
                        </button>
                    </div>
                {this.showPopup? <EditRating review={this.state.review} updateRatings={this.changedData.bind(this)}/> : null}
                </div>
            </div>
            
        );
    }
}
export default Ratings;