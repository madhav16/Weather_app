import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import axios from 'axios';

function WeatherApp() {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('');
    const [forecast, setForecast] = useState(null);
    useEffect(() => {
        if (city) {
            fetchWeather();
            fetchForecast();
        }
    }, []);

    async function fetchWeather() {
        try {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=ed9a8007a4c84806af755125232108&q=${city}`
            );
            setWeather(response.data);
            fetchForecast();
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }
    async function fetchForecast() { // New 
        const url = `https://api.weatherapi.com/v1/forecast.json?key=ed9a8007a4c84806af755125232108&q&q=${city}&days=3`;

        const response = await axios.get(url);
        setForecast(response.data.forecast);
    }

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const formattedLocalTime = weather?.location
        ? new Date(weather.location.localtime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    return (
        <div className="container-fluid img w-100 h-100">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter City"
                                value={city}
                                onChange={handleCityChange}
                            />
                            <button className="btn btn-primary" onClick={fetchWeather}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-6  ">
                        <div className="row d-flex flex-column">
                            <div className="col-lg-4">
                                {weather?.location && <p className="city">{weather.location.name}</p>}
                            </div>
                            <div className="col-lg-4">
                                {formattedLocalTime && <p className="date">{formattedLocalTime}</p>}
                            </div>
                            <div className="col-lg-4">
                                {weather?.current && (
                                    <>
                                        <img className="image-fluid" src={weather.current.condition.icon} alt="Condition Icon" />
                                        <p className="date">{weather.current.condition.text}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="row d-flex flex-column">
                            <div className="col-lg-6">
                                {weather?.current && <p className="temp">{weather.current.temp_c}°C</p>}
                            </div>
                            <div className="col-lg-6 w-100">
                                {weather?.current && (
                                    <p className="date">
                                        Feels Like: {weather.current.feelslike_c}°C
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="col-lg-6 w-100 mt-5">
                        {weather?.current && (
                            <div className="weather-data border rounded p-3">
                                <p className="h4">Weather Details</p>
                                <p className="mb-0"><strong>Wind Speed:</strong> {weather.current.wind_kph} kph</p>
                                <p className="mb-0"><strong>Wind Direction:</strong> {weather.current.wind_dir}</p>
                                <p className="mb-0"><strong>Precipitation:</strong> {weather.current.precip_mm} mm</p>
                                <p className="mb-0"><strong>Humidity:</strong> {weather.current.humidity}%</p>
                            </div>
                        )}
                    </div>
                    {forecast && (
                        <div className="forecast mt-5">
                            <h2>3 Day Forecast</h2>

                            <div className="d-flex flex-nowrap overflow-auto">
                                {forecast.forecastday.map(day => (
                                    <div key={day.date} className="text-center flex-shrink-0 me-4">
                                        <img src={day.day.condition.icon} className="mb-2" width="50px" />
                                        <h5 className="mt-2">{day.date}</h5>
                                        <p className="mb-2"><strong>{day.day.avgtemp_c}°</strong></p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
