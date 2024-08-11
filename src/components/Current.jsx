import React, { useEffect, useState } from 'react';

const WeatherComponent = ({ location }) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=00f848d5b2f76af548c6bf12724f55be`);
            const data = await response.json();
            // console.log(data);  
            setWeatherData({
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                temp: (data.main.temp - 273.15).toFixed(0),
                description: titleCase(data.weather[0].description),
            });
        };
        fetchWeather();
    }, [location]);

    const titleCase = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (!weatherData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            
                <div className="container mid2">
                    <div className="sideright">{weatherData.temp} &deg;C</div>
                    <div className="sideleft">
                        <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`} alt="weather icon" />
                    </div>
                </div>
                <div className="container bottom">
                    <div className="sideleft">Humidity <br /><br /> {weatherData.humidity} %</div>
                    <div className="sideright">Wind Speed <br /><br /> {weatherData.wind} m/s</div>
                </div>
                <div className="container mid titl">{weatherData.description}</div>
            
        </>
    );
};

export default WeatherComponent;
