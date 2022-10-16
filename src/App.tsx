import './App.css';
import { cities } from './data/citites';
import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
interface softwareObj {
  id?: number;
  label?: string;
  lat: number,
  lon: number;
  nm: string;
  value: number;
};


function App() {
  const [cityName , setCityName] = useState('');
  const [cityTemp , setCityTemp] = useState(0);
  const [icon , setIcon] = useState('');
  const[listData , setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentWheaterData(cities[0]);
    getWheatherForNextDays(cities[0]);
  }, []);

const handleInputChange = (e : any) =>{
  console.log(e);
  getCurrentWheaterData(e);
  getWheatherForNextDays(e);
}

const getCurrentWheaterData = (e : softwareObj) => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${e.lat}&lon=${e.lon}&appid=e17a5956600aad9e9e5a1f1afc6d19f3`)
  .then((response) =>{
    const weather =  Math.round(response.data.main.temp - 273.15);
    setCityName(response.data.name);
    setCityTemp(weather)
    setIcon(response.data.weather[0].icon);
    setLoading(false);
  })
  .catch(
    error => console.log(error)
  )
}

const getWheatherForNextDays = (e : softwareObj) => {
  setLoading(true);
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${e.lat}&lon=${e.lon}&appid=e17a5956600aad9e9e5a1f1afc6d19f3`)
      .then(res => {
        console.log(res);
          let days : any[] = [];
          let listD : any[] = [];
          // eslint-disable-next-line array-callback-return
          for(let i = 0; i <= res.data.list.length-1; i++){
            if(!days.includes(moment.unix(res.data.list[i].dt).format('ddd'))){
              listD = [...listD, res.data.list[i]];
              days = [...days, moment.unix(res.data.list[i].dt).format('ddd')]
              if(days.length === 3){
                break;
              }
            }
          }
          const listData: any = listD;
          setListData(listData);
          setLoading(false);
      })
      .catch(
        error => console.log(error)
      )
}

const listItems = listData.map((item: any) => {
  return (
    <div className="side" key={item.dt}>
      <div className="day">{moment.unix(item.dt).format('ddd')}</div>
      <div className="icon"><img className="centerImage" src={`http://openweathermap.org/img/wn/${item.weather[0].icon }@2x.png`} alt="weatherIcon"/></div>
      <div className="tempValue">{Math.round(item.main.temp_max - 273.15)}°</div>
      <div className="tempValue">{Math.round(item.main.temp_min - 273.15)}°</div>
    </div>
  )
})

return (
  <div className="App">
      <div className="centerBox">
        <div className="selectCenter">
          <div className="maintitle">selectionner votre ville</div>
          <Select
            className="basic-single"
            classNamePrefix="Select City"
            isDisabled={false}
            defaultValue={cities[0]}
            isLoading={false}
            isClearable={true}
            isRtl={false}
            isSearchable={true}
            onChange={handleInputChange}
            name="color"
            options={cities}
          />
          {loading &&
            <div className="centerloader">
              <div className="lds-dual-ring">
              </div>
            </div>}
          <div className="padd">
            {cityName && !loading && <div className="selected">
              <div className="selectedCity">{cityName}</div>
              <div className="clouldIcon"><img className="imageAdj" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="weatherIcon"/></div>
              <div className="temperature">{cityTemp}°</div>
            </div>}
            {listData && !loading && <div className="nextthreeDay">
                {listItems}
            </div>}
          </div>
        </div>
      </div>
  </div>
);

}

export default App;
