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
import {Line,Bar,Scatter} from 'react-chartjs-2';
import regression from 'regression';

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

function getFormattedDate2(date) {
 
  //var month = (1 + date.getMonth()).toString();
  //month = month.length > 1 ? month : '0' + month;
  
  var month = date.toLocaleString('default', { month: 'short' });

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + ' ' + day ;
}


// Initalize bottom line plot

export default class PlotControllerCC extends Component {
  
  constructor(props)
    {
      super(props);
      this.state = {
        isLoaded: false,
        items:{},
		station:'Null',
		sdate:'Null',
		edate:'Null',
		month:'Null',
		time:'Nul',
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
	  if (this.state.station !== this.props.asicStation || this.state.sdate !== this.props.selectedStartYear || this.state.edate !== this.props.selectedEndYear ||
	  this.state.graphtype !== this.props.selectedGraphType || this.state.month !== this.props.selectedMonth || this.state.time !== this.props.selectedTime) {
      
	  this.state.isLoaded = false
	  this.state.month = this.props.selectedMonth
	  this.state.time = this.props.selectedTime
	  
	  console.log(this.props.selectedTime)
	  console.log(this.props.selectedStartYear)
	  console.log(this.props.selectedEndYear)
	  console.log(this.props.selectedMonth)
	  
	  // Monthly parameter search
	  if (this.props.selectedTime) {
		  if(this.props.selectedGraphType) {
			  var params = {
				sid: String(getAsic(this.props.asicStation)[1]),
				sdate: this.props.selectedStartYear + '-'+ this.props.selectedMonth + '-02',
				edate: this.props.selectedEndYear + '-'+ this.props.selectedMonth + '-02',
				elems: [{
					name: 'pcpn',
					reduce: "sum",
					duration: "mly",
					interval: [0,12],
					maxmissing: "7"
				},]
			  };
		  }
		  else {
			   var params = {
				sid: String(getAsic(this.props.asicStation)[1]),
				sdate: this.props.selectedStartYear + '-'+ this.props.selectedMonth + '-02',
				edate: this.props.selectedEndYear + '-'+ this.props.selectedMonth + '-02',
				elems: [ 
				{
					name: 'avgt',
					reduce: "mean",
					duration: "mly",
					interval: [0,12],
					maxmissing: "7"
				},
				]
			  };
			  
		  }
	  }
	  // Annual parameter search
	  else {
		  if(this.props.selectedGraphType) {
			  var params = {
				sid: String(getAsic(this.props.asicStation)[1]),
				sdate: this.props.selectedStartYear + '-01-01',
				edate: this.props.selectedEndYear + '-01-01',
				elems: [{
					name: 'pcpn',
					reduce: "sum",
					interval: "yly",
					maxmissing: "15"
				},]
			  };
		  }
		  else {
			   var params = {
				sid: String(getAsic(this.props.asicStation)[1]),
				sdate: this.props.selectedStartYear + '-01-01',
				edate: this.props.selectedEndYear + '-01-01',
				elems: [ 
				{
					name: 'avgt',
					reduce: "mean",
					interval: "yly",
					maxmissing: "15"
				},
				]
			  };
			  
		  }
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
				sdate:this.props.selectedStartYear,
				edate:this.props.selectedEndYear,
				graphtype:this.props.selectedGraphType
		  });    
		};
	  xdr.onprogress = $.noop();
      xdr.ontimeout = $.noop();
	  xdr.onerror = () =>  {
		  this.setState({
			isLoaded: false,
			station:this.props.asicStation,
			sdate:this.props.selectedStartYear,
			edate:this.props.selectedEndYear,
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
	  var dataAvg = []
	  var dataAvg2 = []
		
	  var gtitle = 'Annual'
      var y_axis = "Temperature (°F)"
      // The default y axis is temperature.
	  
	  if(this.props.selectedGraphType)
      {
        // Change y axis if switch to precitpitation in props.
        y_axis = "Precipitation (inches)"
      }
	  
	  if(this.props.selectedTime)
      {
        // Change y axis if switch to precitpitation in props.
        gtitle = "Monthly"
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
		  
			
		  var nMiss  = 0;
		  
		  // Initialize the metadata for csv data download
		  /* for(var i = 0; i < this.state.items.length; i++) {
			var obj = this.state.items[i];
			var dsplit = obj[0] + ":00:00:00:00"
			csvData1.push([formatDate(new Date(dsplit)),obj[1],obj[2],obj[3]])
			// for each data point push it to the csvData list.h
		  } */


          for(var i = 0; i < this.state.items.length; i++) {
            
			var obj = this.state.items[i];
			var dsplit = obj[0] 
			
			// Put data into csv vars
			csvData1.push([formatDate(new Date(dsplit)),obj[1],obj[2],obj[3]])
			
			if(obj[1] != 'M')
            {
				//new Date(year, month, day, hours, minutes, seconds, milliseconds)
				dataAvg.push({x: parseFloat(dsplit), y: parseFloat(obj[1])});
				dataAvg2.push([parseFloat(dsplit), parseFloat(obj[1])]);	
			}
			else if(obj[1] == 'M' ){
    			nMiss = nMiss + 1
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
				label: "Precip",
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
				<p align="right" style={{fontSize:18}}>Years missing: {nMiss} </p>
				<Bar
					  data={data1}
					  height={500}
					  width={1200}
					  options={{
						  scales: {
					      xAxes: [{
								type: 'time',
								time: {
									unit: 'year',
									displayFormats: {
									day: 'YYYY'
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
								   text: gtitle,
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

		// Calculate trend line
		const result = regression.linear(dataAvg2,{order: 2,precision: 4,});
		const gradient = result.equation[0];
		const yIntercept = result.equation[1];
		
		var trendline = []		
		// Create a trend line to plot
		for(var index = 0; index < dataAvg2.length; index++) {			
			var year = dataAvg2[index][0]
			var yhat = gradient * year + yIntercept
			trendline.push({x: parseFloat(year), y: yhat});
		  }

		const data1 = {
		  
		  datasets: [{	
				// Average temp
				label: "Mean",
				data: dataAvg,
				borderColor:'red',
				fill:false
			},{	
				// Trend line
				label: "Trend line",
				data: trendline,
				borderColor:'black',
				fill:false,
				pointRadius: 0,
			}]
		  
		}
		
		return (
		
			 <html>
			 
				 <body>
					<br/>
				    {/* Create three canvas's for temperature */}
				    <h5 > Temperature for {getDistrictName(this.props.selectedDistrict)}</h5>
					 GHCN station: {getAsic(this.props.asicStation)[0]}
					<br/><br/>
					<CSVLink data={csvData1} >Download Data</CSVLink>
					<p align="right" style={{fontSize:18}}>Years missing: {nMiss} </p>
					<Line
						  data={data1}
						  height={500}
						  width ={1200}
						  options= {{
							 scales: {
								xAxes: [{
									type: 'linear',
									display: true,
									position: 'bottom',
									scaleLabel: {
										display: true,
										labelString: 'Year',
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
									   text: gtitle,
									   fontSize:25,
									   fontWeight:'bold'
											},
								trendlines: { 0: {} },
						  }	}
						 
						/>

				  </body>
 
			  </html>
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
