import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import {
  makeWidthFlexible,
} from 'react-vis';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {getDistrictName} from './Districts';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import loader from './loader.gif';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';
import { getAsic } from './Districts';
import $ from 'jquery';
import {CSVLink, CSVDownload } from "react-csv";
import Chart from 'chart.js';
import {Line,Bar} from 'react-chartjs-2';

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

function getFormattedDate(date) {
 
  //var month = (1 + date.getMonth()).toString();
  //month = month.length > 1 ? month : '0' + month;
  
  var month = date.toLocaleString('default', { month: 'short' });

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + ' ' + day ;
}



// Initalize bottom line plot

export default class PlotController extends Component {
  
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
		croptype:false,
	
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
	  if (this.state.station !== this.props.asicStation || this.state.sdate !== this.props.selectedStartDate || this.state.edate !== this.props.selectedEndDate || this.state.graphtype !== this.props.selectedGraphType) {
      
	  this.state.isLoaded = false
  
	  if(this.props.selectedGraphType) {
		  var params = {
			sid: String(getAsic(this.props.asicStation)[1]),
			sdate: this.props.selectedStartDate,
			edate: this.props.selectedEndDate,
			elems: [{
				name: 'pcpn',
				interval: "dly",
				duration: "dly",
				reduce: "mean"
			},]
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
      xdr.open("GET", url + "?params=" +    params_string);
      xdr.onload = () => {
           results = $.parseJSON(xdr.responseText); 
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


  render() {
  
      // Initialize empty list for data to be renderd
      var data = []
	  var dataMin = []
	  var dataAvg = []
	  var dataDepMax = []
	  var dataDepMin = []
	  var dataGDD = []
	  var gddL = []
	  
	  //console.log(this.state.items)
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.
	  
	  if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }
    
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

          
        }
		else{

          // For temperature graph
          // Render temperature graph
		  
		  var csvData1 = [
			["Type of Data:", "Average "+y_axis],
			["Selected District:", getDistrictName(this.props.selectedDistrict)],
			["Generated On:", new Date()],
			["",""],
			["Date", y_axis]
		  ]
		  
		  var csvData2 = [
			["Type of Data:", "Departure from normals"],
			["Selected District:", getDistrictName(this.props.selectedDistrict)],
			["Generated On:", new Date()],
			["",""],
			["Date","Max","Min"]
		  ]
		  
		  var csvData3 = [
			["Type of Data:", "Growing degree days"],
			["Selected District:", getDistrictName(this.props.selectedDistrict)],
			["Generated On:", new Date()],
			["",""],
			["Date","GDD"]
		  ]
		  
		  // Initialize the metadata for csv data download
		  /* for(var i = 0; i < this.state.items.length; i++) {
			var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
			csvData1.push([formatDate(new Date(dsplit)),obj[1],obj[2],obj[3]])
			// for each data point push it to the csvData list.h
		  } */
		  
		var accGDD = 0
		
		// base temperature GDDs
		if (this.props.selectedCropType) {
			//winter wheat
		    var baseTemp = 32
			var upTemp   = 70
			var label  = 'Winter wheat'
        }
        else {
			//corn
			var baseTemp = 50
			var upTemp   = 86
			var label  = 'Corn'
        }
      

          for(var i = 0; i < this.state.items.length; i++) {
            
			var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
			
			// Put data into csv vars
			csvData1.push([formatDate(new Date(dsplit)),obj[1],obj[2],obj[3]])
			csvData2.push([formatDate(new Date(dsplit)),obj[4],obj[5]])
            
			if(obj[1] != 'M')
            {
				//new Date(year, month, day, hours, minutes, seconds, milliseconds)
				data.push({x: new Date(dsplit), y: obj[1]});
				dataMin.push({x: new Date(dsplit), y: obj[2]});
				dataAvg.push({x: new Date(dsplit), y: obj[3]});
				dataDepMax.push({x: new Date(dsplit), y: obj[4]});
				dataDepMin.push({x: new Date(dsplit), y: obj[5]});
								  
				var maxTemp = parseFloat(obj[1])
				var minTemp = parseFloat(obj[2])
				
				if (maxTemp > upTemp) {
				  maxTemp = upTemp
				}
				
				if (minTemp < baseTemp) {
				  minTemp = baseTemp
				}
				
				var avgtemp = (maxTemp + minTemp) / 2
				  
				  //Growing degree days 
				  var gdd = avgtemp - baseTemp
				  if (gdd < 0) {
					  gdd = 0
				  }
				  
				  // Accumulate GDDs
				  gddL.push({x: new Date(dsplit), y: gdd});
				  accGDD = accGDD + gdd
				  dataGDD.push({x: new Date(dsplit), y: accGDD});
				  csvData3.push([formatDate(new Date(dsplit)),accGDD])
				  
				}
				else{
					csvData3.push([formatDate(new Date(dsplit)),"M"])
				}
		  }
		}
			

	if (this.props.selectedGraphType) {
		
		//***************//
		// Precipitation //
		//***************//
		
		const data1 = {
		  datasets:  [{	
					// Precipitation
					label: label,
					data: data,
					backgroundColor:"rgba(0, 0, 255, 0.5)",
					borderColor:'black'
							},] 
					}
		
		return (
			<div className="Graph">
				<br/>
				{/* Create three canvas's for temperature */}
				<h5 > Precipitation for {getDistrictName(this.props.selectedDistrict)}</h5>
				 GHCN station: {getAsic(this.props.asicStation)[0]}
				<br/><br/>
				
				<CSVLink data={csvData}>Download Data</CSVLink>
				<p align="right" style={{fontSize:18}}>Total precipitation: {ptotal} inches </p>
				 <Bar
					  data={data1}
					  height={500}
					  width={1150}
					  options={{
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
						maintainAspectRatio: false ,
						responsive:false,
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
							}}
					/>
				
			</div>
		)
		
	}
	
	else{
		
		//*************//
		// Temperature //
		//*************//
		
	   
	   //---------------------//
	   // Data for first plot //
	   //---------------------//
	   
	   const data1 = {
		  
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
		  
		}
		
		//----------------------//
		// Data for second plot //
		//----------------------//
		
		 const data2 = {
			 datasets: [{	
					// Max temp departure
					label: "Max",
					data: dataDepMax,
					borderColor:'red',
					fill:false
				},
				{
					//Min temp departure
					label: "Min",
					borderColor:'blue',
					data: dataDepMin,
					fill:false
								}
	
								]
		  
		}
		
		//---------------------//
		// Data for third plot //
		//---------------------//
		
		const data3 = {
		  datasets:  [{	
					// Accumulated GDD
					label: 'Accumulated',
					data: dataGDD,
					borderColor:'gray',
					pointBackgroundColor:'orange',
					pointBorderColor:'black',
					pointRadius:5,
					fill:false,
					yAxisID: 'B',
							},
								
					// Daily GDD
					{
					label: 'Daily',
					data: gddL,
					backgroundColor:"rgba(153, 204, 255, 0.95)",
					yAxisID: 'A',
					type: 'bar',
							},] 
					}

		return (
		
			 <html>
			 
				 <body>

				    {/* Create three canvas's for temperature */}
					
				    <h5 > Temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
					 GHCN station: {getAsic(this.props.asicStation)[0]}
					<br/><br/>
					<CSVLink data={csvData1} >Download Data</CSVLink>
					 
					 {/**************/}
					 {/* FIRST PLOT */}
					 {/**************/}
					
					 <Line
						  data={data1}
						  height={500}
						  width={1150}
						  options= {{
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
								maintainAspectRatio: false ,
								responsive:false,
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
						  }	}
						 
						/>
					
					{/***************/}
					{/* SECOND PLOT */}
					{/***************/}
					
					<br/><br/><br/>
					<CSVLink data={csvData2} >Download Data</CSVLink><br/>
					<Line
						  data  ={data2}
						  height={500}
						  width ={1150}
						  options= {{
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
								maintainAspectRatio: false ,
								responsive:false,
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
								}}	
						 
						/>
					
					{/**************/}
					{/* THIRD PLOT */}
					{/**************/}
					
					<br/><br/><br/>
					<CSVLink data={csvData3}>Download Data</CSVLink>
					<p align="right" style={{fontSize:16,padding: 0, margin: 0}}>Base temp: {baseTemp} °F </p>
					<p align="right" style={{fontSize:16,padding: 0, margin: 0}}>Upper limit temp: {upTemp} °F </p>
					<Line
						  data={data3}
						  height={500}
						  width={1150}
						  options= {{
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
									id: 'A',
									type: 'linear',
									position: 'left',
									scaleLabel: {
										display: true,
										labelString: 'Daily GDD (°F day) ',
										fontSize: 16,
										fontStyle:'bold',
									  },
									ticks: {maxTicksLimit: 3,}
									},
									{
									id: 'B',
									type: 'linear',
									position: 'right',
									scaleLabel: {
										display: true,
										labelString: 'Accumulated GDD (°F day) ',
										fontSize: 16,
										fontStyle:'bold',
									   },
									ticks: {maxTicksLimit: 3,}
									},]
								  },
								legend: {display:true},
								maintainAspectRatio: false ,
								responsive:false,
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
									   text: label + ' growing degree days (GDDs)',
									   fontSize:25,
									   fontWeight:'bold'
									}
					 
								}}							 
						/>
				  </body>
			  </html>
			);

			}
		}
	

// Return loading image gif
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