import React, {Component} from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis} from 'react-vis';
import {
  makeWidthFlexible,
} from 'react-vis';
import {getAsic} from './Districts';
import loader from './loader.gif';


export default class GraphRender extends Component{
    constructor(props)
    {
      super(props);
      this.state = {
        isLoaded:false,
        items:{}
      }
    }

    componentWillUpdate(newProps)
    {
      var elem = "maxt"
      if(this.props.selectedGraphType)
      {
        elem="pcpn"
      }

      this.state.items = {}
      this.state.isLoaded = false;
      var queryData = "http://data.rcc-acis.org/StnData?sid="+(getAsic(this.props.asicStation)[1])+"&sdate="+this.props.selectedStartDate+"&edate="+this.props.selectedEndDate+"&elems="+elem+"&output=json"
      console.log("This query data: "+queryData)
      fetch(queryData)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.data
          });       
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      
    }

   


    render()
    {
      var y_axis = "Temperature (°F)"

      if(this.props.selectedGraphType)
      {
        y_axis = "Percipitation (inches)"
      }
      var data = []



      for(var i = 0; i < this.state.items.length; i++) {
        var obj = this.state.items[i];
    
        data.push({x: new Date(obj[0]), y: obj[1]});
      }

      console.log(data)

      if(this.state.isLoaded)
      {
        return(
          <div>
            {getAsic(this.props.asicStation)[0]}
           <XYPlot height={300} width= {1100}  xType="time" title="Average Temperature">        
                   <VerticalGridLines />
                   <HorizontalGridLines />
                   <XAxis title={"Dates from "+ this.props.selectedStartDate+" to "+ this.props.selectedEndDate}/>
                   <YAxis title={y_axis}/>
                   <LineSeries data={data}/>
           </XYPlot >
          </div>
            
         );
      }else{
        return(<div><img src={loader} class="img-fluid" /></div>)
      }
      


    }
    
}