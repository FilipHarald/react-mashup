const App = React.createClass({
  getInitialState() {
    return {
      spotifyUrl: 'https://embed.spotify.com/?uri=spotify:track:57bgtoPSgt236HzfBOd8kj',
      giphyUrl: 'http://media2.giphy.com/media/3rgXBFhCIH3zlOua8o/giphy.gif'
    };
  },
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Spogiphyify!</h2>
        </div>
        <p className="App-intro">
          Simply type your search phrase in the box and Spogiphyify will take the top result from Spotify and Giphy.
        </p>
        <SearchBox  handleSubmit={this.handleSubmit}
                    handleChangeText={this.handleChangeText}/>
        <br/>
        <ResultBox  spotifyUrl={this.state.spotifyUrl}
                    giphyUrl={this.state.giphyUrl}/>
      </div>
    );
  },
  handleChangeText(e) {
    this.setState({
        searchText: e.target.value
    });
  },
  handleSubmit(e) {
    e.preventDefault();
    this.search(this.state.searchText);
  },
  search(text) {
    var spotifyResponse = $.getJSON('https://api.spotify.com/v1/search?q=' + text + '&type=track')
    var giphyResponse = $.getJSON('http://api.giphy.com/v1/gifs/search?q=' + text + '&api_key=dc6zaTOxFJmzC');
    spotifyResponse.then((data) => {
      this.setState({spotifyUrl: 'https://embed.spotify.com/?uri=' + data.tracks.items[0].uri});
    });
    giphyResponse.then((data) => {
      this.setState({giphyUrl: data.data[0].images.original.url});
    });
  }
});

const SearchBox = React.createClass({
  render() {
    return (
      <div className="SearchBox">
        <form onSubmit={this.props.handleSubmit}>
          <input  type="text"
                  onChange={this.props.handleChangeText}/>
          <button type="submit"
                  className="submit-btn">Search!</button>
        </form>
      </div>
    );
  }
});

const ResultBox = React.createClass({
  render() {
    if (this.props.spotifyUrl && this.props.giphyUrl) {
      return(
        <div className="ResultBox">
          <iframe src={this.props.spotifyUrl} width="300" height="380"></iframe>
          <img src={this.props.giphyUrl} alt="No gif? :(" height="380" width="380"/>
        </div>
      )
    }
    return (<div className="ResultBox">Could not find a song and gif on the search.</div>);
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
