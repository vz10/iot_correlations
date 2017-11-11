import React, { Component } from 'react';
import { connect } from 'react-redux';

import { asyncGetGraphs } from "../actions/graphs";
import ButtonAppBar from "../components/Nav";
import FullWidthTabs from "../components/Tabs";
import Charts from "../components/Charts";

import '../css/app.css';

class App extends Component {
  componentDidMount(){
     this.props.onGetGraphs();
  }

  render(){
    return (
      <div>
        <ButtonAppBar loading={this.props.loading}/>
        <div className="container">
          <FullWidthTabs />
          <Charts graphs={this.props.graphs} loading={this.props.loading}/>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    // tracks: state.tracks.filter(track => track.name.includes(state.filterTracks))
    graphs: state.graphs,
    loading: state.loading
  }),
  dispatch => ({
    // onAddTrack: (name) => {
    //   let payload = {
    //     id: Date.now().toString(),
    //     name
    //   }
    //   dispatch({ type: 'ADD_TRACK', payload})
    //   //dispatch({ type: 'ADD_TRACK', payload: payload}) <--
    // },
    // onFindTrack: (name) => {
    //   dispatch({ type: 'FIND_TRACK', payload: name})
    // },
    onGetGraphs: () => {
      dispatch(asyncGetGraphs());
    }
  })
)(App);
