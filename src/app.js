const apiKey = "d8af4b7d8cdbdf9cf3715e274a125f97";

function convertCelsius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let currentFeel = document.querySelector("#current-feel");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  currentFeel.innerHTML = Math.round(celsiusFeelTemperature);
}

function convertFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let currentFeel = document.querySelector("#current-feel");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
  let fahrenheitFeelTemperature = (celsiusFeelTemperature * 9) / 5 + 32;
  currentFeel.innerHTML = Math.round(fahrenheitFeelTemperature);
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

  return `${day} ${hours}:${minutes}`;
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

function showForecast(response) {
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
                <span class="week-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}˚ </span>
                <span class="week-temperature-min">${Math.round(
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
      ${formatHour(forecastHour.dt)}
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

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  console.log(response.data);
  celsiusTemperature = response.data.main.temp;
  celsiusFeelTemperature = response.data.main.feels_like;

  document.querySelector("#current-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#current-feel").innerHTML = Math.round(
    celsiusFeelTemperature
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-date").innerHTML = formatDate(
    (response.data.dt + response.data.timezone) * 1000
  );
  document
    .querySelector("#current-icon")
    .setAttribute("src", `images/weather_${response.data.weather[0].icon}.png`);

  getForecast(response.data.coord);
}

function search(cityInput) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
  axios
    .get(`${apiUrl}q=${cityInput}&units=metric&appid=${apiKey}`)
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
    .get(`${apiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(showTemperature);
}

function getCurrent(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

let celsiusTemperature = null;
let celsiusFeelTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let cityForm = document.querySelector("button[type='submit']");
cityForm.addEventListener("click", searchCity);

let currentButton = document.querySelector("button[type='button']");
currentButton.addEventListener("click", getCurrent);

search("Lisbon");
