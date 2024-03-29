import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import { Container, Row, Col } from 'reactstrap';
import { purple } from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import PlotControllerCC from './PlotController_cc'
import Dropdown from 'react-bootstrap/Dropdown'

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





// Initalize bottom line plot

export default class CCGraphController extends Component {

  constructor(props) {
    super(props);

    // Today's date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var tdate = yyyy + "-" + mm + "-" + dd;

    console.log(today)

    // Starting date 7-days previous
    var yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 7)
    var dd_7 = String(yesterday.getDate()).padStart(2, '0');
    var mm_7 = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy_7 = yesterday.getFullYear();
    yesterday = mm_7 + '/' + dd_7 + '/' + yyyy_7;
    var starting = yyyy_7 + "-" + mm_7 + "-" + dd_7;


    this.state = {
      selectedTypeFrequency: "Weekly",
      selectedGraphType: false,
      selectedStartDate: "1951",
      selectedEndDate: "2020",
      selectedMonth: "01",
      sdate: "1950",
      edate: "2019",
      isValidStartDate: true,
      error: null,
      isLoaded: false,
      data: [],
      items: {},
      asicStation: "",
      selectedTimeType: 1,
      selectedSeason: 1,
      selectedSeasonName: 'Spring',
      b1bgColor: "rgba(79, 038, 130, 0.90)",
      b2bgColor: "rgba(79, 038, 130, 0.50)",
      b3bgColor: "rgba(79, 038, 130, 0.50)",
      idChange: false
    }

    this.handleChangeFrequency = this.handleChangeFrequency.bind(this);
    this.handleChangeGraphType = this.handleChangeGraphType.bind(this);
    this.handleChangeTimeType = this.handleChangeTimeType.bind(this);
    this.handleChangeTimeType1 = this.handleChangeTimeType1.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.handleChangeMonth = this.handleChangeMonth.bind(this);
    this.selectSeason = this.selectSeason.bind(this);

  }


  selectSeason(item, name) {
    this.setState({ selectedSeason: item });
    this.setState({ selectedSeasonName: name });

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
  * This method handles the change in the graph type (average temperature and precipitation).
  */
  handleChangeGraphType(item) {
    console.log(item.target.checked);
    this.setState({ selectedGraphType: item.target.checked });
  }

  /***
  * This method handles the change in the crop for calculating GDDs
  */
  handleChangeTimeType(item) {
    console.log(item.target.checked);
    this.setState({ selectedTimeType: item.target.checked });
  }

  handleChangeTimeType1(item) {
    this.setState({ selectedTimeType: item });
    console.log(item);
    if (item == 1) {
      this.setState({ b1bgColor: "rgba(79, 038, 130, 0.90)" });
      this.setState({ b2bgColor: "rgba(79, 038, 130, 0.50)" });
      this.setState({ b3bgColor: "rgba(79, 038, 130, 0.50)" });
    }
    else if (item == 2) {
      this.setState({ b1bgColor: "rgba(79, 038, 130, 0.50)" });
      this.setState({ b2bgColor: "rgba(79, 038, 130, 0.90)" });
      this.setState({ b3bgColor: "rgba(79, 038, 130, 0.50)" });
    }
    else if (item == 3) {
      this.setState({ b1bgColor: "rgba(79, 038, 130, 0.50)" });
      this.setState({ b2bgColor: "rgba(79, 038, 130, 0.50)" });
      this.setState({ b3bgColor: "rgba(79, 038, 130, 0.90)" });
    }
  }


  handleChangeStartDateEvent(item) {
    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var realDate = mm + '-' + dd + '-' + yyyy;


    this.setState({ selectedStartDate: yyyy });
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

  handleChangeMonth(item) {

    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    this.setState({ selectedMonth: mm })//

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
    this.setState({ sdate: yyyy })
    this.setState({ idChange: true })
  }


  handleChangeEndDate(item) {
    var date = new Date(item);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    console.log(yyyy)

    date = mm + '-' + dd + '-' + yyyy;
    console.log(date)

    this.setState({ selectedEndDate: item })
    this.setState({ edate: yyyy })
  }



  render() {

    if (!this.props.selectedDistrict) {
      return "Select a district to view observations.";
    }


    var data1 = []

    for (var i = 0; i < this.state.items.length; i++) {
      var obj = this.state.items[i];

      data1.push({ x: new Date(obj[0]), y: obj[1] });
    }

    console.log(data1)



    return (
      <div className="Graph" >

        <Box style={{ "background-color": "rgb(211,211,211,0.5)", "border-width": "2px", "border-style": "solid", "border-color": "gray", padding: "10px 10px", borderRadius: "16px", width: "30%" }}>
          {/* This renders the form for input control for the graphs */}
          <FormGroup>
            <Typography component="div">
              <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: "-7px" }}>Variable</p>
              <Grid component="label" justify='center' container alignItems="center" spacing={1}>
                <Grid item style={{ fontSize: 20 }}>Temperature</Grid>
                <Grid item>
                  <PurpleSwitch
                    checked={this.state.selectedGraphType}
                    onChange={this.handleChangeGraphType}
                    value={this.state.selectedGraphType}
                  />
                </Grid>
                <Grid item style={{ fontSize: 20 }}>Precipitation</Grid>
              </Grid>
            </Typography>
          </FormGroup>

          {/* Time scale form selection*/}
          <br />
          <Grid id="top-row" justify='center' container spacing={0} zeroMinWidth={true} style={{ fontSize: 20, marginBottom: "-20px" }} >

            <Grid item >
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Time scale</p>
            </Grid>
          </Grid>
          <Grid id="bottom-row" justify='center' container spacing={0} zeroMinWidth={true} style={{ fontSize: 20 }}>
            <Grid item >
              <button type="button" style={{ padding: " 10px 10px", background: this.state.b1bgColor, color: "white", fontSize: 16, margin: "10px", borderRadius: "16px" }} onClick={() => this.handleChangeTimeType1(1)}>
                Annual
						</button>
            </Grid>
            <Grid item >
              <button type="button" style={{ padding: " 10px 10px", background: this.state.b2bgColor, color: "white", fontSize: 16, margin: "10px", borderRadius: "16px" }} onClick={() => this.handleChangeTimeType1(2)} >
                Monthly
					</button>
            </Grid>
            <Grid item >
              <button type="button" style={{ padding: " 10px 10px", background: this.state.b3bgColor, color: "white", fontSize: 16, margin: "10px", borderRadius: "16px" }} onClick={() => this.handleChangeTimeType1(3)} >
                Season
					  </button>
            </Grid>
          </Grid>

          <br />

          {/* Monthly form selection*/}
          {this.state.selectedTimeType == 2 &&
            <div>
              <Grid id="top-row" justify='center' container spacing={0} zeroMinWidth={true} style={{ fontSize: 20, marginBottom: "-20px" }} >
                <Grid item xs={2}>
                  <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Month</p>
                </Grid>
              </Grid>
              <Grid id="bottom-row" container spacing={0} zeroMinWidth={true} style={{ fontSize: 20 }}>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      views={["month"]}
                      variant="inline"
                      format="MMM"
                      margin="normal"
                      minDate={new Date("1950-01-02")}
                      maxDate={new Date("2016-01-02")}
                      id="date-picker-inline"
                      label="Month"
                      value={this.state.selectedMonth}
                      onChange={this.handleChangeMonth}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </div>
          }

          {/* Season form selection*/}
          {this.state.selectedTimeType == 3 &&
            <div>
              <Container>
                <Row>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic" style={{ "background-color": "rgba(79, 038, 130, 0.90)" }} >
                        Season
                  </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.selectSeason(1, "Spring")}>Spring</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.selectSeason(2, "Summer")}>Summer</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.selectSeason(3, "Fall")}>Fall</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.selectSeason(4, "Winter")}>Winter</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col>
                    <p style={{ textAlign: 'left', fontSize: 20, marginBottom: "-7px" }}>
                      {this.state.selectedSeasonName}</p>
                  </Col>
                </Row>
              </Container>
            </div>
          }

        </Box>

        <br />

        {/* Year form selection*/}
        <Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                disableToolbar
                views={["year"]}
                variant="inline"
                format="yyyy"
                margin="normal"
                minDate={new Date("1950-01-02")}
                maxDate={new Date("2016-01-02")}
                id="date-picker-inline"
                label="Start year"
                value={this.state.selectedStartDate}
                onChange={this.handleChangeStartDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                views={["year"]}
                format="yyyy"
                margin="normal"
                id="date-picker-inline"
                minDate={new Date("1953-01-02")}
                maxDate={new Date("2020-01-02")}
                label="End year"
                value={this.state.selectedEndDate}
                onChange={this.handleChangeEndDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>

        {/* Decide number of canvases to create*/}
        <PlotControllerCC selectedDistrict={this.props.selectedDistrict} asicStation={this.props.selectedDistrict} selectedStartYear={this.state.sdate} selectedEndYear={this.state.edate} selectedGraphType={this.state.selectedGraphType} selectedTime={this.state.selectedTimeType} selectedMonth={this.state.selectedMonth} selectedSeason={this.state.selectedSeason}>
        </PlotControllerCC>


      </div>
    );

  }
}