const searchLabel = document.getElementById('search-label');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const docBody = document.querySelector("body");
const backgroundVideo = document.getElementById("background-video");
const videoOverlay = document.getElementById("video-overlay");
const weatherContainer = document.getElementById('weather-container');
const locationHeading = document.getElementById("location");
const conditionContainer = document.getElementById("weather-condition");
const tempContainer = document.getElementById("temp-container");
const windContainer = document.getElementById("wind-container");
const humidityContainer = document.getElementById("humidity-container");
const feelsLikeContainer = document.getElementById("feels-like-container");
const currentYear = document.getElementById("current-year");

currentYear.innerText = new Date().getFullYear();

let bodyHeight = String(docBody.offsetHeight);
console.log(bodyHeight);

function resizeVideo()  {
    bodyHeight = String(docBody.offsetHeight)
    backgroundVideo.style.height = bodyHeight + "px";
    videoOverlay.style.height = bodyHeight + "px";
    console.log(bodyHeight);
}

resizeVideo();

const resizeObserver = new ResizeObserver(() => {
    resizeVideo();
})

resizeObserver.observe(docBody);

window.addEventListener('resize', resizeVideo);

const iconSize = "28px";
const iconClass = "ph";

const WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?";
const API_KEY = "c521ede74fcc731b397b6bfd4c3b74ba";

let cityOrZip;
let weatherData;

// Get the computed width of the text element
const textWidth = window.getComputedStyle(searchLabel).width;

// Set the input element's width to match
searchInput.style.width = textWidth;

const lottieAnimations = {
    Clouds: {
        src: "https://lottie.host/fd511404-6a88-419d-8ed4-3e55872590a1/plJiZyWa0n.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px;",
    },
    Thunderstorm: {
        src: "https://lottie.host/cfdd9e91-bf01-4ef0-9249-863a6fecbb5c/Oz5PoSqkXx.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    },
    Drizzle: {
        src: "https://lottie.host/d920ae0a-bf77-4194-a508-a76a26ef851f/wtOTcrKNxQ.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    },
    Rain: {
        src: "https://lottie.host/d920ae0a-bf77-4194-a508-a76a26ef851f/wtOTcrKNxQ.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    },
    Snow: {
        src: "https://lottie.host/ca0720ff-2335-4a77-a61a-9571fd63acb9/8mEIGuToGq.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    },
    Mist: {
        src: "https://lottie.host/d920ae0a-bf77-4194-a508-a76a26ef851f/wtOTcrKNxQ.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    },
    Clear: {
        src: "https://lottie.host/e2791903-21fc-4b74-81c1-779c69d3368f/DS8qzBAuEf.json",
        background: "transparent",
        speed: "2",
        style: "width: 250px; height: 150px",
    }
}

const displayWeather = function() {
    weatherContainer.classList.add("hidden");
    conditionContainer.innerHTML = "";

    const containerArray = {
        temp: {
            container: tempContainer,
            icon: "ph-thermometer",
            data: `${Math.round(weatherData.main.temp)}°F`,
        },
        wind: {
            container: windContainer,
            icon: "ph-wind",
            data: `${weatherData.wind.speed}mph`,
        },
        humidity: {
            container: humidityContainer,
            icon: "ph-drop-simple",
            data: `${weatherData.main.humidity}%`,
        },
        feelsLike: {
            container: feelsLikeContainer,
            icon: "ph-waves",
            data: `${Math.round(weatherData.main.feels_like)}°F`,
        }
    };

    // Clear previous content in each container
    for (const key in containerArray) {
        containerArray[key].container.innerHTML = "";
    }

    // Set the location
    locationHeading.innerText = `${weatherData.name}`;

    let humidityDescription = document.createElement("div");
    humidityDescription.innerText = "Humidity";
    humidityDescription.classList.add("flex");
    humidityDescription.classList.add("flex-row-reverse");
    humidityDescription.classList.add("gap-2");
    humidityContainer.appendChild(humidityDescription);

    let feelsLikeDescription = document.createElement("div");
    feelsLikeDescription.innerText = "Feels Like";
    feelsLikeDescription.classList.add("flex");
    feelsLikeDescription.classList.add("flex-row-reverse");
    feelsLikeDescription.classList.add("gap-2");
    feelsLikeContainer.appendChild(feelsLikeDescription);

    // Loop through each item in containerArray and populate it
    for (const key in containerArray) {
        const item = containerArray[key];

        let newWeatherElement = document.createElement('p');
        let newIconElement = document.createElement('i');

        newIconElement.classList.add(iconClass); // Add the correct icon class here
        newIconElement.classList.add(item.icon);
        newIconElement.style.fontSize = iconSize; // Adjust font size as needed

        newWeatherElement.innerText = item.data;

        if (key == "humidity") {
            humidityDescription.appendChild(newIconElement);
        } else if (key == "feelsLike") {
            feelsLikeDescription.appendChild(newIconElement);
        } else {
            item.container.appendChild(newIconElement);
        }

        item.container.appendChild(newWeatherElement);
    }

    let conditionObject = lottieAnimations[weatherData.weather[0].main];

    let lottiePlayer = document.createElement("dotlottie-player");

    for (const item in conditionObject) {
        lottiePlayer.setAttribute(item, conditionObject[item]);
    }
    lottiePlayer.setAttribute("loop", "");
    lottiePlayer.setAttribute("autoplay", "");
    conditionContainer.appendChild(lottiePlayer);

    // Show the weather container
    weatherContainer.classList.add("grid");
    weatherContainer.classList.remove("hidden");
}

const fetchWeather = function(value) {
    // Check if the value is a number (for zip code)
    if (!isNaN(value) && value.trim() !== "") {
        // Zip code search
        let url = `${WEATHER_API_ENDPOINT}zip=${value},US&appid=${API_KEY}&units=imperial`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                weatherData = data;
                console.log(weatherData); // Log weatherData
            })
            .then(() => displayWeather())
            .catch(error => {
                console.error("Error fetching weather data:", error)
                tempContainer.innerHTML = "";
                windContainer.innerHTML = "";
                conditionContainer.innerHTML = "";
                locationHeading.innerText = "Please Enter a Valid City or Zip Code";
            });
    } else {
        // City name search
        let url = `${WEATHER_API_ENDPOINT}q=${value},US&appid=${API_KEY}&units=imperial`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                weatherData = data;
                console.log(weatherData); // Log weatherData
            })
            .then(() => displayWeather())
            .catch(error => {
                console.error("Error fetching weather data:", error)
                tempContainer.innerHTML = "";
                windContainer.innerHTML = "";
                conditionContainer.innerHTML = "";
                locationHeading.innerText = "Please Enter a Valid City or Zip Code";
            });
    }
}

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cityOrZip = searchInput.value;
    fetchWeather(cityOrZip);
});
