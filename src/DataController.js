import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import 'date-fns';
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
			<div style={{textAlign: 'center',fontSize:24}}>
				Under construction
			{/* <SatelliteController selectedDistrict={this.props.selectedDistrict}></SatelliteController> */}
			</div>
		);
	}
	
   // Show the climate change ops/config
	else if (this.props.selectedDataType == 3) {
		
		return (
			<div>
			<CCGraphController selectedDistrict={this.props.selectedDistrict}></CCGraphController>
			</div>
		);
	}
	
	// Show the climate change ops/config
	else if (this.props.selectedDataType == 4) {
		
		return (
			<div style={{textAlign: 'center',fontSize:24}}>
			 Under construction 
			</div>
		);
	}

  }
}