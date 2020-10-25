import React from 'react';
import logo from './logo.svg';
import loader from './loader.gif';
import './bootstrap.min.css'
import './weather.css';
import './weather0.css';
//import './App.css';
import Button from '@material-ui/core/Button';
import { Card } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { height } from '@material-ui/system';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import kansas from './Kansas.svg';
import * as ButtonStrap from 'react-bootstrap/Button';
import * as CardGroupStrap from 'react-bootstrap/CardGroup';
import * as CardStrap from 'react-bootstrap/Card';
import * as RowStrap from 'react-bootstrap/Row';
import * as ColStrap from 'react-bootstrap/Col';
import { thisExpression } from '@babel/types';
import CurrentWeather from './CurrentWeather';
import KansasMap from './KansasMap2';
import GraphController from './GraphController_obs'
import DataController from './DataController'
import SatelliteController from './SatelliteController'
import SelectedDistrictCard from './SelectedDistrictCard';
import DataCache from './Helpers/DataCache';
//import CanvasJSReact from './canvasjs.react';


// so default is this style: "rgba(79, 038, 130, 0.90)"
	var btnStyle = {
		backgroundColor: 'gray'
	}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedDistrict: null,
	  selectedDataType: true,
	  b1bgColor: "rgba(79, 038, 130, 0.90)",
	  b2bgColor: "rgba(79, 038, 130, 0.50)",
	  b3bgColor: "rgba(79, 038, 130, 0.50)",
    b4bgColor: "rgba(79, 038, 130, 0.50)"
    }
    this.selectDistrict = this.selectDistrict.bind(this);
	this.selectButton1 = this.selectButton1.bind(this);
	this.selectButton2 = this.selectButton2.bind(this);
	this.selectButton3 = this.selectButton3.bind(this);
    this.selectButton4 = this.selectButton4.bind(this);
    this.dataCache = DataCache;
    
  }

  selectDistrict(district) {
    this.setState({selectedDistrict: district});
  }
  
  selectButton1() {
    this.setState({selectedDataType: 1});
	this.setState({b1bgColor: "rgba(79, 038, 130, 0.90)"});
	this.setState({b2bgColor: "rgba(79, 038, 130, 0.50)"});
	this.setState({b3bgColor: "rgba(79, 038, 130, 0.50)"});
  }
  
  selectButton2() {
    this.setState({selectedDataType: 2});
	this.setState({b2bgColor: "rgba(79, 038, 130, 0.90)"});
	this.setState({b1bgColor: "rgba(79, 038, 130, 0.50)"});
	this.setState({b3bgColor: "rgba(79, 038, 130, 0.50)"});

  }
  
  selectButton3() {
    this.setState({selectedDataType: 3});
	this.setState({b3bgColor: "rgba(79, 038, 130, 0.90)"});
	this.setState({b1bgColor: "rgba(79, 038, 130, 0.50)"});
	this.setState({b2bgColor: "rgba(79, 038, 130, 0.50)"});

  }
  
  selectButton4() {
    this.setState({selectedDataType: 4});
	this.setState({b4bgColor: "rgba(79, 038, 130, 0.90)"});
	this.setState({b1bgColor: "rgba(79, 038, 130, 0.50)"});
	this.setState({b2bgColor: "rgba(79, 038, 130, 0.50)"});
  this.setState({b3bgColor: "rgba(79, 038, 130, 0.50)"});

  }
  

  render(){
    return(
      <div className="App">
     <Banner>

      </Banner>
      <getLocation></getLocation>
      <Container>
    <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
			  <Card>
				<CardContent>
				<Grid container spacing={0}>
				  <Grid xs={12} md={7}>
				  <KansasMap selectedDistrict={this.state.selectedDistrict} onSelect={this.selectDistrict}/>
				 </Grid>
		  <Grid xs={12} md={5}>
			<SelectedDistrictCard dataCache={this.dataCache} selectedDistrict={this.state.selectedDistrict} ></SelectedDistrictCard>
		  </Grid>
     </Grid>
            </CardContent>
          </Card>
      </Grid>
	  <Grid item xs={12} md={12}  alignItems= 'center'>
        <Card>
		 <CardContent style={{display: "flex",justifyContent: "center",alignItems: "center"}} >
		   
		   <button style={{padding: " 15px 20px",background:this.state.b1bgColor,color: "white",fontSize:35,margin: "20px",borderRadius: "16px"}} onClick={this.selectButton1} > 
                Observations 
            </button> 
			
			<button style={{padding: " 15px 20px",background:this.state.b2bgColor,color: "white",fontSize:35,margin: "20px",borderRadius: "16px"}} onClick={this.selectButton2}  > 
                Satellite 
            </button> 
			
			<button style={{padding: " 15px 20px",background:this.state.b3bgColor,color: "white",fontSize:35,margin: "20px",borderRadius: "16px"}} onClick={this.selectButton3}  > 
                Climate change 
            </button> 
      <button style={{padding: " 15px 20px",background:this.state.b4bgColor,color: "white",fontSize:35,margin: "20px",borderRadius: "16px"}} onClick={this.selectButton4}  > 
                Forecasting 
            </button> 
		  
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>	
          <CardContent>
            <DataController selectedDistrict={this.state.selectedDistrict} selectedDataType = {this.state.selectedDataType}></DataController>
          </CardContent>
        </Card>
      </Grid>
     
    </Grid>
    </Container>
   </div>
    );
  }
}

/**
 * This function adds the k-state banner to the page.
 */
function Banner()
{
  return (
  <div name="banner" style={{backgroundColor: "#512888", height: 83, marginBottom:10 }}>
    <div id="watermark-seal" style={{background: "url(https://www.k-state.edu/ksu-resources/branding/4/images/header-masthead-seal.png) 221px no-repeat", height:83}}>
      <a href="https://k-state.edu" >
    <svg style={{height: 70, marginLeft:10, marginTop: 5 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 446.41 104.29" fill="#fff">
      <path d="M0 64.55h443.6v2.51H0zM304.19 30.59A22.17 22.17 0 0 0 298.5 25a41.08 41.08 0 0 0-7.18-3.92C288.83 20 286.5 19 284.39 18a22 22 0 0 1-5.12-3.26 
      4.66 4.66 0 0 1-1.76-3.74 5.08 5.08 0 0 1 1.91-4.38 8.3 8.3 0 0 1 5.07-1.54 13.3 13.3 0 0 1 4.92 1A17.62 17.62 0 0 1 294 8.71a19.8 19.8 0 0 1 3.7 4 15.27 
      5.27 0 0 1 2.3 4.82l.24.87h3.69l-.33-16.14h-3.9a14.41 14.41 0 0 1-2.91-.26c-1.09-.23-2.27-.49-3.51-.79s-2.64-.62-4.08-.86a29.36 29.36 0 0 0-4.56-.35C278.58 0 274 1.16 270.9 
      3.44s-4.77 6.13-4.77 11.23a12 12 0 0 0 2.43 7.58 22.27 22.27 0 0 0 5.77 5.1 50.93 50.93 0 0 0 7.26 3.7c2.5 1 4.86 2.13 7 3.24a22.8 22.8 0 0 1 5.2 3.58 5.67 5.67 0 0 1 1.83 4.32 6.62 6.62 
      0 0 1-.66 3.18 4.75 4.75 0 0 1-1.83 1.89 9.7 9.7 0 0 1-3.12 1.1 24.57 24.57 0 0 1-4.31.35 13.27 13.27 0 0 1-5.34-1.18 21 21 0 0 1-5.18-3.25 24.09 24.09 0 0 1-4.18-4.64 18.13 18.13 0 0 1-2.55-5.17l-.25-.84h-4l3.55 
      20.13 1.42-.72a3.4 3.4 0 0 1 .63-.22l1.07-.3c.36-.1.7-.18 1-.25a2.35 2.35 0 0 1 .53-.09 20.4 20.4 0 0 1 3.56.32c1.25.23 2.48.48 3.68.75s2.56.54 3.78.76a22.4 22.4 0 0 0 4 .36 26.48 26.48 0 0 0 7.74-1.07 18.23 18.23 
      0 0 0 6-3.07 13.85 13.85 0 0 0 3.95-4.89 14.47 14.47 0 0 0 1.4-6.39 14.38 14.38 0 0 0-2.32-8.36zM47.91 43.24c-.42-.56-.85-1.14-1.28-1.76l-4.16-6-10.36-14.82 1.2-1c1.3-1.1 2.52-2.23 3.7-3.32s2.2-2 3.16-2.83l.36-.31a55.3 55.3 
      0 0 1 5.76-4.31l.43-.28a19 19 0 0 1 4.63-2.5 2.64 2.64 0 0 1 .46-.11h.14l.19-.06a10.07 10.07 0 0 1 1.7-.23V1h-23.3v4.66h.32a7 7 0 0 1 1.23.22h.14l.3.09.29.08h.23l.39.16h.08a3.7 3.7 0 0 1 .55.31h.07c.13.12.55.46 0 1.65a6.19 6.19 
      0 0 1-.77 1.33c-.41.56-.92 1.2-1.51 1.9a45.73 45.73 0 0 1-3.58 3.84l-.4.37-1.15 1.1c-1.49 1.39-2.83 2.61-4.09 3.75s-2.2 2-3.16 2.79l-.18.16V11.87a7.3 7.3 0 0 1 1.5-5c1.46-1.65 3.85-1.8 5-1.8h.71V1H0v4.23h1.38A5.52 5.52 0 0 1 5.54 7.1c.08.09.15.19.22.28v.06l.24.29a5.47 
      5.47 0 0 1 .9 2.62 3.49 3.49 0 0 1 0 .44V35c0 2.09.13 8.06-.06 10 0 .16 0 .29-.06.38a4.52 4.52 0 0 1-.22.74 4.54 4.54 0 0 1-2.22 2.46 4 4 0 0 1-.78.25 8.16 8.16 0 0 1-1.56.24H0v4.1h26.41v-4.04l-.66-.06h-.44a13.34 13.34 0 0 1-1.58-.17 6.31 6.31 0 0 1-2.58-.9 3.09 3.09 
      0 0 1-.79-.65 3 3 0 0 1-.25-.34q-.08-.13-.15-.3a3.83 3.83 0 0 1-.32-1.07c-.08-.48-.13-1-.17-1.59-.08-1.26 0-2.39 0-2.39V30.79h.09L23.07 28c1.44 1.91 3.22 4.41 5 6.93l1.63 2.35c1.08 1.58 2.08 3.07 3 4.43s1.48 2.33 2 3.28c.47.77 1.4 2.08.63 3S31 49.32 30.2 49.32v3.9h26.24V49.8c-4.22-.55-6.32-3.49-8.53-6.56zM98 49.34a6.06 6.06 
      0 0 1-2.65-.63A3 3 0 0 1 93.78 47L81.94 14.83 73 17.47l1.28 3.39-9.64 22.47a25.33 25.33 0 0 1-1.4 3.12v.1a8.91 8.91 0 0 1-.48.8 4.3 4.3 0 0 1-.71.94 2.57 2.57 0 0 1-.63.51l-.11.06a4.2 4.2 0 0 1-1.37.53 2.6 2.6 0 0 1-.59.08h-.5v3.74h13.64v-3.69a7 7 
      0 0 1-3.09-1c-1.09-.68-.34-2.36-.22-2.61v-.11l1.89-5.13h10.4l1.28 3.63v.12c.07.17.33.81.56 1.52l.09.31v.05c0 .05.09.29.12.44a4.08 4.08 0 0 1 .15.9.9.9 0 0 1-.08.4.6.6 0 0 1-.14.21 2.58 2.58 0 0 1-1.21.75l-.3.09a10.92 10.92 0 0 1-2.64.3v3.81h18.99v-3.86zM72.79 36.15l3.62-9.83 3.48 
      9.83zM213.48 49.34a6.06 6.06 0 0 1-2.65-.63 3 3 0 0 1-1.56-1.71l-11.84-32.17-8.94 2.64 1.27 3.39-9.63 22.47a27.21 27.21 0 0 1-1.4 3.12.47.47 0 0 1 0 .1 7 7 0 0 1-.47.8 4.3 4.3 0 0 1-.71.94 2.57 2.57 0 0 1-.63.51l-.11.06a4.39 4.39 0 0 1-1.37.53 2.61 2.61 0 0 1-.6.08h-.49v3.74H188v-3.69a7 7 
      0 0 1-3.09-1c-1.09-.68-.34-2.36-.22-2.61v-.11l1.89-5.13H197l1.28 3.63.05.12c.07.17.33.81.56 1.52l.09.31v.05l.12.44a4.08 4.08 0 0 1 .15.9.9.9 0 0 1-.08.4.6.6 0 0 1-.14.21 2.57 2.57 0 0 1-1.22.75l-.29.09a11 11 0 0 1-2.65.3v3.81h18.89v-3.86zm-25.2-13.19l3.62-9.83 3.48 9.83zM127.5 16.2v3.65c1.16.17 3.37.47 4.09 1.27s1 
      2 1.35 5.8c.15 1.76.24 4 .3 6.06v.4c.05 1.81.08 3.57.08 5.25v.58c-2.53-3.15-7.17-8.71-11.34-13.72-3.21-3.84-6-7.16-7.31-8.81l-.4-.5h-13.45v3.57a14.33 14.33 0 0 1 6.24 2.92v7.47c0 2.77-.08 7.85-.11 10.78v2.88a15 15 0 0 1-.18 2.33l-.09.38v.1a2.93 2.93 0 0 1-1 1.57c-1.33 1.07-3.46 1.12-4.82 1.33v3.69h16.74v-3.66l-1-.15h-.12c-.37-.06-.65-.12-.89-.18a8.31 
      8.31 0 0 1-1.58-.51c-1.08-.49-1.86-.74-2.11-2.93v-.7-.37-.14V44.08a2.81 2.81 0 0 1 0-.29v-.2-.51-.54V42v-1.35-13.13l.11.14c4.14 4.91 10.4 13 10.4 13l10.3 12.88.21.26h5V28.56v-2.43c0-.41 0-.8.06-1.15v-.08a.15.15 0 0 1 0-.07v-.07c0-.28 0-.54.07-.79a5.88 5.88 0 0 1 .13-.89c0-.13 0-.27.07-.4a3.37 3.37 0 0 1 .12-.48v-.05a3.05 3.05 0 0 1 2.11-1.93h.53-.01.22c.61-.05 
      1.3-.07 1.51-.08v-3.96zM172.62 36.71a15.8 15.8 0 0 0-4.08-4 29.77 29.77 0 0 0-5.09-2.78c-1.72-.73-3.34-1.45-4.81-2.16a15.26 15.26 0 0 1-3.46-2.19 2.84 2.84 0 0 1-1.06-2.24 3 3 0 0 1 1.14-2.67 5.31 5.31 0 0 1 3.25-1 8.67 8.67 0 0 1 3.25.64 12 12 0 0 1 3.06 1.8 13.24 13.24 0 0 1 2.49 2.68 10.32 10.32 0 0 1 1.52 3.21l.26.95h3.42l-.24-12.18h-3.2a9.49 9.49 
      0 0 1-1.89-.21c-.76-.15-1.58-.34-2.43-.54s-1.88-.41-2.88-.57a20.28 20.28 0 0 0-3.25-.25c-4.33 0-7.65.83-9.86 2.48s-3.51 4.5-3.51 8.2a8.76 8.76 0 0 0 1.8 5.58 15.62 15.62 0 0 0 4.14 3.66 34.62 34.62 0 0 0 5.12 2.61c1.73.72 3.36 1.48 4.84 2.25a15.39 15.39 0 0 1 3.52 2.41 3.48 3.48 0 0 1 1.12 2.67 4.16 4.16 0 0 1-.4 2 2.78 2.78 0 0 1-1.1 1.13 6.15 6.15 0 0 1-2 .71 16.11 16.11 
      0 0 1-2.92.24 8.89 8.89 0 0 1-3.53-.78 14.09 14.09 0 0 1-3.49-2.19 16.72 16.72 0 0 1-2.87-3.17 12.46 12.46 0 0 1-1.72-3.47l-.27-.91h-3.69l2.69 15.2 1.57-.79a1.12 1.12 0 0 1 .35-.12l.74-.21.69-.17a1.23 1.23 0 0 1 .26 0 12.91 12.91 0 0 1 2.4.22c.86.15 1.72.32 2.55.51s1.76.38 2.66.54a16.06 16.06 0 0 0 2.85.25 18.91 18.91 0 0 0 5.53-.76 13.37 13.37 0 0 0 4.36-2.29 10.27 10.27 
      0 0 0 2.88-3.57 10.54 10.54 0 0 0 1-4.66 10.43 10.43 0 0 0-1.71-6.06zM243.48 36.71a15.84 15.84 0 0 0-4.09-4 29 29 0 0 0-5.08-2.78c-1.72-.73-3.34-1.45-4.81-2.16a14.82 14.82 0 0 1-3.5-2.22 2.81 2.81 0 0 1-1-2.24 3.05 3.05 0 0 1 1.13-2.67 5.34 5.34 0 0 1 3.26-1 8.71 8.71 0 0 1 3.25.64 11.9 11.9 0 0 1 3 1.8 13 13 0 0 1 2.49 2.68 10.32 10.32 0 0 1 1.55 3.24l.26.95h3.43l-.25-12.18h-3.19a9.51 9.51 
      0 0 1-1.9-.21c-.76-.15-1.58-.34-2.43-.54s-1.87-.41-2.88-.57a20.28 20.28 0 0 0-3.25-.25c-4.33 0-7.64.83-9.86 2.48s-3.51 4.5-3.51 8.2a8.82 8.82 0 0 0 1.8 5.58 16 16 0 0 0 4.1 3.66 35.12 35.12 0 0 0 5.12 2.61c1.73.72 3.36 1.47 4.85 2.25a15.54 15.54 0 0 1 3.51 2.41 3.45 3.45 0 0 1 1.12 2.67 4.29 4.29 0 0 1-.39 2 2.85 2.85 0 0 1-1.1 1.13 6.13 6.13 0 0 1-2 .71 16.07 16.07 0 0 1-2.91.24 8.9 8.9 
      0 0 1-3.54-.78 14.39 14.39 0 0 1-3.49-2.19 16.72 16.72 0 0 1-2.84-3.17 12.16 12.16 0 0 1-1.71-3.47l-.27-.91h-3.7l2.69 15.2 1.58-.79a1 1 0 0 1 .34-.12l.74-.21.7-.17a1.23 1.23 0 0 1 .26 0 13 13 0 0 1 2.4.22c.86.15 1.72.33 2.55.51s1.75.38 2.65.54a16.23 16.23 0 0 0 2.85.25 18.86 18.86 0 0 0 5.53-.76A13.18 13.18 0 0 0 241.3 51a10.27 10.27 0 0 0 2.88-3.57 10.54 10.54 0 0 0 1-4.66 10.5 10.5 
      0 0 0-1.7-6.06zM408.86 15.92H376l-.66 13.57h3.81l.2-1a14.38 14.38 0 0 1 1.41-4.26 5.88 5.88 0 0 1 2-2.15 6.88 6.88 0 0 1 2.75-1 17.32 17.32 0 0 1 2.35-.23v23.8a20.2 20.2 0 0 1-.15 2.74 2.26 2.26 0 0 1-.44 1.16 2.19 2.19 0 0 1-1.09.59 16.73 16.73 0 0 1-2.92.43l-1.29.1v3.53h21.17v-3.54l-1.29-.1a16.44 16.44 0 0 1-2.91-.43 2.26 2.26 0 0 1-1.1-.58 2.33 2.33 0 0 1-.44-1.17 22 22 0 0 1-.14-2.74v-23.8a17.65 17.65 
      0 0 1 2.35.23 6.93 6.93 0 0 1 2.75 1 6 6 0 0 1 2 2.15 14.4 14.4 0 0 1 1.4 4.26l.21 1h3.6zM378.58 49.35a6.06 6.06 0 0 1-2.65-.63 3 3 0 0 1-1.55-1.72l-11.85-32.16-8.93 2.64 1.27 3.39-9.64 22.47a25.33 25.33 0 0 1-1.4 3.12v.1c-.15.28-.31.55-.47.79a4.19 4.19 0 0 1-.72.94 2.41 2.41 0 0 1-.63.52l-.11.06a4.2 4.2 0 0 1-1.37.53 2.6 2.6 0 0 1-.59.08h-.5v3.74h13.68v-3.69a6.9 6.9 0 0 1-3.08-1c-1.1-.69-.35-2.36-.23-2.61l.05-.11 1.88-5.13h10.4l1.29 3.63v.12c.07.17.33.81.56 1.53a2.47 2.47 0 0 0 .1.29v.06c0 .06.09.29.12.44a3.46 3.46 0 0 1 .15.9.92.92 0 0 1-.08.4.7.7 0 0 1-.14.21 2.58 2.58 0 0 1-1.21.75l-.3.09a10.92 10.92 0 0 1-2.64.3v3.76h18.88v-3.81zm-25.19-13.19l3.61-9.83 3.48 9.83zM341.72 15.92h-32.83l-.66 13.57H312l.2-1a14.38 14.38 0 0 1 1.41-4.26 5.79 5.79 0 0 1 2-2.15 6.88 6.88 0 0 1 2.75-1 17.32 17.32 0 0 1 2.35-.23v23.8a20 20 0 0 1-.15 2.74 2.26 2.26 0 0 1-.44 1.16 2.19 2.19 0 0 1-1.09.59 16.73 16.73 0 0 1-2.92.43l-1.29.1v3.53H336v-3.54l-1.29-.1a16.73 16.73 0 0 1-2.92-.43 2.19 2.19 0 0 1-1.09-.59 2.26 2.26 0 0 1-.44-1.16 20.25 20.25 0 0 1-.14-2.74v-23.8a17.16 17.16 0 0 1 2.34.23 6.92 6.92 0 0 1 2.76 1 6 6 0 0 1 2 2.15 14.7 14.7 0 0 1 1.4 4.26l.21 1h3.59zM443.34 39.54v.05c-.57 1.55-2.28 5.29-4.64 6.65-2.81 1.62-6.16 2.95-12.81 2.15V36.28h1.07a6.73 6.73 0 0 1 6.68 5.89H437V26.6h-3.44a6.72 6.72 0 0 1-5.34 5.4 4.61 4.61 0 0 1-.69.12H425.87V20.5h3.92c1 0 4.59-.1 7 1.52 2.75 1.87 3.58 5.26 3.84 6.7l3.48-.63-.51-12.17h-32.8v4l1.2.08a8.27 8.27 0 0 1 2.46.36 2.5 2.5 0 0 1 1.09.72 2.78 2.78 0 0 1 .5 1.26 14.83 14.83 0 0 1 .16 2.36v20a15.62 15.62 0 0 1-.16 2.47 2.49 2.49 0 0 1-.49 1.21 2.12 2.12 0 0 1-1.05.64 10.46 10.46 0 0 1-2.55.39l-1.21.07v3.79h32.8l2.82-11.54zM21.16 98.05c-2.09 5.85-8.68 6.24-10.1 6.24-1.1 0-5.28-.18-8.12-3C.53 98.87.46 95.78.46 92.66v-14h6.31v15.63c0 2.24.18 3.09 1.17 3.87a5.6 5.6 0 0 0 3.33 1 4.35 4.35 0 0 0 3.09-.93c1.17-1 1.2-2.51 1.2-3.93V78.7h6.28v14a16.23 16.23 0 0 1-.68 5.35zM67.07 103.72L58 88.23l.22 15.49h-6v-25h6.13l9.15 15.7-.25-15.7h6v25zM103.72 103.72v-25H110v25zM153.07 103.72h-6.38l-8.58-25h6.66L150 96.49l5.14-17.79h6.66zM189.9 103.72v-25h18.5v4.82h-12.26v4.57h11.45v4.75h-11.45v6h13.4v4.92zM253.67 103.72l-5-8.93h-3.89v8.93h-6.31v-25h13.39c1.14.07 5.11.32 7.06 3.9a9.06 9.06 0 0 1 1 4.18 6.6 6.6 0 0 1-3.12 6 15.37 15.37 0 0 1-2 .89l5.78 10zm-3.61-20.38h-5.32v6.81h5.17a5.09 5.09 0 0 0 1.67-.25 3.14 3.14 0 0 0 2.09-3.23c0-3.26-2.51-3.33-3.61-3.33zM309 99.5c-2.16 3.94-6.67 4.47-7.87 4.61a19 19 0 0 1-2.52.18 14.2 14.2 0 0 1-9.43-3 14.91 14.91 0 0 1-2-2.09l4.75-3a9.69 9.69 0 0 0 1.1 1.06 10.07 10.07 0 0 0 6.13 2.09 7.16 7.16 0 0 0 1.95-.24c.18 0 2.66-.75 2.66-2.66 0-2.31-3.33-2.38-5.57-2.7a31.29 31.29 0 0 1-3.54-.63A8.55 8.55 0 0 1 290 90.5a5.79 5.79 0 0 1-1.06-1.84 7.68 7.68 0 0 1-.32-2.2 16.25 16.25 0 0 1 .14-1.74 6.91 6.91 0 0 1 2.17-4c1.24-1.17 3.68-2.63 7.79-2.63a14.5 14.5 0 0 1 8.28 2.49 23.68 23.68 0 0 1 2.77 2.23l-4.61 3.29a9.58 9.58 0 0 0-4.22-2.72 9.78 9.78 0 0 0-2.34-.36c-2.55 0-3.72 1.49-3.72 2.66a1.87 1.87 0 0 0 .53 1.31c.85.92 2.23.89 4.57 1.24 1.42.22 2.8.5 4.19.82.88.18 4.11.81 5.38 3.86a7.43 7.43 0 0 1 .5 2.7A8 8 0 0 1 309 99.5zM339.35 103.72v-25h6.24v25zM386.86 83.63v20.09h-6.31V83.63H374V78.7h19.32v4.93zM435 91.88v11.84h-6.17V92.06l-9.36-13.36h7.16l5.37 8.47 5.35-8.47h7.12z"/>
      </svg>
    </a>
    </div>
  </div>
  );

}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
         alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    alert("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
}



export default App;
