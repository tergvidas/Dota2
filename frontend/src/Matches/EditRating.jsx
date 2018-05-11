import React from 'react';
import "./EditRating.css";
import MatchList from "./MatchList.jsx";

class EditRating extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
            error: null,
            review: props.review,
            update:{
                updateNewPlayer: true
            }            
      };
      this.emptyRating = false;
      this.currentDate = this.getCurrentDate();
    }

    /**
     * @returns {String} returns current data YYYY-MM-DD
     */
    getCurrentDate(){
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        return yyyy + (mm<10?'-0':'-') + mm + (dd<10?'-0':'-') + dd;
    }

    componentDidMount() {
        if (!this.state.review.review){
            this.emptyRating = true;
            this.createNewReview();
        }
    }

    createNewReview(){
        let tempReview  = this.state.review;
        tempReview.review = {
            ratingId: "",
            createDate: this.currentDate,
            modifyDate: this.currentDate,
            matchId: "",
            rating: 1,
            name: "",
            comment: "",
            anonymous: 'false'
        };
            this.setState({review: tempReview});
    }

    updateRating(){
        let review = this.state.review.review;
        review.modifyDate = this.currentDate;
        let methodType = 'post';
        if(review.ratingId)
            methodType = 'put';

        fetch("http://localhost:3000/MatchRating/",{
            method: methodType,
            body: JSON.stringify(review),
            headers: {"Content-Type": "application/json"}
          })
          .then(response => {
            if (response.status == 400){
                throw new Error('[' + (review.ratingId?'update':'create') + '] Invalid data ...');
                return;
            }
            if (response.ok) {
                this.props.updateRatings();
            } else {
                throw new Error('[' + (review.ratingId?'update':'create') + '] Something went wrong ...');
            }
        })
        .then(data => this.setState({ ratings: data, isLoading: false}))
        .catch(error => this.setState({ error, isLoading: false }));
            
    }

    getReviewName(){
        if (!this.state.review.review)
            return(
                <div className="name">SteamID32: <input name="name" type="text" onChange = {this.handleChange.bind(this)}/></div>
            );
        if (this.state.review.review.anonymous === "true" && !this.emptyRating)
            return null;
        else
            return(
                <div className="name">SteamID32: <input name="name" type="text" onChange = {this.handleChange.bind(this)} defaultValue={this.state.review.review.name}/></div>
            );
    }

    getAnonymousRadio(){
        let review = this.state.review;
        
        if (!review.review)
            return null;
        if (review.review.anonymous === "true")
        return(
            <div className="anonymous">Anonymous rating: 
                <input type="radio" value="true" name="group1" checked onClick = {()=> {review.review.anonymous = "true", this.setState({review: review})}}/>true 
                <input type="radio" value="false"  name="group1" onClick = {()=> {review.review.anonymous = "false", this.setState({review: review})}}/>false 
            </div>
        );
        else
            return(
                <div className="anonymous">Anonymous rating: 
                    <input type="radio" value="true" name="group1" onClick = {()=> {review.review.anonymous = "true", this.setState({review: review})}}/>true 
                    <input type="radio" value="false" name="group1" checked onClick = {()=> {review.review.anonymous = "false", this.setState({review: review})}}/>false 
                </div>
            );
    }

    getDeleteButton(){
        return(<div><button id="DeleteRating"
                onClick = {()=> {this.deleteRating()}}>delete</button></div>)
    }

    deleteRating(){
        fetch("http://localhost:3000/MatchRating/"+this.state.review.review.ratingId, {method: 'delete'})
            .then(response => {
                if (response.ok) {
                    this.props.updateRatings();
                } else {
                    throw new Error('[delete] Something went wrong ...');
                }
            })
            .then(data => this.setState({ ratings: data, isLoading: false}))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    handleChange(event){
        let review = this.state.review;
        let editingName = event.target.name;

        review.review[editingName] = event.target.value;
        if(editingName === 'name'){
            let update = this.state.update;
            update.updateNewPlayer = true;
            this.setState({update: update});    
        }
    }

    render () {
        const {error} = this.state;
        let review = this.state.review.review;
        if (!review){
            this.emptyRating = true;
        }
        
        return (
        <div>
            <div id="popup-box1" class="popup-position">
                <div id="popup-wrapper">
                    <div id="popup-container">
                        <h3>{!this.emptyRating? 'Edit': 'Add new'} Rating</h3>
                        {!this.emptyRating? this.getDeleteButton(): null}
                        {error? <p>{error.message}</p> : null}
                        <div id ="ratingDate" className="ratingDate">Create date: <input type="date" name="bday" 
                                value={!this.emptyRating?review.createDate: this.currentDate} disabled/></div>
                        <div className="ratingDate">Last edited: <input type="date" name="bday" 
                                value={!this.emptyRating?review.modifyDate: this.currentDate} disabled/></div>
                        <div className="matchId">Match Id: <input type="number" name="matchId" onChange = {this.handleChange.bind(this)} defaultValue={!this.emptyRating?review.matchId:null} /></div>
                        {this.getReviewName()}
                        <div id ="rating" className="rating">Rating: <input type="number" name="rating" onChange = {this.handleChange.bind(this)} min="1" max="10" defaultValue={!this.emptyRating?this.state.review.review.rating:"1"}/></div>
                        <div className="comment">Comment: <input type="text" name="comment" onChange = {this.handleChange.bind(this)} defaultValue={!this.emptyRating?review.comment:null}/></div>
                        {this.getAnonymousRadio()}
                        <button className="Button"
                            onClick = {()=> {this.props.updateRatings();}}>
                                Cancel and Close
                        </button>
                        <button className="Button"
                            onClick = {()=> {this.updateRating()}}>
                                {!this.emptyRating? 'Update':  'Add new'} rating
                        </button>
                        {review?<MatchList update={this.state.update} reviewData={this.state.review}/>:null}
                    </div>
                </div>
            </div>
        </div>
        )
    }
  }
  
export default EditRating;

      