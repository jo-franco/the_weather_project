function formatDate(date) {
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

function showTemperature(response) {
  //let currentTemp = document.querySelector("#current-temperature");
  //let temperature = Math.round(response.data.main.temp);
  //currentTemp.innerHTML = `${temperature}`;
  //let currentFeel = document.querySelector("#current-feel");
  //let feel = Math.round(response.data.main.feels_like);
  //currentFeel.innerHTML = `${feel}`;
  //let currentDescription = document.querySelector("#weather-description");
  //currentDescription.innerHTML = response.data.weather[0].description;

  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#current-feel").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#city").innerHTML = response.data.name;
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
  //let city = document.querySelector("#city");
  //city.innerHTML = `${cityInput.value}`;
  search(cityInput);
}

function getPosition(position) {
  //console.log(position);
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

let cityForm = document.querySelector("button[type='submit']");
cityForm.addEventListener("click", searchCity);

let currentButton = document.querySelector("button[type='button']");
currentButton.addEventListener("click", getCurrent);

let currentDate = document.querySelector("#current-date");
let currentTime = new Date();
currentDate.innerHTML = formatDate(currentTime);

search("Lisbon");

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
