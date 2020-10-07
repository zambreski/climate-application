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


const PurpleSwitch = withStyles({
  switchBase: {
    color: purple[300],
    '&$checked': {
      color: purple[500],
    },
    '&$checked + $track': {
      backgroundColor: purple[500],
    },
  },
  
  checked: {},
  track: {},
})(Switch);



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));



// Initalize bottom line plot

export default class ButtonController extends Component {
  
  constructor(props) {
    super(props);
 
    this.state = {
      selectedDataType: false,
     
    }
    this.handleChangeGraphType = this.handleChangeGraphType.bind(this);
    
  }
  

  /***
  * This method handles the change in the graph type (average temperature and precipitation).
  */
  handleChangeGraphType(item) {
    console.log(item.target.checked);
    this.setState({ selectedDataType: item.target.checked });
  }
  

  render() {
	  
	var button = document.createElement("button");
	button.innerHTML = "Do Something";
	document.body.appendChild(button); 
	  
    console.log("type: " + this.state.selectedDataType)
	
    return (
      <div className="Graph">
        <form autoComplete="off">
          {/* This renders the form for input control for the graphs */}
          <FormGroup>

            <Typography component="div">
              <Grid component="label" container alignItems="center"  justify="center" spacing={1} >
                <Grid item >Observations</Grid>
                <Grid item>
                  <PurpleSwitch
                    checked={this.state.selectedDataType}
                    onChange={this.handleChangeGraphType}
                    value={this.state.selectedDataType}
                  />
                </Grid>
                <Grid item>Satellite</Grid>
              </Grid>
            </Typography>
          </FormGroup>

        </form>
      </div>
    );

  }
}