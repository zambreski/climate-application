import React, {Component} from 'react';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries,LineMarkSeries,ChartLabel, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalRectSeries,VerticalBarSeriesCanvas} from 'react-vis';
import {makeWidthFlexible,} from 'react-vis';
import {getAsic} from './Districts';
import loader from './loader.gif';
import {CSVLink, CSVDownload } from "react-csv";
import {getDistrictName} from './Districts';
import {timeFormatDefaultLocale} from 'd3-time-format';
import Chart from 'chart.js';

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

/*
* This function just formats the date for plot
* <Returns> A string of a proper format MM-DD-YYYY.</Retutns>
*/

function getFormattedDate(date) {
 
  //var month = (1 + date.getMonth()).toString();
  //month = month.length > 1 ? month : '0' + month;
  
  var month = date.toLocaleString('default', { month: 'short' });

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + ' ' + day ;
}

//var myChart;

/**
 * This class renders the graph given the parameters and the input.
 */
export default class GraphRender extends Component{
    
	constructor(props)
    {
      super(props);
      this.state = {
        isLoaded: false,
        items:{},
		station:'Null',
		sdate:'Null',
		edate:'Null',
		graphtype:false,
		graphExists:'Null'
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

	  var queryData = "http://data.rcc-acis.org/StnData?sid="+(getAsic(this.props.asicStation)[1])+"&sdate="+this.props.selectedStartDate+"&edate="+this.props.selectedEndDate+"&elems="+elem+"&output=json"
	  
	   /*
	  * Check to see if component should update for a new call. 
	  * Avoid creating endless loop. Check all props to see 
	  * if any changed
	  */ 
	 
	  //AJAX rest calls; only call if new selection. 
	  if (this.state.station !== this.props.asicStation || this.state.sdate !== this.props.selectedStartDate || this.state.edate !== this.props.selectedEndDate || this.state.graphtype !== this.props.selectedGraphType  ) {
	  
	  console.log("This query data: "+queryData)
	  
	  fetch(queryData)
	  .then(res => res.json())
	  .then(
		(result) => {
		  this.setState({
			isLoaded: true,
			items: result.data,
			station:this.props.asicStation,
			sdate:this.props.selectedStartDate,
			edate:this.props.selectedEndDate,
			graphtype:this.props.selectedGraphType
		  });       
		},
		(error) => {
		  this.setState({
			isLoaded: true,
			station:this.props.asicStation,
			sdate:this.props.selectedStartDate,
			edate:this.props.selectedEndDate,
			graphtype:this.props.selectedGraphType,
			error
		  });
		}
	  )
	  }
	  
	}
	
	
    render()
    {

	  console.log('Check',this.state.graphExists)
	  //console.log(myChart == true)
	
	  // if the chart is not undefined (e.g. it has been created)
      // then destory the old one so we can create a new one later
      if (this.state.graphExists != 'Null') {
		console.log('Deleting old graph')
        this.state.graphExists.destroy();
      }

	  //console.log(this.state.items)
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
		var dsplit = obj[0] + ":00:00:00:00"
        csvData.push([formatDate(new Date(dsplit)), obj[1]])
        // for each data point push it to the csvData list.h
      }
	  

	  // Render graphs if data is fully loaded.
      if(this.state.isLoaded)
      {
        // For precipitation bar graph
        // Render the precipitation 
        if(this.props.selectedGraphType)
        {
		  
          var object = this.state.items[0];
          var mainTS = new Date(obj[0]).getTime
		  var nMiss  = 0;
		  var ptotal = 0;

          for(var i = 0; i < this.state.items.length; i++) {
            var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
            if(obj[1] != 'M' && obj[1] != 'T')
				{
				  data.push({x: new Date(dsplit), y: obj[1]});
				  ptotal = ptotal + parseFloat(obj[1])
				}
			else if(obj[1] == 'T' )
				{
				  data.push({x: new Date(dsplit), y: 0});
				  ptotal = ptotal 
				}
			else if(obj[1] == 'M' ){
				 nMiss = nMiss + 1
				}
            }
			console.log(nMiss)
			
		    var ctx = document.getElementById('myChart');
			var myChart = new Chart(ctx, {
			 type: 'bar',
			 data: {
				datasets: [{	
					data: data,
					backgroundColor:"rgba(0, 0, 255, 0.5)",
					borderColor:'black'
				}]
			 },
			 options: {
			  scales: {
				xAxes: [{
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
					    day: 'MMM D'
						}
					},
					scaleLabel: {
						display: true,
						labelString: 'Date',
						fontSize:18,
						fontStyle:'bold',
					  }
				}],
				 yAxes: [{
					  scaleLabel: {
						display: true,
						labelString: y_axis,
						fontSize: 18,
						fontStyle:'bold',
					  }
					}]
			      },
			legend: {display:false},
			 tooltips: {bodyFontSize:16,
							titleFontSize:18,
							titleSpacing:4,
							callbacks: {
							label: function(tooltipItems, data) { 
								return tooltipItems.yLabel + ' in';
                    }}
			 }
			 }
			})
		  
	      this.state.graphExists = myChart
       
          return(
			
			
              <div>
				  <br/>
                  Station: {getAsic(this.props.asicStation)[0]} Data Preview
                  <br/>
                  <br/>
                  <h5> Daily precipitation for {getDistrictName(this.props.selectedDistrict)} </h5>
				  <p style={{textAlign: "right"}}>Total precipitation: {ptotal.toFixed(2)} inches</p>
				  <p style={{textAlign: "right",fontSize:14}}>Number of dates missing: {nMiss} </p>
                  <CSVLink data={csvData}>Download Data</CSVLink>
              </div>           
			  
			  
			 
           );
          
        }else{

          // For temperature graph
          // Render temperature graph
		  
		  console.log(this.state.items)

          for(var i = 0; i < this.state.items.length; i++) {
            var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
            if(obj[1] != 'M')
            {
			  //new Date(year, month, day, hours, minutes, seconds, milliseconds)
              data.push({x: new Date(dsplit), y: obj[1]});
            } 
          }
		
		    var ctx = document.getElementById('myChart');
			var myChart = new Chart(ctx, {
			 type: 'line',
			 data: {
				datasets: [{	
					data: data,
					backgroundColor:"rgba(255, 0, 0, 0.1)",
					borderColor:'black'
				}]
			 },
			 options: {
			 scales: {
				xAxes: [{
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
						day: 'MMM D',
						hour:'MMM D',
						},
						tooltipFormat:'MMM D YYYY',
					},
					scaleLabel: {
						display: true,
						labelString: 'Date',
						fontSize: 18,
						fontStyle:'bold',
					  }
				}],
				 yAxes: [{
					  scaleLabel: {
						display: true,
						labelString: y_axis,
						fontSize: 18,
						fontStyle:'bold',
					  }
					}]
			      },
				  legend: {display:false},
				  tooltips: {bodyFontSize:16,
							titleFontSize:18,
							titleSpacing:4,
							callbacks: {
							label: function(tooltipItems, data) { 
								return tooltipItems.yLabel + ' °F';
                    }}
			 }}			 
			})
			
	     console.log(myChart)
		 
		 this.state.graphExists = myChart
				
          return(

            <div >
			<br/>
             Station: {getAsic(this.props.asicStation)[0]} Data Preview
             <br/>
             <br/>
             <h5 > Average temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
			 <CSVLink data={csvData}>Download Data</CSVLink>
            </div>
           );
        }  
      }
	  // Return loading image
	  else{
        return(<div><img src={loader} class="img-fluid" /></div>)
      }
      


    }
    
}
