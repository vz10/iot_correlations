import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Chart from './chart'
import '../css/chart.css';

export default class Charts extends Component {
  render(){
    let output
    if (!this.props.loading.graphsData){
      const props = this.props;
      if (props.graphs.length > 0){
        const graphs = Object.keys(props.graphs).map( key =>
          {return props.graphs[key];}
          );
        output = graphs.map((graph, index) =>
          <Paper key={graph.descriptions.toString()} zDepth={1} className="chart-wrapper">
          <h3 className="chart-name">{ graph.descriptions[0]}  via {graph.descriptions[1]} </h3>
          <h4 className="chart-name">Correlation: {graph.correlation} </h4>
            <Chart description={graph.descriptions} data={graph.data} />
          </Paper>
        );
      } else {
        output = <h1 className="chart-name"> There is no correlations now. The world is absolutely chaotic today!!! </h1>;
      }
    }
    return (
      <div className="charts">
        {output}
      </div>
    )
  }
}
