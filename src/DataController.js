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

import { purple } from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';
import { getAsic } from './Districts';
import GraphRender from './GraphRender2'
import SatelliteController from './SatelliteController'
import GraphController from './GraphController_obs'
import CCGraphController from './GraphController_cc'


export default class DataController extends Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
	  
  
	console.log('Current plot',this.props.selectedDataType)
	
	// If observations selected, show the line graphs
	if (this.props.selectedDataType == 1) {
	
		return (
			<div>
			<GraphController selectedDistrict={this.props.selectedDistrict}></GraphController>
			
			</div>
		);
	}
	// If satellite selected, show the two images
	else if (this.props.selectedDataType == 2) {
		
		return (
			<div>
			<SatelliteController selectedDistrict={this.props.selectedDistrict}></SatelliteController>
			</div>
		);
	}
	
 // Show the climate change ops/config
	else  {
		
		return (
			<div>
			<CCGraphController selectedDistrict={this.props.selectedDistrict}></CCGraphController>
			</div>
		);
	}

  }
}