

var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var APIKey="78dd7399d393d2434ca694be6dd8192b"

function getWeatherData(city){
 
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  fetch(queryURL)
  .then(response => response.json())
  .then(data => {
    saveWeatherData(city, data); 
    displayWeatherData(data);
  })
  .catch(error => console.log(error));

}

function getForecastData(city) {
  var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
  fetch(queryURL)
    .then(response => response.json())
    .then(data => { displayForecastData(data);
      saveForecastData(city, data); 
    })
    .catch(error => console.log(error));
}


function saveWeatherData(city, data) {
   localStorage.setItem("weatherData-" + city, JSON.stringify(data));
}

function saveForecastData(city, data) {
   localStorage.setItem("forecastData-" + city, JSON.stringify(data));
}


function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
}

function metersPerSecondToMph(mps) {
  return (mps * 2.237).toFixed(2);
}


function displayWeatherData(data) {
 
  console.log("weather data:",data);
 
  var cityName = data.name;
  var temperature = kelvinToFahrenheit(data.main.temp);
  var windSpeed =  metersPerSecondToMph(data.wind.speed);
  var humidity = data.main.humidity;
  var currentDate = getCurrentDate();
  var weatherIcon = data.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";


  var cityTodayCityName = document.getElementById("city-today-city-name");
  cityTodayCityName.innerHTML = cityName + " (" + currentDate + ")";

  var iconImg = document.createElement("img");
  iconImg.src = iconUrl;
  iconImg.alt = "Weather Icon";
  iconImg.classList.add("weather-icon");
  cityTodayCityName.appendChild(iconImg);
  

  document.getElementById("city-today-temp").innerHTML = "Temperature: " + temperature + " °F";
  document.getElementById("city-today-wind").innerHTML = "Wind Speed: " + windSpeed + " MPH";
  document.getElementById("city-today-humidity").innerHTML = "Humidity: " + humidity + "%";

  
}


function displayForecastData(data) {
  var forecastList = data.list;
  var currentDate = new Date();
   currentDate.setHours(0, 0, 0, 0);
  var nextFiveDays = [];
  var uniqueDates = new Set(); 

  for (var i = 0; i < forecastList.length; i++) {
    var forecast = forecastList[i];
    var forecastDate = forecast.dt_txt.split(" ")[0];

    if (!uniqueDates.has(forecastDate) && forecastDate !== currentDate) {
      nextFiveDays.push(forecast);
      uniqueDates.add(forecastDate);
    }

    if (nextFiveDays.length === 6) {
      break;
    }
  }
  
  for (var j = 0; j < 5; j++) {
    var forecast = nextFiveDays[j+1];
    var forecastElement = document.getElementById("forecast-" + (j + 1));
    var forecastDate = forecast.dt_txt.split(" ")[0];
    var temperature = kelvinToFahrenheit(forecast.main.temp);
    var windSpeed =  metersPerSecondToMph(forecast.wind.speed);
    var humidity = forecast.main.humidity;
    var weatherIcon = forecast.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";

    forecastElement.querySelector("h4").innerHTML = forecastDate;
    forecastElement.querySelector("img").src = iconUrl;
    forecastElement.querySelector("#day-" + (j + 1) + "-temp").innerHTML = "Temperature: " + temperature + " °F";
    forecastElement.querySelector("#day-" + (j + 1) + "-wind").innerHTML = "Wind Speed: " + windSpeed + " MPH";
    forecastElement.querySelector("#day-" + (j + 1) + "-humidity").innerHTML = "Humidity: " + humidity + "%";
  }
}




function getCurrentDate() {
  var currentDate = new Date();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');
  var year = currentDate.getFullYear();
  return month + "/" + day + "/" + year;
}


function searchCity() {
  var searchInput = document.getElementById("search-input");
  var cityName = searchInput.value.trim();

  if (cityName !== "") {
    
    searchHistory.unshift(cityName);
    /*if (searchHistory.length > 10) {
      searchHistory.pop();
    }*/
    
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displaySearchHistory();
  }

  
  getWeatherData(cityName);
  getForecastData(cityName);

  searchInput.value = "";
}

function displaySearchHistory() {
  var searchHistoryDiv = document.getElementById("search-history");
  searchHistoryDiv.innerHTML = "";

  for (var i = 0; i < searchHistory.length; i++) {
    var historyBox = document.createElement("div");
    historyBox.className = "history-box";
    historyBox.innerHTML = searchHistory[i];
    historyBox.addEventListener("click", function() {
      var city = this.innerHTML;
      var weatherData = JSON.parse(localStorage.getItem("weatherData-" + city));
      displayWeatherData(weatherData);
      var forecastData = JSON.parse(localStorage.getItem("forecastData-" + city));
      displayForecastData(forecastData);
    });

    searchHistoryDiv.appendChild(historyBox);
  }
}

function displayCity(cityName) {
  var cityTodayCityName = document.getElementById("city-today-city-name");
  cityTodayCityName.innerHTML = cityName;
}

document.addEventListener("DOMContentLoaded", function() {
  displaySearchHistory();
});
