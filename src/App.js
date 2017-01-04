import React, { Component } from 'react';
import './index.css';
var $ = require('jquery');
var _ = require('lodash');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spotifyUri: '',
      giphyUrl: ''
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Spogiphyify!</h2>
        </div>
        <p className="App-intro">
          Simply type your search phrase in the box and Spogiphyify will take the top result from Spotify and Giphy.
        </p>
        <SearchBox  handleSubmit={this.handleSubmit.bind(this)}
                    handleChangeText={this.handleChangeText.bind(this)}/>
        <br/>
        <ResultBox  spotifyUri={this.state.spotifyUri}
                    giphyUrl={this.state.giphyUrl}/>
      </div>
    );
  }
  handleChangeText(e) {
    this.setState({
        searchText: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.search(this.state.searchText);
  }
  search(text) {
    var spotifyResponse = $.getJSON('https://api.spotify.com/v1/search?q=' + text + '&type=track')
    var giphyResponse = $.getJSON('http://api.giphy.com/v1/gifs/search?q=' + text + '&api_key=dc6zaTOxFJmzC');
    spotifyResponse.then((data) => {
      this.setState({spotifyUri: 'https://embed.spotify.com/?uri=' + _.get(data, 'tracks.items.0.uri')});
    });
    giphyResponse.then((data) => {
      this.setState({giphyUrl: _.get(data, 'data.0.images.original.url')});
    });
  }
}

class SearchBox extends Component {
  render() {
    return (
      <div className="SearchBox">
        <form onSubmit={this.props.handleSubmit}>
          <input type="text" onChange={this.props.handleChangeText}/>
          <button type="submit"
                  className="submit-btn">Search!</button>
        </form>
      </div>
    );
  }
}

class ResultBox extends Component{
  render() {
    const spotifyUri = _.get(this.props, 'spotifyUri');
    const giphyUrl = _.get(this.props, 'giphyUrl');
    if (spotifyUri && giphyUrl) {
      return(
        <div className="ResultBox">
          <iframe src={this.props.spotifyUri} width="300" height="380"></iframe>
          <img src={this.props.giphyUrl} alt="No gif? :(" height="380" width="380"/>
        </div>
      )
    }
    return (<div className="ResultBox"></div>);
  }
}

export default App;
