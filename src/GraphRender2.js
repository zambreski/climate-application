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


const ONE_DAY = 86400000;

/**
 * This class renders the graph given the parameters and the input.
 */
export default class GraphRender extends Component{
    
	constructor(props)
    {
      super(props);
      this.state = {
        isLoaded: false,
		graphtype:false,
        croptype:false,
		graphExists1:'Null',
		graphExists2:'Null',
		graphExists3:'Null'
      }
	  
	  this.plot1 = this.plot1.bind(this);
	  
    }
	
	plot1(item) {
		
	 console.log('HIIIIIIII')
		
	  //console.log(this.state.items)
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.

      if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }
		
		// First graph
		    var ctx = document.getElementById('myChart');
			var myChart1 = new Chart(ctx, {
			 type: 'line',
			 data: {
				datasets: [{	
					// Max temp
					label: "Max",
					data: this.props.tmax,
					borderColor:'red',
					fill:false
				},
					{
					//Min temp
					label: "Min",
					borderColor:'blue',
					data: this.props.tmin,
					fill:false
								},
								{
					//Mean temp
					label: "Mean",
					borderColor:'brown',
					data: this.props.tavg,
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
						},
				  title: {
				  display: true,
				   text: 'Daily data',
				   fontSize:25,
				   fontWeight:'bold'
						}
			 }			 
			})
		
	}

	
    render()
    {

	  // if the chart is not undefined (e.g. it has been created)
      // then destory the old ones so we can create a new one later
      /*if (this.state.graphExists1 != 'Null') {
        this.state.graphExists1.destroy();
      }	  
	  if (this.state.graphExists2 != 'Null') {
        this.state.graphExists2.destroy();
      }
	   if (this.state.graphExists3 != 'Null') {
		this.state.graphExists3.destroy();
      }
	  */

	  //console.log(this.state.items)
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.

      if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }

        // For precipitation bar graph
        // Render the precipitation 
        if(this.props.selectedGraphType)
        {

		    var ctx = document.getElementById('myChart');
			var myChart = new Chart(ctx, {
			 type: 'bar',
			 data: {
				datasets: [{	
					data: this.props.tmax,
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
			 },
			  title: {
						  display: true,
						   text: 'Daily data',
						   fontSize:25,
						   fontWeight:'bold'
						}
			 }
			})
		  
          this.state.graphExists1 = myChart
		  this.state.graphExists2 = 'Null'
		  this.state.graphExists3 = 'Null'
       
         
          
        }
		else{

          // For temperature graph
          // Render temperature graph
		  
		  

		/*   // base temperature GDDs
		  if (this.props.selectedCropType) {
				var label  = 'Accumulated GDDs (winter wheat)'
			}
		  else { 
				var label  = 'Accumulated GDDs (corn)'
			}
			
			console.log(this.props.gdd)

			// First graph
		    var ctx = document.getElementById('myChart');
			var myChart1 = new Chart(ctx, {
			 type: 'line',
			 data: {
				datasets: [{	
					// Max temp
					label: "Max",
					data: this.props.tmax,
					borderColor:'red',
					fill:false
				},
					{
					//Min temp
					label: "Min",
					borderColor:'blue',
					data: this.props.tmin,
					fill:false
								},
								{
					//Mean temp
					label: "Mean",
					borderColor:'brown',
					data: this.props.tavg,
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
						},
				  title: {
				  display: true,
				   text: 'Daily data',
				   fontSize:25,
				   fontWeight:'bold'
						}
			 }			 
			})
			
			// Second graph (Departure from normal)
		    var ctAnom = document.getElementById('myChart2');
			var myChart2 = new Chart(ctAnom, {
			 type: 'line',
			 plugins: [ChartAnnotation],
			 data: {
				datasets: [{	
					// Max temp departure
					label: "Max",
					data: this.props.tmaxDep,
					borderColor:'red',
					fill:false
				},
				{
					//Min temp departure
					label: "Min",
					borderColor:'blue',
					data: this.props.tminDep,
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
					 },
					 title: {
						  display: true,
						   text: 'Departure from normal',
						   fontSize:25,
						   fontWeight:'bold'
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
					// GDD
					label: label,
					data: this.props.gdd,
					borderColor:'orange',
					fill:true
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
					 },
					title: {
						  display: true,
						   text: 'Growing degree days',
						   fontSize:25,
						   fontWeight:'bold'
						}
					 
			 }		 
		   }
		)
		
			 this.state.graphExists1 = myChart1
			 this.state.graphExists2 = myChart2
			 this.state.graphExists3 = myChart3 */
		  
		 
		 
		// Temperature
		return (
		
			  <div className="Graph">
			 <script>{this.plot1()} </script>
			  </div>
			  
			   );
      
        
        }  
      
    }
    
}
