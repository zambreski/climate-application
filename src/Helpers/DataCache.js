import React from 'react';

export default class DataCache{
    constructure()
    {
        this.Manhattan = [];
        this.Colby = [];
        this.Olathe = [];
        this.GardenCity = [];
    }

    updateWeatherData()
    {
        fetch("http://mesonet.k-state.edu/rest/stationdata/?stn=Manhattan,Garden City&int=day&t_start=20190917000000&t_end=20190917000000&vars=TEMP2MAVG")
        .then(res => res.text())
        .then(
            (result) => {
           /* this.setState({
                isLoaded: true,
                items: result
            });*/
            this.initializeCurrentData(r);

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
        );
    }

    getCurrentTemp(name)
    {
        if(name == "Manhattan")
        {
            this.Manhattan[this.Manhattan.length()-1];
        }
    }

    initializeCurrentData(r)
    {
        var i = 0;
        var strArr = r.split('\n');
        strArr.forEach(x => {
            if(i != 0)
            {
                var temp = x.split(',')
                var tempCels = parseFloat(temp[2]);
                var windTemp = parseFloat(temp[5]);
                var humidityTemp = parseFloat(temp[3]);
                var wind = (windTemp/0.44704);
                var precipTem = parseFloat(temp[4]);

                var data = {"temp": Math.trunc(tempCels * (9/5) + 32), "wind": wind.toFixed(2), "humidity": humidityTemp.toFixed(2), "precip":precipTem.toFixed(2)}

                if(temp[1] == "Manhattan")
                {
                    this.Manhattan.push(data);

                }else if(temp[1] == "Colby")
                {
                    this.Colby.push(data);
                }else if(temp[1] == "Garden City")
                {
                    this.GardenCity.push(data);

                }else if(temp[1] == "Olathe")
                {
                    this.Olathe.push(data);
                }
                //do work
            }
            i++;
        });
    }

    


   

}

