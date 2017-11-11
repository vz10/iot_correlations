//https://material-ui-next.com/demos/tabs/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';

import '../css/tabs.css';

function TabContainer({ children, dir }) {
  return (
    <div dir={dir} className="tabs-container">
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class FullWidthTabs extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, value) {
    console.log(value)
    // console.log("value", e.target.value)
    this.setState({ value });
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  render() {
    const { classes, theme } = this.props;

    return (
      <Paper zDepth={1} className="main-tabs">
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            centered
          >
            <Tab label="Normal explanation" />
            <Tab label="Epic explanation" />
            <Tab label="Physical explanation" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}><p>If you haven't seen the book by Tyler Vigen named <a href="http://www.tylervigen.com/spurious-correlations">"Spurious correlations"</a> you should defenitely have a look. The author explored a big amount of the open data, finding correlations between absolutely unconnected events so it really started looking connected, for example, do you know that Per capita cheese consumption and Number of people who died by becoming tangled in their bedsheets have correlation about 95%.
So inspired but that book we decided to go further and try to find a correlation between real-time data from the different sensors connected to the Arduino (now we have temperature, light and noise sensors) and different open data streams. What we've got you can see on the git page of the project. Charts refreshed twice a day.</p></TabContainer>
          <TabContainer dir={theme.direction}><p>Have you ever heard about the butterfly effect? (In chaos theory, the butterfly effect is the sensitive dependence on initial conditions in which a small change in one state of a deterministic nonlinear system can result in large differences in a later state.) So we can imagine that one event in the past can start several different chains of events which went in different directions but remain coherent. So we can try to find such pairs of correlative events, for example, the air pressure in the Paris may changes very similar to the index of Dow Jones, and looking at one of the chains we can predict the behavior of another.</p></TabContainer>
          <TabContainer dir={theme.direction}><p>Have you ever heard about the string theory? In physics, string theory is a theoretical framework in which the point-like particles of particle physics are replaced by one-dimensional objects called strings. So everything in the Universe is strings and everything are waving according to some laws. So if we find to strings which waving very similar in some period of time we can, with a big amount of confident, think that they have similar laws of waving and will wave coherently in the future. So we can try to find such pairs of correlative strings, for example, the air pressure in the Paris may changes very similar to the index of Dow Jones, and looking at the changing of one data flow we can predict the behavior of another.</p></TabContainer>
        </SwipeableViews>
      </Paper>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
