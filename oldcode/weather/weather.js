const API_KEY = "4d89f82cd0248401d9653bff3574088b"; // Provided API key
let isCelsius = true;

// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const unitC = document.getElementById("unit-c");
const unitF = document.getElementById("unit-f");
const themeToggle = document.getElementById("themeToggle");

const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");
const forecastContainer = document.getElementById("forecast-container");
const historyList = document.getElementById("historyList");

// Weather Mappings
const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "💨",
  Fog: "🌫️",
  Default: "🌡️"
};

const weatherClasses = {
  Clear: "weather-clear",
  Clouds: "weather-clouds",
  Rain: "weather-rain",
  Snow: "weather-snow",
  Default: ""
};

// Init
window.onload = () => {
  // Theme
  if (localStorage.getItem("weather_theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }
  // Units
  if (localStorage.getItem("weather_unit") === "F") {
    isCelsius = false;
    toggleUnitUI();
  }

  loadHistory();
  const lastCity = localStorage.getItem("weather_last_city");
  if (lastCity) {
    cityInput.value = lastCity;
    fetchWeather(lastCity);
  }
};

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => handleError("Location permission denied or unavailable.")
    );
  } else {
    handleError("Geolocation is not supported by your browser.");
  }
});

unitC.addEventListener("click", () => { if(!isCelsius) { isCelsius = true; toggleUnitUI(); refreshWeather(); } });
unitF.addEventListener("click", () => { if(isCelsius) { isCelsius = false; toggleUnitUI(); refreshWeather(); } });

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("weather_theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Helpers
function toggleUnitUI() {
  unitC.classList.toggle("active", isCelsius);
  unitF.classList.toggle("active", !isCelsius);
  localStorage.setItem("weather_unit", isCelsius ? "C" : "F");
}

function refreshWeather() {
  const city = localStorage.getItem("weather_last_city");
  if (city) fetchWeather(city);
}

function getUnit() {
  return isCelsius ? "metric" : "imperial";
}

function getTempSymbol() {
  return isCelsius ? "°C" : "°F";
}

function getSpeedSymbol() {
  return isCelsius ? "m/s" : "mph";
}

// Fetch Logic
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${getUnit()}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${getUnit()}`;
  await executeFetch(url, forecastUrl, city);
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getUnit()}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getUnit()}`;
  await executeFetch(url, forecastUrl);
}

async function executeFetch(url, forecastUrl, cityName = null) {
  if (!navigator.onLine) {
    handleError("You are offline. Please check your connection.");
    return;
  }

  showLoading();
  try {
    const [resWeather, resForecast] = await Promise.all([
      fetch(url),
      fetch(forecastUrl)
    ]);

    if (!resWeather.ok) throw new Error("City not found");

    const dataWeather = await resWeather.json();
    const dataForecast = await resForecast.json();

    updateUI(dataWeather, dataForecast);
    
    // Save history
    const actualCity = dataWeather.name;
    localStorage.setItem("weather_last_city", actualCity);
    saveToHistory(actualCity);

  } catch (err) {
    handleError(err.message);
  }
}

// UI Updates
function showLoading() {
  weatherResult.style.display = "none";
  forecastContainer.style.display = "none";
  errorMsg.style.display = "none";
  loading.style.display = "block";
}

function handleError(msg) {
  loading.style.display = "none";
  weatherResult.style.display = "none";
  forecastContainer.style.display = "none";
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
}

function updateUI(weather, forecast) {
  loading.style.display = "none";
  errorMsg.style.display = "none";

  // Current Weather
  const main = weather.weather[0].main;
  document.getElementById("cityName").textContent = `${weather.name}, ${weather.sys.country}`;
  document.getElementById("weatherDesc").textContent = weather.weather[0].description;
  document.getElementById("weatherIcon").textContent = weatherIcons[main] || weatherIcons.Default;
  document.getElementById("temperature").textContent = `${Math.round(weather.main.temp)}${getTempSymbol()}`;
  
  document.getElementById("feelsLike").textContent = `${Math.round(weather.main.feels_like)}${getTempSymbol()}`;
  document.getElementById("tempMinMax").textContent = `${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°`;
  document.getElementById("humidity").textContent = `${weather.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `${weather.wind.speed} ${getSpeedSymbol()}`;

  // Background change based on weather
  document.body.className = document.body.className.replace(/weather-\w+/g, '');
  if (weatherClasses[main]) {
    document.body.classList.add(weatherClasses[main]);
  }

  // Forecast (One per day, taking noon approx)
  const fList = document.getElementById("forecastList");
  fList.innerHTML = "";
  
  const dailyData = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));
  // Sometimes dailyData might not have exactly 5, fallback to every 8th item if needed
  const listToUse = dailyData.length > 0 ? dailyData : forecast.list.filter((_, i) => i % 8 === 0);

  listToUse.slice(0, 5).forEach(item => {
    const d = new Date(item.dt * 1000);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const fMain = item.weather[0].main;
    
    const div = document.createElement("div");
    div.className = "forecast-item";
    div.innerHTML = `
      <strong>${dayName}</strong>
      <span style="font-size: 1.5rem;">${weatherIcons[fMain] || weatherIcons.Default}</span>
      <span>${Math.round(item.main.temp)}°</span>
    `;
    fList.appendChild(div);
  });

  weatherResult.style.display = "block";
  forecastContainer.style.display = "block";
}

// History Handling
function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem('weather_history')) || [];
  history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > 5) history.pop();
  localStorage.setItem('weather_history', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('weather_history')) || [];
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<span style='color: var(--text-muted); font-size: 0.85rem;'>No recent searches</span>";
    return;
  }
  history.forEach(city => {
    const span = document.createElement("span");
    span.className = "history-tag";
    span.textContent = city;
    span.onclick = () => {
      cityInput.value = city;
      fetchWeather(city);
    };
    historyList.appendChild(span);
  });
}
