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
import GraphRender from './GraphRender'



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

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));












export default class GraphController extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();


    today = mm + '/' + dd + '/' + yyyy;
    var tdate = yyyy + "-" + mm + "-" + dd;

    this.state = {
      selectedTypeFrequency: "Weekly",
      selectedGraphType: false,
      selectedStartDate: today,
      selectedEndDate: today,
      sdate: tdate,
      edate: tdate,
      isValidStartDate: true,
      error: null,
      isLoaded: false,
      data: [],
      items: {},
      asicStation: ""
    }


    this.handleChangeFrequency = this.handleChangeFrequency.bind(this);
    this.handleChangeGraphType = this.handleChangeGraphType.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
  }

  /***
  * This method handles the change in the frequency of the UI element of frequency.
  * NOTE: This is not fully implemented.
  */
  handleChangeFrequency(item) {
    console.log(item)
    this.setState({ selectedTypeFrequency: item.target.value });
  }

  /***
  * This method handles the change in the graph type (average temperature and percipitation).
  */
  handleChangeGraphType(item) {
    console.log(item.target.checked);
    this.setState({ selectedGraphType: item.target.checked });
  }

  handleChangeStartDateEvent(item) {
    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var realDate = mm + '-' + dd + '-' + yyyy;


    this.setState({ selectedStartDate: date });
  }

  checkThisStartDate(date) {

    date = new Date(date);
    date.setHours(0, 0, 0, 0);

    var today = new Date();
    today.setHours(0, 0, 0, 0)

    var currentSelected = new Date(this.state);
    currentSelected.setHours(0, 0, 0, 0);

    if (date > today) {
      return false;
    }
    else if (date > currentSelected) {
      return false;
    }

    return true;
  }

  checkThisEndDate(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);

    var today = new Date();
    today.setHours(0, 0, 0, 0)

    var currentStartSelected = new Date(this.state.selectedStartDate);
    currentStartSelected.setHours(0, 0, 0, 0);

    if (date > today) {
      return false;
    } else if (date < currentStartSelected) {
      return false;
    }

    return true;
  }

  handleChangeStartDate(item) {
    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();


    var dateA = mm + '-' + dd + '-' + yyyy;


    var today = new Date();
    today.setHours(0, 0, 0, 0)

    var currentSelected = new Date(this.state.selectedEndDate);
    currentSelected.setHours(0, 0, 0, 0);

    var error = "test";

    if (date > today) {
      this.setState({ isValidStartDate: false });
      alert("The start date exceed today's this is not allowed. =(");
      return;
    }
    else if (date > currentSelected) {
      this.setState({ isValidStartDate: false });
      alert(error);;
      return;
    }

    this.setState({ isValidStartDate: true });
    this.setState({ selectedStartDate: item })//
    this.setState({ sdate: yyyy + "-" + mm + "-" + dd })
  }

  handleChangeEndDate(item) {
    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();


    date = mm + '-' + dd + '-' + yyyy;
    console.log(date)

    this.setState({ selectedEndDate: item })
    this.setState({ edate: yyyy + "-" + mm + "-" + dd })
  }

  render() {

    if (!this.props.selectedDistrict) {
      return "Select a a distict to view its data.";
    }


    var data1 = []

    for (var i = 0; i < this.state.items.length; i++) {
      var obj = this.state.items[i];

      data1.push({ x: new Date(obj[0]), y: obj[1] });
    }

    console.log("type: " + this.state.selectedTypeFrequency)
    return (
      <div className="Graph">


        <form autoComplete="off">
          {/* This renders the form for input control for the graphs */}
          <FormGroup>

            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Temperature</Grid>
                <Grid item>
                  <PurpleSwitch
                    checked={this.state.selectedGraphType}
                    onChange={this.handleChangeGraphType}
                    value={this.state.selectedGraphType}
                  />
                </Grid>
                <Grid item>Precipitation</Grid>
              </Grid>
            </Typography>
          </FormGroup>
          <Grid>
            <FormControl>
              <InputLabel htmlFor="age-customized-select">Frequency</InputLabel>
              <Select
                value={this.state.selectedTypeFrequency}
                onChange={this.handleChangeFrequency}
                input={<BootstrapInput name="age" id="age-customized-select" />}
              >
                <MenuItem value={"Weekly"}>Weekly</MenuItem>
                <MenuItem value={"Monthly"}>Monthly</MenuItem>
                <MenuItem value={"Yearly"}>Yearly</MenuItem>

              </Select>
            </FormControl>


            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM-dd-yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Start Date"
                  value={this.state.selectedStartDate}
                  onChange={this.handleChangeStartDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM-dd-yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="End Date"
                  value={this.state.selectedEndDate}
                  onChange={this.handleChangeEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>

        </form>

        {/* Render graph */}
        <GraphRender selectedDistrict={this.props.selectedDistrict} asicStation={this.props.selectedDistrict} selectedStartDate={this.state.sdate} selectedEndDate={this.state.edate} selectedGraphType={this.state.selectedGraphType}>
        </GraphRender>


      </div>
    );

  }
}