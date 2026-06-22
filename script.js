const API_KEY = "eea2e8479a6812b1bb58e1f5549efad1";

let isCelsius = true;

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeToggle = document.getElementById("themeToggle");
const unitToggle = document.getElementById("unitToggle");
const historyBtn = document.getElementById("historyBtn");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

searchBtn.addEventListener("click",()=>{
fetchWeather(cityInput.value);
});

cityInput.addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
fetchWeather(cityInput.value);
}
});

async function fetchWeather(city){

if(!city) return;

saveHistory(city);

const weatherURL =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

const forecastURL =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

try{

const weatherData =
await fetch(weatherURL).then(res=>res.json());

const forecastData =
await fetch(forecastURL).then(res=>res.json());

displayWeather(weatherData);
displayForecast(forecastData);

}
catch(error){
alert("Unable to fetch weather.");
}
}

function displayWeather(data){

document.getElementById("cityName").textContent =
`${data.name}, ${data.sys.country}`;

let temp = data.main.temp;

if(!isCelsius){
temp=(temp*9/5)+32;
}

document.getElementById("temperature").textContent =
`${Math.round(temp)}°`;

document.getElementById("description").textContent =
data.weather[0].description;

document.getElementById("humidity").textContent =
`${data.main.humidity}%`;

document.getElementById("wind").textContent =
`${data.wind.speed} m/s`;

document.getElementById("weatherIcon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

function displayForecast(data){

const container =
document.getElementById("forecastContainer");

container.innerHTML="";

const daily =
data.list.filter(item =>
item.dt_txt.includes("12:00:00")
);

daily.slice(0,5).forEach(day=>{

let temp = day.main.temp;

if(!isCelsius){
temp=(temp*9/5)+32;
}

container.innerHTML += `
<div class="forecast-card">
<h3>${new Date(day.dt_txt).toDateString()}</h3>
<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
<p>${Math.round(temp)}°</p>
<p>${day.weather[0].main}</p>
</div>
`;

});
}

locationBtn.addEventListener("click",()=>{

navigator.geolocation.getCurrentPosition(
async(position)=>{

const lat = position.coords.latitude;
const lon = position.coords.longitude;

const weatherURL =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const forecastURL =
`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const weatherData =
await fetch(weatherURL).then(res=>res.json());

const forecastData =
await fetch(forecastURL).then(res=>res.json());

displayWeather(weatherData);
displayForecast(forecastData);

}
);
});

themeToggle.addEventListener("click",()=>{
document.body.classList.toggle("light");
});

unitToggle.addEventListener("click",()=>{

isCelsius=!isCelsius;

unitToggle.textContent =
isCelsius ? "°C" : "°F";

const city =
document.getElementById("cityName").textContent.split(",")[0];

if(city!=="Search a city"){
fetchWeather(city);
}
});

function saveHistory(city){

let history =
JSON.parse(localStorage.getItem("weatherHistory")) || [];

history =
history.filter(item=>item!==city);

history.unshift(city);

history = history.slice(0,10);

localStorage.setItem(
"weatherHistory",
JSON.stringify(history)
);
}

historyBtn.addEventListener("click",()=>{

historyPanel.classList.toggle("hidden");

loadHistory();
});

function loadHistory(){

const history =
JSON.parse(localStorage.getItem("weatherHistory")) || [];

historyList.innerHTML="";

history.forEach(city=>{

const li =
document.createElement("li");

li.textContent=city;

li.onclick=()=>{
fetchWeather(city);
};

historyList.appendChild(li);

});
}