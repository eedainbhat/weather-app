//HTML Elements
const inputBox = document.querySelector('.input-box');
const searchBtn = document.querySelector('.search-btn');
const dropdown = document.querySelector(".dropdown");
const heading = document.querySelector(".heading");
const welcomePara = document.querySelector('.welcome-para');
const loadingIcon = document.querySelector('.loading-icon');
const container = document.querySelector(".container");
const infoContainer = document.querySelector(".info-container");
const airQualityInfo = document.querySelector(".air-quality-info");
const weatherInfo = document.querySelector(".weather-info");
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
const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDate(newDate){
   

    let date = new Date(newDate);
    let day = date.getDate();
    const month = months[date.getMonth()];

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${day}${suffix} ${month}`;
}

function formatTime(timeString) {
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


//air quality APIn initialization
	const airRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,us_aqi`);
	const airData = await airRes.json();

//weather API initialization 
		const WeatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`);
        const weatherData	= await WeatherRes.json();
        console.log(weatherData);


//Functionality
		container.innerHTML = ""

        for(let i = 0; i <= 6; i++){
			let noonIndex = 12 + (i * 24);

		//weather functionality initialization 
			const date = weatherData.daily.time[i];
			const formatedDate = formatDate(date);
			let  rawTemperature = `${weatherData.daily.temperature_2m_max[i]}`;
			let minTempVal = `${weatherData.daily.temperature_2m_min[i]}`;
			let uvIndexVal = `${weatherData.daily.uv_index_max[i]}`;


			const weeklySelect = document.createElement('div');
			weeklySelect.classList.add('weekly-select-div');
			container.append(weeklySelect);

                if(dropdown.value === 'Fahrenheit'){
                    rawTemperature = ((rawTemperature * 1.8) + 32);
					minTempVal = ((minTempVal * 1.8) + 32);
                    
	        } else {
                     rawTemperature;
					 minTempVal;
	        }

			const tempUnit = dropdown.value === "Fahrenheit" ? "°F" : "°C";
			let temperature = `${Math.round(rawTemperature)}${tempUnit}`;
			let minTemperature = `${Math.round(minTempVal)}${tempUnit}`;


			const weeklyDate = document.createElement('p');
			weeklyDate.classList.add('date');
			weeklyDate.textContent = formatedDate;
			weeklySelect.append(weeklyDate);

			const weeklyImg = document.createElement('img');
			weeklyImg.classList.add('img-icon');
			weeklySelect.append(weeklyImg);



            const code = weatherData.daily.weather_code[i];

					
if (code === 0) {
			weeklyImg.src = sunny;
		} else if (code >= 1 && code <= 3) {
			weeklyImg.src = semiCloudy;
		} else if (code >= 51 && code <= 67 || code >= 80) {
			weeklyImg.src = rainy;
		} else if (code >= 71 && code <= 77) {
			weeklyImg.src = snowy;
		} else {
			weeklyImg.src = cloudy;
		}



		//air quality functionality initialization
		 let aqiVal = `${airData.hourly.us_aqi[noonIndex]} ${airData.hourly_units.us_aqi}`;
		 let pm25Val = `${airData.hourly.pm2_5[noonIndex]}  ${airData.hourly_units.pm2_5}`;
		 let no2Val = `${airData.hourly.nitrogen_dioxide[noonIndex]} ${airData.hourly_units.nitrogen_dioxide}`;
		 let pm10Val = `${airData.hourly.pm10[noonIndex]} ${airData.hourly_units.pm10}`;
		 let ozoneVal = `${airData.hourly.ozone[noonIndex]} ${airData.hourly_units.ozone}`;


		 function innerfun(){
			//weather functionality
			weatherInfo.innerHTML = ''

			const weatherImg = document.createElement("img");
			weatherImg.classList.add('weather-img-icon');
			weatherImg.src = weeklyImg.src;
			weatherInfo.append(weatherImg);

			const weeklytemp = document.createElement('p');
			weeklytemp.classList.add('info-temp-val');
			weeklytemp.textContent = temperature;
			weatherInfo.append(weeklytemp);

			const minTemp = document.createElement('p');
			minTemp.classList.add('date-info');
			minTemp.textContent = `Min Temperature: ${minTemperature}`;
			weatherInfo.append(minTemp);

			const dateInfo = document.createElement('p');
			dateInfo.classList.add('date-info');
			dateInfo.textContent = `Date: ${formatedDate}`;
			weatherInfo.append(dateInfo);

			
			const infoCity = document.createElement('p');
			infoCity.classList.add('info-city-name');
			infoCity.textContent = `Location: ${name}`;
			weatherInfo.append(infoCity);

			const uvIndex = document.createElement('p');
			uvIndex.classList.add('uv-index-info');
			uvIndex.textContent = `UV Index: ${uvIndexVal}`;
			weatherInfo.append(uvIndex);


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

		weeklySelect.addEventListener('click', ()=>{
			infoContainer.classList.remove('hidden');
			innerfun()
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


//calling the functions
async function showResults(){
    welcomePara.classList.add('hidden');
	container.innerHTML = '<div class="loading-icon"></div>'

    try {
        await hourlyWeather();
    }  finally {
        loadingIcon.classList.add('hidden');
    }	
}
searchBtn.addEventListener("click", async()=>{
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

