//HTML Elements
const inputBox = document.querySelector('.input-box');
const searchBtn = document.querySelector('.search-btn');
const dropdown = document.querySelector(".dropdown");
const heading = document.querySelector(".heading");
const welcomePara = document.querySelector('.welcome-para');
const loadingIcon = document.querySelector('.loading-icon');
const container = document.querySelector(".container");
const weatherInfo = document.querySelector(".weather-info");
const infoContainer = document.querySelector(".info-container");
const airQualityInfo = document.querySelector(".air-quality-info");
const pageLinks = document.querySelectorAll("a");

		let savedUnit = localStorage.getItem('tempunit');
	if(savedUnit){
		dropdown.value = savedUnit
	};

	let savedcity = localStorage.getItem('input-city');
	if(savedcity){
		inputBox.value = savedcity
	};


pageLinks.forEach(link => {
	if(link.classList.contains('active-page')){
		link.removeAttribute('href');
	};
});



infoContainer.classList.add('hidden');
loadingIcon.classList.add('hidden');

//weather images initialzation
const cloudy = 'cloudy (1).png';
const semiCloudy = 'sunny-cloudy.png';
const rainy = 'rainy-day.png';
const sunny = 'sunny.png';
const snowy = 'snowy.png';


//time function
function formatTime(timeString) {
	if(!timeString) return "N/A"

    const timeOnly = timeString.split('T')[1]; 
    let [hours, minutes] = timeOnly.split(':');
    
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
}

async function hourlyWeather(){
	infoContainer.classList.add('hidden');
    loadingIcon.classList.remove('hidden'); 

	const geoUrl = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputBox.value}&count=1`);
		const geoData = await geoUrl.json();

		try{
		
		const { latitude, longitude, name, country } = geoData.results[0];	


//air quality API initialization

	const airRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,us_aqi`);
	const airData = await airRes.json();

//weather API initialization 

		const WeatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1`);
        const weatherData	= await WeatherRes.json();

//Functionality
		container.innerHTML = ""

        for(let i = 0; i <= 23; i++){

			//weather functionality initialization 
			let time = weatherData.hourly.time[i];
			let formatedTime = formatTime(time);
			let  rawTemperature = `${weatherData.hourly.temperature_2m[i]}`;
			let speedOfWind = `${weatherData.current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m}`;

			const hourlySelect = document.createElement('div');
			hourlySelect.classList.add('hourly-select-div');
			container.append(hourlySelect);

		  if(dropdown.value === 'Fahrenheit'){
                    rawTemperature = (rawTemperature * 1.8) + 32;
                    
	        } else {
                     rawTemperature;
	        }
            const tempUnit = dropdown.value === "Fahrenheit" ? "°F" : "°C";
			let temperature = `${Math.round(rawTemperature)}${tempUnit}`;

			const hourlyTime = document.createElement('p');
			hourlyTime.classList.add('time');
			hourlyTime.textContent = formatedTime;
			hourlySelect.append(hourlyTime);

			const hourlyImg = document.createElement('img');
			hourlyImg.classList.add('img-icon');
			hourlySelect.append(hourlyImg);


			const code = weatherData.hourly.weather_code[i];


		   if (code === 0) {
			hourlyImg.src = sunny;
		} else if (code >= 1 && code <= 3) {
			hourlyImg.src = semiCloudy;
		} else if (code >= 51 && code <= 67 || code >= 80) {
			hourlyImg.src = rainy;
		} else if (code >= 71 && code <= 77) {
			hourlyImg.src = snowy;
		} else {
			hourlyImg.src = cloudy;
		}



		//air quality functionality initialization 
		 let aqiVal = `${airData.hourly.us_aqi[i]} ${airData.hourly_units.us_aqi}`;
		 let pm25Val = `${airData.hourly.pm2_5[i]}  ${airData.hourly_units.pm2_5}`;
		 let no2Val = `${airData.hourly.nitrogen_dioxide[i]} ${airData.hourly_units.nitrogen_dioxide}`;
		 let pm10Val = `${airData.hourly.pm10[i]} ${airData.hourly_units.pm10}`;
		 let ozoneVal = `${airData.hourly.ozone[i]} ${airData.hourly_units.ozone}`;


		function innerfun(){
			//weather functionality
			weatherInfo.innerHTML = ''

			const weatherImg = document.createElement("img");
			weatherImg.classList.add('weather-img-icon');
			weatherImg.src = hourlyImg.src;
			weatherInfo.append(weatherImg);

			const hourlytemp = document.createElement('p');
			hourlytemp.classList.add('info-temp-val');
			hourlytemp.textContent = temperature;
			weatherInfo.append(hourlytemp);

			const timeInfo = document.createElement('p');
			timeInfo.classList.add('time-info');
			timeInfo.textContent = `time: ${formatedTime}`;
			weatherInfo.append(timeInfo);

			
			const infoCity = document.createElement('p');
			infoCity.classList.add('info-city-name');
			infoCity.textContent = `Location: ${name}`;
			weatherInfo.append(infoCity);

			const windSpeed = document.createElement('p');
			windSpeed.classList.add('wind-speed-info');
			windSpeed.textContent = `Current wind-speed: ${speedOfWind}`;
			weatherInfo.append(windSpeed);


			//air quality functionality
			airQualityInfo.innerHTML = "<img class='air-img-icon' src='air-quality.png'></img>";
			 
			const aqi = document.createElement('p');
			aqi.classList.add('aqi-val');
			aqi.textContent = `AQI: ${aqiVal}`;
			airQualityInfo.append(aqi); 

			const pm25 = document.createElement('p');
			pm25.classList.add('pm25-val');
			pm25.textContent = `PM25: ${pm25Val}`;
			airQualityInfo.append(pm25);

			const pm10 = document.createElement('p');
			pm10.classList.add('pm10-val');
			pm10.textContent = `PM10: ${pm10Val}`;
			airQualityInfo.append(pm10);

			const ozone = document.createElement('p');
			ozone.classList.add('ozone-val');
			ozone.textContent = `OZONE: ${ozoneVal}`;
			airQualityInfo.append(ozone);

			const nO2 = document.createElement('p');
			nO2.classList.add('no2-val');
			nO2.textContent = `NO2: ${no2Val}`;
			airQualityInfo.append(nO2);
		}

		hourlySelect.addEventListener('click', ()=>{
			infoContainer.classList.remove('hidden');
			innerfun();
			infoContainer.classList.add('translateY-animation');
		})	
		}

		heading.textContent = `weather in ${name}`;

	} catch (error) {
		if (!geoData.results) {
			alert("city not found");
			location.reload();
		} else{
        console.log(error);
		alert("Something went wrong. Please try refreshing the page")
		}
    }
}

async function showResults(){
    welcomePara.classList.add('hidden');
	container.innerHTML = '<div class="loading-icon"></div>'

    try {
        await hourlyWeather();
    } finally {
        loadingIcon.classList.add('hidden');
    }	
}
searchBtn.addEventListener("click", ()=>{
	if (inputBox.value === ""){
		alert("please enter a city")
	} else{
		localStorage.setItem('input-city', inputBox.value)
		showResults();
	}
});


inputBox.addEventListener('keydown', (e) => {
	if(e.key == 'Enter'){
	if (inputBox.value === ""){
		alert("please enter a city")
	} else{
		localStorage.setItem('input-city', inputBox.value)
		showResults();
	}
  }
});


dropdown.addEventListener('change', () => {
	localStorage.setItem('tempunit', dropdown.value);	
});

