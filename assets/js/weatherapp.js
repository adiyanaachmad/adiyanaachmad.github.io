document.addEventListener("DOMContentLoaded", function () {
    // Ambil elemen tombol dan container
    const navNotification = document.querySelector(".nav-notification");
    const containerWeather = document.querySelector(".container-weather");
    const closeContainer = document.querySelector(".close-container");

    // Pastikan elemen ditemukan sebelum menjalankan kode
    if (!navNotification || !containerWeather || !closeContainer) {
        console.error("Elemen tidak ditemukan! Periksa HTML.");
        return;
    }

    // Tambahkan event listener untuk membuka container
    navNotification.addEventListener("click", function () {
        containerWeather.classList.add("open"); // Tambahkan class untuk membuka
    });

    // Tambahkan event listener untuk menutup container
    closeContainer.addEventListener("click", function () {
        containerWeather.classList.remove("open"); // Hapus class untuk menutup
    });
});



 const searchInput = document.querySelector(".search-input");
 const currentWeatherDiv = document.querySelector(".current-weather");
 const hourlyWeatherDiv = document.querySelector(".hourly-weather .weather-list");
 const locationButton = document.querySelector(".location-button");
 const locationNameEl = document.querySelector(".country-txt"); // Ambil elemen nama kota
 const currentDateEl = document.querySelector(".current-date-txt"); // Ambil elemen tanggal
 const cloud = document.querySelector(".clouds");
 const humidity = document.querySelector(".humidity");
 const pressure = document.querySelector(".pressure");
 const inputWrapper = document.querySelector(".input-wrapper");
 const clearBtn = document.querySelector(".clear-btn");

 // Tampilkan tombol clear hanya jika input memiliki teks
 searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
       inputWrapper.classList.add("show-clear");
    } else {
       inputWrapper.classList.remove("show-clear");
    }
 });

 // Hapus teks pada input saat tombol clear diklik
 clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    inputWrapper.classList.remove("show-clear");
    searchInput.focus(); // Fokuskan kembali ke input
 });

 const API_KEY = "c2e9c10120434557b9b122239241708";

 const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1672, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
 };

 const formatDate = (dateString) => {
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return new Date(dateString).toLocaleDateString("en-US", options);
 };

 const displayHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    const next24HoursData = hourlyData.filter(({ time }) => {
       const forecastTime = new Date(time).getTime();
       return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
       const temperature = Math.floor(item.temp_c);
       const time = item.time.split(" ")[1].substring(0, 5);
       const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code)) || "default";

       return `<li class="weather-item">
                   <p class="time">${time}</p>
                   <img src="assets/img/${weatherIcon}.svg" class="weather-icon" alt="">
                   <p class="temperatur">${temperature}°</p>
                </li>`;
    }).join("");
 };

 const showInitialScreen = () => {
    document.body.classList.add("show-no-search");
 };

 const hideInitialScreen = () => {
    document.body.classList.remove("show-no-search");
 };

 window.addEventListener("DOMContentLoaded", () => {
    showInitialScreen();
 });

 const displayConditionalData = (data) => {
    const cloud = data.current?.cloud ?? "--";
    const humidity = data.current?.humidity ?? "--";
    const pressure = data.current?.pressure_mb ?? "--";

    const conditionalContainer = document.querySelector(".conditional-container ul");
    if (conditionalContainer) { // Pastikan elemen ada sebelum mengubah isinya
       conditionalContainer.innerHTML = `
       <li>
          <span>Clouds</span>
          <div><i class="fa-solid fa-cloud"></i></div>
          <span>${cloud}</span>% <!-- Persentase awan -->
       </li>
       <li>
          <span>Humidity</span>
          <div><i class="fa-solid fa-droplet"></i></div>
          <span>${humidity}</span>% <!-- Persentase kelembapan -->
       </li>
       <li>
          <span>Pressure</span>
          <div><i class="fa-solid fa-gauge"></i></div>
          <span>${pressure}</span> hPa <!-- Tekanan udara dalam hPa -->
       </li>
    `;
    } else {
       console.error("Conditional container not found in the DOM.");
    }
 };

 const displayWind = (data) => {
    // Pastikan data tersedia dan memiliki properti yang diperlukan
    if (data && data.forecast && data.forecast.forecastday && data.forecast.forecastday[0].day) {
       const windSpeed = data.forecast.forecastday[0].day.maxwind_kph || 0; // Ambil kecepatan angin maksimal (dalam kph)
       const windSpeedText = `${windSpeed} km/h`; // Format teks kecepatan angin
       return windSpeedText;
    } else {
       console.error("Wind data not found in the provided object.");
       return "-- km/h"; // Nilai default jika data tidak ditemukan
    }
 };

 const displaySunriseSunset = (data) => {
    // Ambil elemen sunrise-sunset-container
    const sunriseSunsetContainer = document.querySelector(".sunrise-sunset-container ul");

    // Pastikan elemen ada sebelum mengubah isinya
    if (sunriseSunsetContainer) {
       const sunriseTime = data.forecast.forecastday[0].astro.sunrise || "--:--";
       const sunsetTime = data.forecast.forecastday[0].astro.sunset || "--:--";
       const windSpeedText = displayWind(data);

       // Isi ulang data Sunrise dan Sunset
       sunriseSunsetContainer.innerHTML = `
       <li>
          <span>Sunrise</span>
          <div>
             <i class="fa-solid fa-sun-haze"></i>
          </div>
          <span>${sunriseTime}</span>
       </li>
       <li>
          <span>Wind</span>
          <div>
             <i class="fa-solid fa-wind"></i>
          </div>
          <span>${windSpeedText}</span>
       </li>
       <li>
          <span>Sunset</span>
          <div>
             <i class="fa-duotone fa-solid fa-sun-haze"></i>
          </div>
          <span>${sunsetTime}</span>
       </li>
    `;
    } else {
       console.error("Sunrise and Sunset container not found in the DOM.");
    }
 };


 const getWeatherDetails = async (API_URL) => {
    // Pastikan class "no-search" dan "no-results" sesuai dengan kondisi
    document.body.classList.remove("show-no-search");
    document.body.classList.remove("show-no-results");

    try {
       const response = await fetch(API_URL);
       if (!response.ok) {
          throw new Error("City not found");
       }

       const data = await response.json();

       // Set nama kota
       locationNameEl.innerText = data.location.name || "Unknown";

       // Set tanggal real-time
       currentDateEl.innerText = formatDate(data.location.localtime);

       // Panggil fungsi ini untuk menampilkan conditional data
       displayConditionalData(data);

       displaySunriseSunset(data);

       const temperature = Math.floor(data.current?.temp_c || 0);
       const description = data.current?.condition?.text || "Unknown";
       const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current?.condition?.code)) || "default";

       currentWeatherDiv.querySelector(".weather-icon").src = `assets/img/${weatherIcon}.svg`;
       currentWeatherDiv.querySelector(".temperatur").innerHTML = `${temperature}<sup>°C</sup>`;
       currentWeatherDiv.querySelector(".description").innerText = description;

       const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
       displayHourlyForecast(combinedHourlyData);

       // Set nilai input untuk kota yang valid
       searchInput.value = data.location.name;

    } catch (error) {
       // Jika terjadi error, tampilkan tampilan "no-results"
       document.body.classList.add("show-no-results");
    }
 };

 const setupWeatherRequest = (cityName) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName},&days=2`;
    getWeatherDetails(API_URL);
 };

 searchInput.addEventListener("keyup", (e) => {
    const cityName = searchInput.value.trim();

    if (e.key === "Enter" && cityName) {
       setupWeatherRequest(cityName);
    }
 });

 // Ketika aplikasi pertama kali dibuka
 document.body.classList.add("show-no-search");

 // Event listener pada pencarian
 searchInput.addEventListener("keyup", (e) => {
    const cityName = searchInput.value.trim();

    if (e.key === "Enter" && cityName) {
       document.body.classList.remove("show-no-search"); // Hilangkan tampilan awal no-search
       setupWeatherRequest(cityName);
    }
 });

 // Event listener pada tombol lokasi
 locationButton.addEventListener("click", () => {
    document.body.classList.remove("show-no-search"); // Hilangkan tampilan awal no-search

    navigator.geolocation.getCurrentPosition(position => {
       const { latitude, longitude } = position.coords;
       const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
       getWeatherDetails(API_URL);
    }, error => {
       alert("Location access denied, Please enable permissions to use this feature.");
    });
 });