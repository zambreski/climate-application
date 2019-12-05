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

  export {getDayIndicator} getDayIndicator