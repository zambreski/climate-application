import React, {Component} from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalRectSeries,VerticalBarSeriesCanvas} from 'react-vis';
import {
  makeWidthFlexible,
} from 'react-vis';
import {getAsic} from './Districts';
import loader from './loader.gif';
import { CSVLink, CSVDownload } from "react-csv";

const myDATA = [
  {id: '00036', y: 200400, x: 1504121437},
  {id: '00036', y: 200350, x: 1504121156},
  {id: '00036', y: 200310, x: 1504120874},
  {id: '00036', y: 200260, x: 1504120590},
  {id: '00036', y: 200210, x: 1504120306},
  {id: '00036', y: 200160, x: 1504120024},
  {id: '00036', y: 200120, x: 1504119740},
  {id: '00036', y: 200070, x: 1504119458},
  {id: '00036', y: 200020, x: 1504119177},
  {id: '00036', y: 199980, x: 1504118893},
  {id: '00036', y: 199930, x: 1504118611},
  {id: '00036', y: 199880, x: 1504118330},
  {id: '00036', y: 199830, x: 1504118048},
  {id: '00036', y: 199790, x: 1504117763},
  {id: '00036', y: 199740, x: 1504117481}
];

const ONE_DAY = 86400000;


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

      var csvData = [
        ["Date", y_axis]
      ]

      for(var i = 0; i < this.state.items.length; i++) {
        var obj = this.state.items[i];
        csvData.push([new Date(obj[0]), obj[1]])
      }

      console.log("DATA: "+csvData);

     // console.log(data)

      if(this.state.isLoaded)
      {

        if(this.props.selectedGraphType)
        {
          // For percipitation bar graph
          var object = this.state.items[0];
          var mainTS = new Date(obj[0]).getTime

          for(var i = 0; i < this.state.items.length; i++) {
            var obj = this.state.items[i];
            if(obj[1] != 'M' || obj[1] != 'T')
            {
              var timestamp = new Date(obj[0]).getTime

              data.push({x0: (ONE_DAY * (i+1)), x: (ONE_DAY * (i+1)), y: obj[1]});
            }

            var yDomain =data.reduce(
              (res, row) => {
                return {
                  max: Math.max(res.max, row.y),
                  min: Math.min(res.min, row.y)
                };
              },
              {max: -Infinity, min: Infinity}
            );

            data.map(el => ({x0: el.x0 + mainTS, x: el.x + mainTS, y: el.y}));
            
          }
          
          return(
                <div>
                Station: {getAsic(this.props.asicStation)[0]} Data Preview
                <XYPlot
              
              xType="time"
              height={300}
              width= {1100}
              
              yDomain={[yDomain.min, yDomain.max]}
            >
              <VerticalBarSeriesCanvas className="vertical-bar-series-example" data={data} />
              <XAxis title={"Dates from "+ this.props.selectedStartDate+" to "+ this.props.selectedEndDate}/>
              <YAxis title={y_axis}/>
            </XYPlot>
            <CSVLink data={csvData}>Download Data</CSVLink>
            </div>
              
           );
          
        }else{
          // For temperature graph

          for(var i = 0; i < this.state.items.length; i++) {
            var obj = this.state.items[i];
            if(obj[1] != 'M' || obj[1] != 'T')
            {
              data.push({x: new Date(obj[0]), y: obj[1]});
            }
            
          }

          return(
            <div>
             Station: {getAsic(this.props.asicStation)[0]} Data Preview
             <XYPlot height={300} width= {1100}  xType="time" title="Average Temperature">        
                     <VerticalGridLines />
                     <HorizontalGridLines />
                     <XAxis title={"Dates from "+ this.props.selectedStartDate+" to "+ this.props.selectedEndDate}/>
                     <YAxis title={y_axis}/>
                     <LineSeries  data={data}/>
             </XYPlot >
             <CSVLink data={csvData}>Download Data</CSVLink>
            </div>
              
           );


        }

       
      }else{
        return(<div><img src={loader} class="img-fluid" /></div>)
      }
      


    }
    
}