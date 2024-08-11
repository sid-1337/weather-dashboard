import React, { useState, useEffect } from 'react';
import axios from 'axios';
const TOKEN = import.meta.env.VITE_AQI_TOKEN; 
const AirQualityComponent = (props) => {
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        const response = await axios.get(
          `https://api.waqi.info/feed/geo:${props.location.lat};${props.location.lon}/?token=${TOKEN}`
        );
        setAqiData(response.data.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchAqiData();
  }, [props.location.lat, props.location.lon]);

  const getColor = (aqi) => {
    if (aqi < 50) return 'green'; // Good
    else if (aqi < 100) return 'yellow'; // Moderate
    else if (aqi < 150) return 'orange'; // Unhealthy for sensitive groups
    else if (aqi < 200) return 'red'; // Unhealthy
    else return 'purple'; // Hazardous
  };

  return (
    <div style={{ display:"flex",alignItems:"center",flexDirection:"column"}}>
      {error && <p>Error fetching AQI data: {error.message}</p>}
      {aqiData ? (
        <>
          <h3>Air Quality in {aqiData.city.name}</h3>
          <div style={{ backgroundColor: getColor(aqiData.aqi) , width : "20vw", display : "flex", justifyContent : "center"}}>
          <strong>AQI Value: {aqiData.aqi}</strong>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AirQualityComponent;
