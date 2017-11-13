import React, { Component } from 'react';
import { AreaChart, linearGradient, ResponsiveContainer, stop, defs, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import '../css/chart.css';

export default class Chart extends Component {
  render(){
    return (
      <ResponsiveContainer width="100%" height={300} min-height={200}>
        <AreaChart data={this.props.data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey={this.props.description[0]} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey={this.props.description[1]} stroke='#82ca9d' fillOpacity={1} fill="url(#colorUv1)"/>
          </AreaChart>
      </ResponsiveContainer>
    )
  }
}
