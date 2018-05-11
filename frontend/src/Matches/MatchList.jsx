import React from 'react';
import "./MatchList.css";

class MatchList extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            error: false,
            isLoading: false,
            matchData: [],
            reviewData: props.reviewData,
            update: props.update
        }
        this.page = 0;
    }

  componentDidMount() {
    this.matchData = this.updateMatchData()
  }

  updateMatchData(){
    const {update, reviewData} = this.state;
    update.updateNewPlayer = false;
    this.setState({update: update, isLoading: true});
    
    let startFromData = this.page * 8;  
    let steam32ID = "z";

    if(reviewData.review.name != "")
        steam32ID = reviewData.review.name;

    let url = "http://localhost:3000/MatchList/"  +steam32ID+'&'+startFromData+'&8';
    fetch(url)
        .then(response => {
            let emptyData = [];
            if (response.ok)
                return response.json();
            this.setState({matchData: emptyData});
            if (response.status == 500)
                throw new Error('[SteamID32] insert SteamID32 to get match list')
            else
                throw new Error('[Wrong SteamID32] SteamID32 contains only numbers');
        })
        .then(data => this.setState({matchData: data, error: false, isLoading: false}))
        .catch(error => this.setState({ error, isLoading: false }));
  }
  /**
   * @param {number} secounds 
   * @returns {String}
   */
  secoundsToData(secounds){
    let tempTime = new Date(1970, 0, 1);
    tempTime.setSeconds(secounds);
    
    let years = tempTime.getFullYear();
    let month = tempTime.getMonth()+1;
    let day = tempTime.getDate();
    let hours = tempTime.getHours();
    let minutes = tempTime.getMinutes();
    return years + "-" + (month>9?month:'0'+month) + "-" + (day>9?day:'0'+day) + " Time:  " +
        (hours>9?hours:'0'+hours) + ":" + (minutes>9?minutes:'0'+minutes);
  }
  getMatchList(){
    return( 
        this.state.matchData.map((match) =>
            <div>
                <div> Match ID: {match.match_id}</div>
                <div> Date: {this.secoundsToData(match.start_time)}</div>
                <div> Winner: {match.radiant_win?'Radiant':'Dire'}</div>
                <p></p>
            </div>
    ));
  }

  changeDataPage(isNextPage){
        if(isNextPage)
            this.page = this.page + 1;
        else
            this.page = this.page - 1;
        this.updateMatchData();
  }

  render () {
    const {isLoading, error, update} = this.state;
      if (update.updateNewPlayer){
        this.updateMatchData();
      }

      return (
      <div>
          <div id="popup-box2" class="popup-position2">
              <div id="popup-wrapper2">
                  <div id="popup-container2">
                        <h3>Match List</h3>
                        {isLoading? <p>Loading data ...</p> : null}
                        {error? <p>{error.message}</p> : null}
                        {this.getMatchList()}
                        current page {this.page+1}
                        <div>
                            <button className="PageButtons"
                                onClick = {()=> {this.page>0?this.changeDataPage(false):null}}>
                                Previous page
                            </button>
                            <button className="PageButtons"
                                onClick = {()=>  {this.changeDataPage(true)}}>
                                Next page
                            </button>
                        </div>
                  </div>
              </div>
          </div>
      </div>
      )
  }
}
export default MatchList;