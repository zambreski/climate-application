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
//import {get12HourTimes} from './Helpers/helpers'

//import {InfoIcon} from '@material-ui/icons/Info';

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
    
    this.dateString =  this.year.toString()+this.month.toString()+this.day.toString();

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

  getCurrentData(s)
  {

    var strArr = s.split('\n');
    var tempLine = strArr[strArr.length-1];

    var tempArr = tempLine.split(',');
    var tempCels = parseFloat(tempArr[2]);
    var windTemp = parseFloat(tempArr[5]);
    var humidityTemp = parseFloat(tempArr[3]);
    var wind = (windTemp/0.44704);
    var precipTem = parseFloat(tempArr[4]);


    return {"temp": Math.trunc(tempCels * (9/5) + 32), "wind": wind.toFixed(2), "humidity": humidityTemp.toFixed(2), "precip":precipTem.toFixed(2)}

  }

  getDayIndicator(hour, min)
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

  get12HourTimes(h,m)
  {
    var hours = h > 12 ? h - 12 : h;
    var am_pm = h >= 12 ? "PM" : "AM";
    //hours = hours < 10 ? "0" + hours : hours;
    var minutes = m < 10 ? "0" + m : m;
    return hours + ":" + minutes +" "+am_pm;
  }

  componentDidMount()
  {

  }

  componentWillReceiveProps(newProps) {
    this.state.isLoaded = false;
    this.items = [];

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
  }

  getCurrentTemp()
  {
    var temp = this.items[this.items.length-1];
    return temp["temp"];
    //gets current temperature.
  }









    render()
    {
      var hour = this.date.getHours();
      var minutes = this.date.getMinutes();
      var seconds = this.date.getSeconds();
      var time =  hour + ":" + minutes;
      var meridiem = "";
      var descriptionOfDay = this.getDayIndicator(hour,minutes);
      var twelveHourTime = this.get12HourTimes(hour, minutes);

      if(!this.props.selectedDistrict)
      {
          return (<MySnackbarContentWrapper
              variant="warning"
              message="No district selected. Please select one from the map."
          />);
      }

      const { error, isLoaded, items } = this.state;
      var selectDNum = this.props.selectedDistrict;


      if (error) {
        return (<MySnackbarContentWrapper
                variant="error"
                message={error.message+". There was a problem with getting the data, please try again later."}/>
              );

      } else if (!isLoaded) {

        return <div><MySnackbarContentWrapper
        variant="info"
        message={"Getting the latest data for "+getDistrictName(selectDNum)}/><br/><img src={loader} class="img-fluid" /></div>;
        
      } else {

        var data = this.getCurrentData(items);

       
        
        return(
            <Card style={{backgroundColor: '#87ceeb'}}>
              <Card.Body>
                <div class="info">
                    <div class="city"><span> City:</span> {getDistrictName(selectDNum)}</div>
                    <div class="night">{descriptionOfDay} - {twelveHourTime}</div>
                    <div class="temp">{data["temp"]}° F</div>

                    <div class="wind">
                      <image style={{height:"25px", width:"25px"}} src={windsvg} />&nbsp;
                        <span>{data["wind"]} mph</span>
                      
                    </div>
                    <div class="humidity">
                    <span>Humidity: {data["humidity"]}%</span>
                    </div>
                    <div class="precipitation">
                    <span>Precipitation: {data["precip"]} mm</span>
                    </div>
                </div>
              </Card.Body>
            </Card>);
      }
    }


}