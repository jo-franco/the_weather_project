const apiKey = "d8af4b7d8cdbdf9cf3715e274a125f97";
const unit = "metric";
let tempUnit = "metric";

function getTemperature(value) {
  if (tempUnit === "metric") {
    return Math.round(value);
  } else {
    return Math.round((value * 9) / 5 + 32);
  }
}
function convertCelsius(event) {
  event.preventDefault();
  tempUnit = "metric";
  let currentTemperature = document.querySelector("#current-temperature");
  let currentFeel = document.querySelector("#current-feel");
  let currentMaxTemperature = document.querySelector("#max-temp");
  let currentMinTemperature = document.querySelector("#min-temp");
  currentTemperature.innerHTML = Math.round(temperature);
  currentMaxTemperature.innerHTML = Math.round(maxTemperature);
  currentMinTemperature.innerHTML = Math.round(minTemperature);
  currentFeel.innerHTML = Math.round(feelTemperature);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  showForecast();
}
function convertFahrenheit(event) {
  event.preventDefault();
  tempUnit = "imperial";
  let fahrenheitTemperature = getTemperature(temperature);
  let currentTemperature = document.querySelector("#current-temperature");
  let fahrenheitMaxTemperature = getTemperature(maxTemperature);
  let currentMaxTemperature = document.querySelector("#max-temp");
  let fahrenheitMinTemperature = getTemperature(minTemperature);
  let currentMinTemperature = document.querySelector("#min-temp");
  let fahrenheitFeelTemperature = getTemperature(feelTemperature);
  let currentFeel = document.querySelector("#current-feel");
  currentTemperature.innerHTML = `${fahrenheitTemperature}`;
  currentMaxTemperature.innerHTML = `${fahrenheitMaxTemperature}`;
  currentMinTemperature.innerHTML = `${fahrenheitMinTemperature}`;
  currentFeel.innerHTML = `${fahrenheitFeelTemperature}`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  showForecast();
}
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `Last updated: ${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function formatHour(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showForecast);
}
function showForecast(response = forecastValue) {
  //console.log(response.data);
  forecastValue = response;

  let weekDays = response.data.daily;
  let hours = response.data.hourly;

  let weekForecastElement = document.querySelector("#week-forecast");
  let hourForecastElement = document.querySelector("#hour-forecast");

  let weekForecastHTML = `<div class="row">`;
  weekDays.forEach(function (forecastDay, index) {
    if (index < 6) {
      weekForecastHTML =
        weekForecastHTML +
        `
            <div class="col-2">
              <div class="week-forecast-day">
                ${formatDay(forecastDay.dt)}
              </div>
              <img src="images/weather_${
                forecastDay.weather[0].icon
              }.png" alt="" id="week-forecast-icons">
              <div class="week-forecast-temperatures">
                <span class="week-temperature-max">${getTemperature(
                  forecastDay.temp.max
                )}˚ </span>
                <span class="week-temperature-min">${getTemperature(
                  forecastDay.temp.min
                )}˚</span>
              </div>
            </div>
  `;
    }
  });

  weekForecastHTML = weekForecastHTML + `</div>`;

  let hourForecastHTML = `<div class="row">`;
  hours.forEach(function (forecastHour, index) {
    if (index > 0 && index < 4) {
      hourForecastHTML =
        hourForecastHTML +
        `
      <div class="col-4">
      <div class="hour-forecast-time">
      ${formatHour(forecastHour.dt + response.data.timezone_offset)}
   </div>
  <img src="images/weather_${
    forecastHour.weather[0].icon
  }.png" alt="" id="hour-forecast-icons">
   <div class="hour-forecast-description">
    ${forecastHour.weather[0].description}
  </div>
  </div>
  `;
    }
  });

  hourForecastHTML = hourForecastHTML + `</div>`;

  hourForecastElement.innerHTML = hourForecastHTML;
  weekForecastElement.innerHTML = weekForecastHTML;
}

function showTemperature(response) {
  temperature = response.data.main.temp;
  feelTemperature = response.data.main.feels_like;
  maxTemperature = response.data.main.temp_max;
  minTemperature = response.data.main.temp_min;

  document.querySelector("#current-temperature").innerHTML =
    getTemperature(temperature);
  document.querySelector("#max-temp").innerHTML =
    getTemperature(maxTemperature);
  document.querySelector("#min-temp").innerHTML =
    getTemperature(minTemperature);
  document.querySelector("#current-feel").innerHTML =
    getTemperature(feelTemperature);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#current-icon")
    .setAttribute("src", `images/weather_${response.data.weather[0].icon}.png`);

  getForecast(response.data.coord);
}

function search(cityInput) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
  axios
    .get(`${apiUrl}q=${cityInput}&units=${unit}&appid=${apiKey}`)
    .then(showTemperature);
}
function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("input[type='search']").value;
  search(cityInput);
}
function getPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;

  axios
    .get(`${apiUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`)
    .then(showTemperature);
}
function getCurrent(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let temperature = null;
let feelTemperature = null;
let maxTemperature = null;
let minTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let cityForm = document.querySelector("button[type='submit']");
cityForm.addEventListener("click", searchCity);

let currentButton = document.querySelector("button[type='button']");
currentButton.addEventListener("click", getCurrent);

search("Lisbon");
