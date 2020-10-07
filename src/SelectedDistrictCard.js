import React, {Component} from 'react';
import './weather.css';
import './weather0.css';
import { Container } from '@material-ui/core';
import * as ButtonStrap from 'react-bootstrap/Button';
import * as CardGroupStrap from 'react-bootstrap/CardGroup';
import * as CardStrap from 'react-bootstrap/Card';
import * as RowStrap from 'react-bootstrap/Row';
import * as ColStrap from 'react-bootstrap/Col';
import {getDistrictName} from './Districts';
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import loader from './loader.gif';
import windsvg from './wind.svg';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}


/****
 * This class controls the SelectCardDistrict.
 * Reponsible for rendering the current weather data
 * as well any relivant information such humidity and windspeed.
 */
export default class SelectedDistrictCard extends Component{
  constructor(props) {
    super(props);
    this.date = new Date();
    this.year = this.date.getFullYear();

    var month = (this.date.getMonth()+1);    
    this.month = month < 10 ? "0" + month : month;

    var day = this.date.getDate();
    this.day = day < 10 ? "0" + day : day;

    var hours = this.date.getHours();
    this.hours = hours < 10 ? "0" + hours : hours;

    var minutes = this.date.getMinutes();
    this.minutes = minutes < 10 ? "0" + minutes : minutes;

    var seconds = this.date.getSeconds();
    this.seconds = seconds < 10 ? "0" + seconds : seconds;
    
    this.dateString =  this.year.toString()+this.month.toString()+this.day.toString() +this.hours.toString() +this.minutes.toString() +this.seconds.toString();
    
    // Get previous two hours of time
    var prevD = new Date();
    prevD.setHours(prevD.getHours() - 2)
    this.datePrev  = new Date(prevD.getTime() - (prevD.getTimezoneOffset() * 60000)).toISOString().slice(-24).replace(/\D/g,'').slice(0, 14);
    
    
    /*
     Get previous
    */

    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  /*****
   *  This function pulls data from the selected district, it will however do nothing if nothing is selected.
   * 
   */
  componentDidMount() {
   /* console.log("Test");
    if(this.props.selectedDistrict)
    {
      console.log("Test");
      // if there's a selected district than run it.
     
      var station = getDistrictName(this.props.selectedDistrict);
      var queryData = "http://mesonet.k-state.edu/rest/stationdata/?stn="+station+"&int=5min&t_start="+this.dateString+"000000&t_end="+this.dateString+"235959&vars=TEMP2MAVG,WSPD10MAVG,RELHUM10MAVG,PRECIP"
      console.log(queryData);
      fetch(queryData)
      .then(res => res.text())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }*/
     
  }

  /****
   * This method is responsible for unparsing the API call to get the current weather
   * information. Accepts variable of s of type string. Unparses the string by splitting and gets the 
   * last line of the string. The line is further split to their respective values and is formated.
   * It returns a dictionary of the information.
   * <parameter> s of type string </parameter>
   * <returns> A dictionary of values </returns>
   */
  getCurrentData(s)
  {

    var strArr = s.split('\n');
    var tempLine = strArr[strArr.length-1];
    

    var tempArr = tempLine.split(',');
    var timeStamp = tempArr[0];
    //console.log("The time is: "+timeStamp)
    var timeArr = timeStamp.split(' ');
    var time = timeArr[1];
    var tempCels = parseFloat(tempArr[2]);
    var humidityTemp = parseFloat(tempArr[3]);
    //console.log('humidity',tempArr[3]);
    var windTemp = parseFloat(tempArr[5]);
    //console.log('wind', windTemp);
    var wind;
    // if windTemp is not a number...
    if(isNaN(windTemp)) {
      //console.log("Wind is NOT A NUMBER")
      wind = "Not Available"; 
    } else {
      wind = (windTemp/0.44704).toFixed(2);
    }
    //console.log('wind', wind);
	// mm to inches
    var precipTem = parseFloat(tempArr[4]).toFixed(2)/25.4;
    // if precipitation is not a number...
    if(isNaN(precipTem)) {
      switch(tempArr[4]) {
        case 'T': 
          precipTem = 0;
          break;
        case 'M':
        default:
          precipTem = "Not Available"; 
      }
    }


    return {"timestamp":time,"temp": Math.trunc(tempCels * (9/5) + 32), "wind": wind, "humidity": humidityTemp.toFixed(0), "precip":precipTem}

  }

  /****
   * This method returns the time of day based on the current time. It returns a string of that value.
   * <parameter> int </parameter>
   * <returns> string </returns>
   */
  getDayIndicator(hour)
  {
    if(hour >= 0 && hour <= 5)
    {
      return "Early Morning";
    }
    else if(hour >= 6 && hour <= 11)
    {
      return "Morning";
    }else if(hour >= 12 && hour <= 17)
    {
      return "Afternoon";
    }else if(hour >= 18 && hour <= 23)
    {
      return "Night";
    }
  }

  /****
   * This method returns the time formatted in a HH:MM AM/PM. 
   * Accepts parameters both an 'h' for hour and 'm' for minute,
   * returns a string formatted as described above.
   * <parameter> h: int </parameter>
   * <parameter> m:  int </parameter>
   * <returns> string </returns>
   */
  get12HourTimes(h,m)
  {
    var hours = h > 12 ? h - 12 : h;
    var am_pm = h >= 12 ? "PM" : "AM";
    //hours = hours < 10 ? "0" + hours : hours;
    var minutes = m < 10 ? "0" + m : m;
    return hours + ":" + minutes +" "+am_pm;
  }


  /*****
  * This method intiates a AJAX call to retrieve from the Mesonet API.
  * The data it gets is updated in the state.
  * */
  restGetCall()
  {
    this.state.isLoaded = false;
    this.items = [];
    console.log(this.dateString)
    var station = getDistrictName(this.props.selectedDistrict);
    var queryData = "http://mesonet.k-state.edu/rest/stationdata/?stn="+station+"&int=5min&t_start="+this.datePrev+"&t_end="+this.dateString+"&vars=TEMP2MAVG,WSPD10MAVG,RELHUM10MAVG,PRECIP"
      
      console.log(queryData);
      fetch(queryData) //AJAX Rest call.
      .then(res => res.text())
      .then(
        (result) => {

          var data = this.getCurrentData(result)

          if(Number.isNaN(data["temp"]))
          {
            // If data is NaN then recursively call it.
            this.restGetCall() 
			console.log("failed")

          }else{

            // Update the state of the data.
            this.setState({
              isLoaded: true,
              items: result
            });
          }

         
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )

  }

  /***
   * This method is just a helper method to get the current temp.
   * <Returns> A string of current temp.</Returns>
   */
  getCurrentTemp()
  {
    var temp = this.items[this.items.length-1];
    return temp["temp"];
    
  }


  render()
  {
      // Get the current times.
      var hour = this.date.getHours();
      var minutes = this.date.getMinutes();
      var descriptionOfDay = this.getDayIndicator(hour,minutes);
      var twelveHourTime = this.get12HourTimes(hour, minutes);

      if(!this.props.selectedDistrict)
      {
          // Default state of a not selected district
          return (<MySnackbarContentWrapper
              variant="warning"
              message="No district selected. Please select one from the map."
          />);
      }


      const { error, isLoaded, items } = this.state;
      var selectDNum = this.props.selectedDistrict;

      console.log(isLoaded)
		
	  if(!isLoaded)
	  {
		  console.log('CALLING')
		  this.restGetCall();
			// Get Rest call
	  }
	  
	  console.log(isLoaded)

      if (error)
      {
        
        // Handles errors if errors out.

        return (<MySnackbarContentWrapper
                variant="error"
                message={error.message+". There was a problem with getting the data, please try again later."}/>
              );

      } else if (!isLoaded) 
      {

        // Displays loading animation if still processing data.

        return <div><MySnackbarContentWrapper
        variant="info"
        message={"Getting the latest data for "+getDistrictName(selectDNum)}/><br/><img src={loader} class="img-fluid" /></div>;
        
      } else {

        // Displays weather card information (Successful load).
       
        var data = this.getCurrentData(items);  
        
        return(
            <Card style={{backgroundColor: '#87ceeb'}}>
              <Card.Body>
                <div class="info">
                    <div class="city"><span> station:</span> {getDistrictName(selectDNum)}</div>
                    <div class="night">{descriptionOfDay} - {twelveHourTime}  </div>
                    <div class="info2"><p style={{fontSize:"9px"}}>Last Updated: {data["timestamp"]} </p></div>
                    <div class="temp">{data["temp"]}° F</div>
                    

                    <div class="wind">
                      <image style={{height:"25px", width:"25px"}} src={windsvg} />&nbsp;
                        <span>{data["wind"]} mph</span>
                      
                    </div>
                    <div class="humidity">
                    <span>Humidity: {data["humidity"]} %</span>
                    </div>
                    <div class="precipitation">
                    <span>Precipitation: {data["precip"]} in</span>
                    </div>
                </div>
              </Card.Body>
            </Card>);
      }
    }
}
