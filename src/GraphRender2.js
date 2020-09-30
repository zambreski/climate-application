import React, {Component} from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalRectSeries,VerticalBarSeriesCanvas} from 'react-vis';
import {makeWidthFlexible,} from 'react-vis';
import {getAsic} from './Districts';
import loader from './loader.gif';
import { CSVLink, CSVDownload } from "react-csv";
import {getDistrictName} from './Districts';


const ONE_DAY = 86400000;

/*
* This function just formats the date to proper date format.
* <Returns> A string of a proper format MM-DD-YYYY.</Retutns>
*/
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * This class renders the graph given the parameters and the input.
 */
export default class GraphRender extends Component{
    constructor(props)
    {
      super(props);
      this.state = {
        isLoaded:false,
        items:{}
      }
    }


    /*
    * This component will fetch the data from the API via ajax rest calls.
    * Note depending on the data pulled, the data will be change to reflect that.
    */
	 
		componentDidUpdate(newProps)
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
		 
		  //AJAX rest calls
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
		  console.log(this.isLoaded)
		}
	

    render()
    {
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.

      if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }
      
      var data = []
      // Initialize empty list for data to be renderd

      var csvData = [
        ["Type of Data:", "Average "+y_axis],
        ["Selected District:", getDistrictName(this.props.selectedDistrict)],
        ["Generated On:", new Date()],
        ["",""],
        ["Date", y_axis]
      ]

      // Initialize the metadata for csv data download

      for(var i = 0; i < this.state.items.length; i++) {
        var obj = this.state.items[i];
        csvData.push([formatDate(new Date(obj[0])), obj[1]])
        // for each data point push it to the csvData list.
      }

	  console.log(this.state.isLoaded)
      if(this.state.isLoaded)
      {
        // Render graphs if data is fully loaded.

        if(this.props.selectedGraphType)
        {
          // For precipitation bar graph
          // Render the precipitation 
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
                  <br/>
                  <br/>
                  <h5> Average Precipitation for {getDistrictName(this.props.selectedDistrict)} </h5>
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
          // Render temperature graph

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
             <br/>
             <br/>
          <h5> Average Temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
             <XYPlot height={300} width= {1100}  xType="time" title="Average Temperature BLAHHHHH">        
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
