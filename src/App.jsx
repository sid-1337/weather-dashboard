import { useState, useEffect } from 'react'
import './App.css'
import { Dropdown } from 'primereact/dropdown';
import Balma from './components/Aqi'
import DailyForcast from './components/day';
import Loading from "./components/Loading";
import Chart from 'chart.js/auto';
import Current from './components/Current';
const APIKEY = import.meta.env.VITE_APIKEY;
function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

const apiCall_Chart = (lat, lon) => {
  function getday(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000)
    let c = a.getHours() + ":" + ("0" + a.getMinutes()).slice(-2);
    let b = a.toDateString().substring(4, 7) + " " + a.getDate() + " " + c;
    return b;
  }
  fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${APIKEY}&cnt=24`).then(
    res => res.json()
  ).then(
    data => {
      // console.log(data);
      let list = data.list;
      let a = list;
      // .filter(x => x.dt_txt.includes("12:00:00"));
      // console.log(a);
      let temp = a.map(x => x.main.temp - 273.15);
      let date = a.map(x => getday(x.dt));
      let hum = a.map(x => x.main.humidity);
      let pres = a.map(x => x.main.pressure);
      let ctx = document.getElementById('myChart').getContext('2d');
      let chartStatus = Chart.getChart("myChart"); // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
      let myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: date,
          datasets: [{
            label: 'Temperature',
            data: temp,
            backgroundColor: [
              'rgb(236, 110, 76)',
            ],
            borderColor: [
              'rgb(236, 110, 76)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 1
          },
          {
            label: 'Humidity',
            data: hum,
            backgroundColor: [
              'rgba(0, 181, 204, 1)',
            ],
            borderColor: [
              'rgba(0, 181, 204, 1)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 1
          },
          {
            label: 'Pressure',
            data: pres,
            backgroundColor: [
              'rgb(77, 19, 209)',
            ],
            borderColor: [
              'rgb(77, 19, 209)',
            ],
            borderWidth: 1,
            cubicInterpolationMode: 'monotone',
            tension: 1
          }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              stacked: true,
              grid: {
                display: true,
                color: "rgba(255,99,132,0.2)"
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Forcast for Next 24 Hours',
              padding: {
                top: 10,
                bottom: 10,
              },
              font: {
                size: 23
              }

            },

            subtitle: {
              display: true,
              text: 'Temp(°C), Pressure(hPa,Standard pressure at sea level is 1013hPa), Humidity(%)',
              font: {
                size: 15
              }
            },
            legend: {
              labels: {
                // This more specific font property overrides the global property
                font: {
                  size: 23
                }
              }
            }

          }
        }
      });
    }
  )

}


const VirtualScrollDemo = (props) => {
  const [selectedItem, setSelectedItem] = useState(1267995);
  const data = props.content;
  const items = Array.from(data).map((x, _) => ({ label: `${x.name}`, value: x.id }));
  return (
    <div  >
      <Dropdown variant='filled' value={selectedItem} onChange={(e) => {
        let a = data.filter(x => x.id === e.value)[0].coord;
        // console.log(a);
        apiCall_Chart(a.lat, a.lon);
        props.updateLocation(a.lat,a.lon);
        const apiCall_Forecast = (lat, lon) => {
          fetch(`https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${lat}&lon=${lon}&appid=${APIKEY}`).then(
            res => res.json()
          ).then(
            data => {
              // console.log(data);
              // console.log(props);
              props.updateList(data.list);
            }
          )
        }

        apiCall_Forecast(a.lat, a.lon);
        return setSelectedItem(e.value)
      }} options={items} virtualScrollerOptions={{ itemSize: 50 }}
        filter placeholder="Select Item" className="drop" />
    </div>
  )
}

function App() {
  let now = new Date();
  let dat = now.toDateString();
  let t = now.getHours();
  let tim = "";
  const [location, setLocation] = useState({lat:20,lon:80});
  const updateLocation = (lat,lon) => {
    const x = {}
    x.lat = lat;
    x.lon = lon; 
    setLocation(x)
  };
  const [use, setUse] = useState(0);
  const [data, setData] = useState([]);
  const [list, setList] = useState({
    "list": [{
      "dt": 1720852200,
      "sunrise": 1720828448,
      "sunset": 1720877650,
      "temp": {
        "day": 306.66,
        "min": 301.11,
        "max": 306.66,
        "night": 302.76,
        "eve": 305.34,
        "morn": 301.11
      },
      "feels_like": {
        "day": 313.66,
        "night": 309.76,
        "eve": 312.34,
        "morn": 306.94
      },
      "pressure": 996,
      "humidity": 68,
      "weather": [
        {
          "id": 501,
          "main": "Rain",
          "description": "moderate rain",
          "icon": "10d"
        }
      ],
      "speed": 1.92,
      "deg": 51,
      "clouds": 65,
      "rain": 16.78
    },]
  });
  const updateList = (list) => {
    setList({
      list
    });
  }
  const getData = () => {
    fetch('/data.json.gz'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function (response) {
        // console.log(response)
        return response.arrayBuffer();
      })
      .then(function (buffer) {
        const text = new TextDecoder('utf-8').decode(buffer);
        const myJson = JSON.parse(text);
        setData(myJson);
        setUse(1);
      });
  }
  useEffect(() => {
    if (use === 0) {
      getData();
    }
  }, [])
  const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => setLoading(false), 3300)
    }, [])
    if (loading) {
        return <Loading/>
    }
  if (t < 12) {
    let min = now.getMinutes();
    if (min < 10) min = "0" + min;
    tim = t + ":" + min + " AM";
  }
  else {
    let min = now.getMinutes();
    if (min < 10) min = "0" + min;
    tim = (t - 12) + ":" + now.getMinutes() + " PM";
  }
  return (
    <>
      <main>
        <div className="today">
          <div className="container top">
            <span className="material-symbols-outlined">pin_drop</span>Your City:  <VirtualScrollDemo content={data} updateList={updateList} updateLocation={updateLocation} />

          </div>
          <div className="container mid1">
            {dat}  |  {tim}
          </div>
          <Current location={location} />
          <div className="aqi">
            <Balma location={location}/>
          </div>
        </div>
        <div className="trend">
          <div className="rtop">

            <canvas id="myChart" ></canvas>

          </div>
          <div className="rmid">
            Forecast for next 30 days
          </div>
          <div className="rbot" id='scroll-5'>
            <DailyForcast content={list} />
          </div>
        </div>
      </main>
      <footer>
        <p>Developed and designed by Siddharth Bajpai with 🩵</p>
      </footer>
    </>
  )
}

export default App
