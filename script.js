document.addEventListener("DOMContentLoaded", function () {
  const changeCityBtn = document.getElementById("changeCityBtn");
  const cityName = document.getElementById("cityName");
  const temperature = document.getElementById("temperature");
  const weatherDescription = document.getElementById("weatherDescription");
  const weatherIcon = document.getElementById("weatherIcon");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("windSpeed");
  const videoContainer = document.getElementById("videoContainer");
  const backgroundVideo = document.getElementById("backgroundVideo");

  async function fetchWeather(city) {
    const apiKey = "51a2bb139dd17115875db04cc203c141"; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        cityName.textContent = `Weather in ${data.name}`;
        temperature.textContent = `Temperature: ${data.main.temp.toFixed(2)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeed.textContent = `Wind speed: ${data.wind.speed} km/h`;

        changeBackground(data.weather[0].main);
      } else {
        alert("City not found");
      }
    } catch (error) {
      alert("Error fetching weather data");
    }
  }

  function changeBackground(weather) {
    let videoSrc = "";

    switch (true) {
      case weather.includes("Clouds"):
        videoSrc = "./Videos/cloudy.mp4";
        break;
      case weather.includes("Clear"):
        videoSrc = "./Videos/clearSky.mp4";
        break;
      case weather.includes("Rain"):
        videoSrc = "./Videos/rain.mp4";
        break;
      case weather.includes("Snow"):
        videoSrc = "./Videos/snowing.mp4";
        break;
      case weather.includes("Thunderstorm"):
        videoSrc = "./Videos/thunderstorm.mp4";
        break;
    }

    const newVideoElement = document.createElement("video");
    newVideoElement.setAttribute("autoplay", true);
    newVideoElement.setAttribute("loop", true);
    newVideoElement.setAttribute("muted", true);
    newVideoElement.style.filter = "brightness(60%)";

    const newSourceElement = document.createElement("source");
    newSourceElement.setAttribute("src", videoSrc);
    newSourceElement.setAttribute("type", "video/mp4");

    newVideoElement.appendChild(newSourceElement);

    // Replace the old video with the new one
    videoContainer.innerHTML = "";
    videoContainer.appendChild(newVideoElement);
  }

  async function getCurrentCity() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const city = data.address.city || data.address.town;

        if (city) {
          fetchWeather(city);
        } else {
          alert("Unable to determine your city.");
        }
      });
    } else {
      alert("Geolocation is not available in your browser.");
    }
  }

  changeCityBtn.addEventListener("click", function () {
    const newCity = document.getElementById("newCity").value;
    if (newCity) {
      fetchWeather(newCity);
    }
  });

  // Initial fetch for the user's current location
  getCurrentCity();
});
