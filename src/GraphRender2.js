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
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import $ from 'jquery';

const ONE_DAY = 86400000;

/*global $, window, setTimeout, XDomainRequest */

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
		graphtype:false,
		graphExists1:'Null',
		graphExists2:'Null',
		graphExists3:'Null'
      }
	  
    }

    /*
    * This component will fetch the data from the API via ajax rest calls.
    * Note depending on the data pulled, the data will be change to reflect that.
    */
	componentDidUpdate(newProps)
	{
		
	
	  var url = "http://data.rcc-acis.org/StnData"
	 
	   /*
	  * Check to see if component should update for a new call. 
	  * Avoid creating endless loop. Check all props to see 
	  * if any changed
	  */ 
	 
	  //AJAX rest calls; only call if new selection. 
	  if (this.state.station !== this.props.asicStation || this.state.sdate !== this.props.selectedStartDate || this.state.edate !== this.props.selectedEndDate || this.state.graphtype !== this.props.selectedGraphType  ) {
	  
	  if(this.props.selectedGraphType) {
		  var params = {
			sid: String(getAsic(this.props.asicStation)[1]),
			sdate: this.props.selectedStartDate,
			edate: this.props.selectedEndDate,
			elems: [{
				name: 'pcpn',
				duration: "dly",
			}]
		  };
	  }
	  else {
		   var params = {
			sid: String(getAsic(this.props.asicStation)[1]),
			sdate: this.props.selectedStartDate,
			edate: this.props.selectedEndDate,
			elems: [{
				name: 'maxt',
				duration: "dly",
				reduce: "mean"
			}, {
				name: 'mint',
				duration: "dly",
				reduce: "mean"
			},
			{
				name: 'avgt',
				duration: "dly",
				reduce: "mean"
			},
			{
				name: 'maxt',
				normal: "departure",
				duration: "dly",
				reduce: "mean"
			},
			{
				name: 'mint',
				normal: "departure",
				duration: "dly",
				reduce: "mean"
			}]
		  };
		  
	  }

	  var xdr, args, results,
      params_string = JSON.stringify(params);
	  xdr = new XMLHttpRequest();
	  console.log(params_string)
      xdr.open("GET", url + "?params=" +    params_string);
      xdr.onload = () => {
           results = $.parseJSON(xdr.responseText); 
		   console.log(results)
		    this.setState({
				isLoaded: true,
				items: results.data,
				station:this.props.asicStation,
				sdate:this.props.selectedStartDate,
				edate:this.props.selectedEndDate,
				graphtype:this.props.selectedGraphType
		  });    
		};
	  xdr.onprogress = $.noop();
      xdr.ontimeout = $.noop();
	  xdr.onerror = () =>  {
		  this.setState({
			isLoaded: false,
			station:this.props.asicStation,
			sdate:this.props.selectedStartDate,
			edate:this.props.selectedEndDate,
			graphtype:this.props.selectedGraphType,
		  });
	  }
	  xdr.send()
				
	  // Old method (Krishane)
	/*   fetch(queryData)
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
		) */
	  }
	  
	}
	
	
    render()
    {

	  // if the chart is not undefined (e.g. it has been created)
      // then destory the old ones so we can create a new one later
      if (this.state.graphExists1 != 'Null') {
		console.log('Deleting old graph')
        this.state.graphExists1.destroy();
		this.state.graphExists2.destroy();
		this.state.graphExists3.destroy();
      }

	  //console.log(this.state.items)
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.

      if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }
	  
	  // Initialize empty list for data to be renderd
      var data = []
	  var dataMin = []
	  var dataAvg = []
	  var dataDepMax = []
	  var dataDepMin = []
	  var dataGDD = []
    
      var csvData = [
        ["Type of Data:", "Average "+y_axis],
        ["Selected District:", getDistrictName(this.props.selectedDistrict)],
        ["Generated On:", new Date()],
        ["",""],
        ["Date", y_axis]
      ]
	  
	  // Render graphs if data is fully loaded.
      if(this.state.isLoaded)
      {
        // For precipitation bar graph
        // Render the precipitation 
        if(this.props.selectedGraphType)
        {
			
		  // Initialize the metadata for csv data download
		  for(var i = 0; i < this.state.items.length; i++) {
			var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
			csvData.push([formatDate(new Date(dsplit)), obj[1]])
			// for each data point push it to the csvData list.h
		  }
		  
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
		  
	      this.state.graphExists1 = myChart
       
          return(
			
			
              <div>
				  <br/>
                  <h5> Daily precipitation for {getDistrictName(this.props.selectedDistrict)} </h5>
				  GHCN station: {getAsic(this.props.asicStation)[0]}
				  <br/>
                  <br/>
				  <p style={{textAlign: "right"}}>Total precipitation: {ptotal.toFixed(2)} inches</p>
				  <p style={{textAlign: "right",fontSize:14}}>Number of dates missing: {nMiss} </p>
                  <CSVLink data={csvData}>Download Data</CSVLink>
              </div>           
			  
			  
			 
           );
          
        }else{

          // For temperature graph
          // Render temperature graph
		  
		  console.log(this.state.items)
		  
		  // Initialize the metadata for csv data download
		  for(var i = 0; i < this.state.items.length; i++) {
			var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
			csvData.push([formatDate(new Date(dsplit)),obj[1],obj[2],obj[3]])
			// for each data point push it to the csvData list.h
		  }
		  
		  var accGDD = 0

          for(var i = 0; i < this.state.items.length; i++) {
            var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
            if(obj[1] != 'M')
            {
			  //new Date(year, month, day, hours, minutes, seconds, milliseconds)
              data.push({x: new Date(dsplit), y: obj[1]});
			  dataMin.push({x: new Date(dsplit), y: obj[2]});
			  dataAvg.push({x: new Date(dsplit), y: obj[3]});
			  dataDepMax.push({x: new Date(dsplit), y: obj[4]});
			  dataDepMin.push({x: new Date(dsplit), y: obj[5]});
			  
			  //Growing degree days 
			  var gdd = obj[3] - 50
			  if (gdd < 0) {
				  gdd = 0
			  }
			  accGDD = accGDD + gdd
			  dataGDD.push({x: new Date(dsplit), y: accGDD});
			  
            } 
          }
			// First graph
		    var ctx = document.getElementById('myChart');
			var myChart1 = new Chart(ctx, {
			 type: 'line',
			 data: {
				datasets: [{	
					// Max temp
					label: "Max",
					data: data,
					borderColor:'red',
					fill:false
				},
					{
					//Min temp
					label: "Min",
					borderColor:'blue',
					data: dataMin,
					fill:false
								},
								{
					//Mean temp
					label: "Mean",
					borderColor:'brown',
					data: dataAvg,
					fill:false
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
				legend: {display:true},
				tooltips: {bodyFontSize:16,
							titleFontSize:18,
							titleSpacing:4,
							callbacks: {
							label: function(tooltipItems, data) { 
								return tooltipItems.yLabel + ' °F';
                    }}
			 }}			 
			})
			
			// Second graph (Departure from normal)
		    var ctAnom = document.getElementById('myChart2');
			var myChart2 = new Chart(ctAnom, {
			 type: 'line',
			 plugins: [ChartAnnotation],
			 data: {
				datasets: [{	
					// Max temp
					label: "Max",
					data: dataDepMax,
					borderColor:'red',
					fill:false
				},
				{
					//Min temp
					label: "Min",
					borderColor:'blue',
					data: dataDepMin,
					fill:false
								}
	
								]
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
							labelString: 'Anomaly (°F) ',
							fontSize: 18,
							fontStyle:'bold',
						  }
						}]
					  },
					legend: {display:true},
					tooltips: {bodyFontSize:16,
								titleFontSize:18,
								titleSpacing:4,
								callbacks: {
								label: function(tooltipItems, data) { 
									return tooltipItems.yLabel + ' °F';
								}}
								},
					
					annotation: {
					  annotations: [{
						type: 'line',
						mode: 'horizontal',
						scaleID: 'y-axis-0',
						value: 0,
						borderColor: 'black',
						borderWidth: 3,
						label: {
						  enabled: false,
						  content: 'Test label'
						}
					  }]
					 }
					 
			 }		 
		})
			// Third graph
		    var ctGDD = document.getElementById('myChart3');
			var myChart3 = new Chart(ctGDD, {
			 type: 'line',
			 plugins: [ChartAnnotation],
			 data: {
				datasets: [{	
					// Max temp
					label: "GDD",
					data: dataGDD,
					borderColor:'black',
					fill:false
				},
				
								]
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
							labelString: 'GDD (°F day) ',
							fontSize: 18,
							fontStyle:'bold',
						  }
						}]
					  },
					legend: {display:true},
					tooltips: {bodyFontSize:16,
								titleFontSize:18,
								titleSpacing:4,
								callbacks: {
								label: function(tooltipItems, data) { 
									return tooltipItems.yLabel + ' °F day';
								}}
								},
					
					annotation: {
					  annotations: [{
						type: 'line',
						mode: 'horizontal',
						scaleID: 'y-axis-0',
						value: 0,
						borderColor: 'black',
						borderWidth: 3,
						label: {
						  enabled: false,
						  content: 'Test label'
						}
					  }]
					 }
					 
			 }		 
		}
		)
			
	     console.log(myChart)
		 
		 this.state.graphExists1 = myChart1
		 this.state.graphExists2 = myChart2
		 this.state.graphExists3 = myChart3
				
          return(

            <div >
             <br/>
             <h5 > Temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
             GHCN station: {getAsic(this.props.asicStation)[0]}
             <br/>
			 <br/>
			 <CSVLink data={csvData}>Download Data</CSVLink>
            </div>
           );
        }  
      }
	  // Return loading image
	  else{
        return(
		<div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
			<br/>
			<img src={loader} class="img-fluid" />
		</div>
		)
      }
      


    }
    
}
