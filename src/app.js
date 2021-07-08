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

function showForecast() {
  let weekForecastElement = document.querySelector("#week-forecast");
  let hourForecastElement = document.querySelector("#hour-forecast");

  let weekForecastHTML = `<div class="row">`;
  let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekDays.forEach(function (day) {
    weekForecastHTML =
      weekForecastHTML +
      `
            <div class="col-2">
              <div class="week-forecast-day">
                ${day}
              </div>
              <img src="images/weather_01d.png" width="42" alt="" id="week-forecast-icons">
              <div class="week-forecast-temperatures">
                <span class="week-temperature-max">18˚ </span>
                <span class="week-temperature-min">9˚</span>
              </div>
            </div>
  `;
  });

  weekForecastHTML = weekForecastHTML + `</div>`;

  let hourForecastHTML = `<div class="row">`;
  let hours = ["13:00", "14:00", "15:00"];
  hours.forEach(function (time) {
    hourForecastHTML =
      hourForecastHTML +
      `
            <div class="col-4">
              <div class="hour-forecast-time">
                ${time}
              </div>
              <img src="images/weather_04d.png" width="28" alt="" id="hour-forecast-icons">
              <div class="hour-forecast-description">
                Clouds
              </div>
            </div>
  `;
  });

  hourForecastHTML = hourForecastHTML + `</div>`;

  hourForecastElement.innerHTML = hourForecastHTML;
  weekForecastElement.innerHTML = weekForecastHTML;
}

function showTemperature(response) {
  let currentIcon = document.querySelector("#current-icon");

  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#current-feel").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#city").innerHTML = response.data.name;

  document.querySelector("#current-date").innerHTML = formatDate(
    response.data.dt * 1000
  );

  celsiusTemperature = response.data.main.temp;

  currentIcon.setAttribute(
    "src",
    `images/weather_${response.data.weather[0].icon}.png`
  );
}

function search(cityInput) {
  let apiKey = "d8af4b7d8cdbdf9cf3715e274a125f97";
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

  let apiKey = "d8af4b7d8cdbdf9cf3715e274a125f97";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;

  axios
    .get(`${apiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(showTemperature);
}

function getCurrent(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function convertCelsius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

function convertFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let cityForm = document.querySelector("button[type='submit']");
cityForm.addEventListener("click", searchCity);

let currentButton = document.querySelector("button[type='button']");
currentButton.addEventListener("click", getCurrent);

search("Lisbon");
showForecast();

//function convertCelsius(event) {
//  event.preventDefault();
//  let celsius = document.querySelector("#current-temperature");
//  celsius.innerHTML = 19;
//}

//function convertFahrenheit(event) {
//  event.preventDefault();
//  let fahrenheit = document.querySelector("#current-temperature");
//  fahrenheit.innerHTML = 66;
//}

//let celsiusLink = document.querySelector("#celsius-link");
//celsiusLink.addEventListener("click", convertCelsius);

//let fahrenheitLink = document.querySelector("#fahrenheit-link");
//fahrenheitLink.addEventListener("click", convertFahrenheit);
