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
		graphtype:false
      }
    }
	

    /*
    * This component will fetch the data from the API via ajax rest calls.
    * Note depending on the data pulled, the data will be change to reflect that.
    */

		componentDidUpdate(newProps)
		{
		  
		  console.log(this.props.asicStation)
		  console.log(newProps.asicStation)
		  console.log(this.state.station)
		  console.log('*****')
		
		 
		  //this.state.items = {}
		  
		  var elem = "maxt"
		  if(this.props.selectedGraphType)
		  {
			elem="pcpn"
		  }

		  var queryData = "http://data.rcc-acis.org/StnData?sid="+(getAsic(this.props.asicStation)[1])+"&sdate="+this.props.selectedStartDate+"&edate="+this.props.selectedEndDate+"&elems="+elem+"&output=json"
		  
		  console.log("This query data: "+queryData)
		  
		   /*
		  * Check to see if component should update for a new call. 
		  * Avoid creating endless loop. Check all props to see 
		  * if any changed
		  */ 
		 
		  //AJAX rest calls; only call if new selection. 
		  if (this.state.station !== this.props.asicStation || this.state.sdate !== this.props.selectedStartDate || this.state.edate !== this.props.selectedEndDate || this.state.graphtype !== this.props.selectedGraphType  ) {
		  fetch(queryData)
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				isLoaded: true,
				items: result.data,
				station:newProps.asicStation,
				sdate:newProps.selectedStartDate,
				edate:newProps.selectedEndDate,
				graphtype:newProps.selectedGraphType
			  });       
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				station:newProps.asicStation,
				sdate:newProps.selectedStartDate,
				edate:newProps.selectedEndDate,
				graphtype:newProps.selectedGraphType,
				error
			  });
			}
		  )
		  }	
		  
		}
	
	
    render()
    {

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
        csvData.push([formatDate(new Date(obj[0])), obj[1]])
        // for each data point push it to the csvData list.h
      }
	  

	  
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
		  
		   var ctx = document.getElementById('myChart');

			var myChart = new Chart(ctx, {
			 type: 'bar',
			 data: {
				datasets: [{	
					data: data,
					backgroundColor:"rgba(0, 0, 255, 0.1)",
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
						fontSize: 14,
						fontStyle:'bold',
					  }
				}],
				 yAxes: [{
					  scaleLabel: {
						display: true,
						labelString: y_axis,
						fontSize: 20,
						fontStyle:'bold',
					  }
					}]
			}
		}
			 
			})
		  
	
       
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
		  
		  console.log(data)
		  
		  var ctx = document.getElementById('myChart');

			var myChart = new Chart(ctx, {
			 type: 'line',
			 data: {
				datasets: [{	
					data: data,
					backgroundColor:"rgba(0, 0, 255, 0.1)",
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
						}
					},
					scaleLabel: {
						display: true,
						labelString: 'Date',
						fontSize: 14,
						fontStyle:'bold',
					  }
				}],
				 yAxes: [{
					  scaleLabel: {
						display: true,
						labelString: y_axis,
						fontSize: 20,
						fontStyle:'bold',
					  }
					}]
			}
		}
			 
			})
				
          return(

            <div>
             Station: {getAsic(this.props.asicStation)[0]} Data Preview
             <br/>
             <br/>
          <h5> Average Temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
			

			 <XYPlot height={300} width= {1100}  margin={{top: 10, left: 60, bottom: 70, right: 10}}
              xType="time" title="Average Temperature BLAHHHHH">        
                     <VerticalGridLines />
                     <HorizontalGridLines />
                     <XAxis
					   
					   tickFormat={(d: Date) => getFormattedDate(d)}
					   style={{
						  text: {fontSize: 14}
						}}
					 />
                     
					 <YAxis
					 style={{
						  text: { fontSize: 14,fontWeight: 20}
						}}
					 />
                     
					 <ChartLabel
                      text={"Date"}
                      includeMargin={true}
                      xPercent={0.35}
                      yPercent={0.77}
					   style={{
                                fontWeight: 'bold',
                                textAnchor: 'middle',
                                fontSize: "20px",
                                fill: "#6b6b76",
                                fontFamily: "sans-serif"
                            }}
                      />
					  
					   <ChartLabel
                      text={y_axis}
                      includeMargin={true}
                      xPercent={0.01}
                      yPercent={0.3}
					  style={{
						  transform: 'rotate(-90)',
						  fontSize:'20px',
						  fontWeight:20
					  }}
                      />
					  
                       <LineMarkSeries  
                     color = "blue"
                     strokeWidth="4"
                     data={data}
                     />
					 
             </XYPlot >
			 
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
