import React, { Component } from 'react';
import '../css/spinner.css';

export default class Chart extends Component {
  render(){
    let spinnerStyle = {
      display: (this.props.loading ? "block" : "none")
    };

    return (
      <div className="loader" style={spinnerStyle}></div>
    )
  }
}
