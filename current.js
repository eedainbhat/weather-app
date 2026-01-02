//HTML Elements
const body = document.querySelector("body");
const container = document.querySelector(".container");
const inputBox = document.querySelector('.input-box');
const searchBtn = document.querySelector('.search-btn');
const imgIcon = document.querySelector('.img-icon');
const tempVal = document.querySelector('.temp-val');
const city = document.querySelector('.city');
const table = document.querySelector(".table");
const windPara = document.querySelector('.wind-para');
const tempImg = document.querySelector(".temp-img");
const windImg = document.querySelector(".wind-img");
const loadIcon = document.querySelector(".loading-icon");
const welcomePara = document.querySelector(".welcome");
const popCity = document.querySelectorAll(".pop-city");
const popTemp = document.querySelectorAll(".pop-temp");
const popWind = document.querySelectorAll(".pop-wind");
const popDay = document.querySelectorAll(".pop-day");
const dropdown = document.querySelector(".dropdown");
const pageLinks = document.querySelectorAll("a");
const editPopBtn = document.querySelector(".pop-cities-set");
let isEditing = false;


//localStorage data fetching
let savedUnit = localStorage.getItem('tempunit');
if (savedUnit) {
	dropdown.value = savedUnit
};

let savedcity = localStorage.getItem('input-city');
if (savedcity) {
	inputBox.value = savedcity
};

let savedFavCities = localStorage.getItem('fav-cities');
if (savedFavCities) {
	try{
	const cities = JSON.parse(savedFavCities)
	popCity.forEach((cell, index) => {
		if(cities[index]){
			cell.textContent = cities[index];
		}
	});
} catch(error){
	console.log(error);
	localStorage.removeItem('fav-cities');
}

};

//anchor tags functionalty
pageLinks.forEach(link => {
	if (link.classList.contains('active-page')) {
		link.removeAttribute('href');
	};
});


//Popular cities functionality (API)
async function popFun(index, temp, wind, day) {
	const geoUrl = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${popCity[index].textContent}&count=1`);

	const geoUrlData = await geoUrl.json();
	
	if (!geoUrlData.results || geoUrlData.results.length === 0) {
    alert("City not found");
  
}
	const { latitude, longitude, name, country } = geoUrlData.results[0];

	const popWeatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
	const popWeatherData = await popWeatherRes.json();

	temp = `${popWeatherData.current_weather.temperature} ${popWeatherData.current_weather_units.temperature}`;
	popTemp[index].textContent = temp;

	wind = `${popWeatherData.current_weather.windspeed} ${popWeatherData.current_weather_units.windspeed}`;
	popWind[index].textContent = wind;

	day = `${popWeatherData.current_weather.is_day}`;
	if (day == 1) {
		popDay[index].textContent = 'day';
	} else if (day == 0) {
		popDay[index].textContent = 'night';
	}
};

popCity.forEach((popCity, index) => {
	popFun(index);
});


//edit popular cities finctionality
function editPopCitiesFun() {	
    isEditing = !isEditing; 

    if (isEditing) {
        editPopBtn.textContent = 'Save';
        popCity.forEach(cell => {
            cell.contentEditable = "true";
            cell.classList.add('table-editing-active');
        });
        const firstCell = popCity[0];
        firstCell.focus();
    } else {
        const cityNames = [];
        
        popCity.forEach((cell, index) => {
            cell.contentEditable = "false";
            cell.classList.remove('table-editing-active');
            
            const cleanText = cell.textContent.trim();
            cell.textContent = cleanText;
            
            cityNames.push(cleanText);
            popFun(index);
        });

        localStorage.setItem('fav-cities', JSON.stringify(cityNames));
        editPopBtn.textContent = 'Edit Favorite Cities';
    }
}

//Search weather functionaliy
//weather icons
const cloudy = 'cloudy (1).png';
const semiCloudy = 'sunny-cloudy.png';
const rainy = 'rainy-day.png';
const sunny = 'sunny.png';
const snowy = 'snowy.png';



loadIcon.classList.add("hidden");
tempVal.classList.add("hidden");
city.classList.add("hidden");
windPara.classList.add("hidden");
imgIcon.classList.add("hidden");
tempImg.classList.add("hidden");
windImg.classList.add("hidden");


let isfetching = false;


async function getWeather() {
	let value = inputBox.value;
	// Step 1: Get coordinates from city name
	const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=1`);

	const geoData = await geoRes.json();
	if (isfetching) return;
	isfetching = true;

	try {
		const { latitude, longitude, name, country } = geoData.results[0];

		// Step 2: Get weather from coordinates
		const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
		const weatherData = await weatherRes.json();


		const code = weatherData.current_weather.weathercode;

		if (code === 0) {
			imgIcon.src = sunny;
		} else if (code >= 1 && code <= 3) {
			imgIcon.src = semiCloudy;
		} else if (code >= 51 && code <= 67 || code >= 80) {
			imgIcon.src = rainy;
		} else if (code >= 71 && code <= 77) {
			imgIcon.src = snowy;
		} else {
			imgIcon.src = cloudy;
		}

		let rawTemperature = `${weatherData.current_weather.temperature}`;
		if (dropdown.value === 'Fahrenheit') {
			rawTemperature = (rawTemperature * 1.8) + 32;
		} else {
			rawTemperature = rawTemperature;
		}
		const tempUnit = dropdown.value === "Fahrenheit" ? "°F" : "°C";
		let temperature = `${Math.round(rawTemperature)}${tempUnit}`;


		tempVal.textContent = temperature
		let cityName = ` ${name}, ${country} `;
		city.textContent = cityName;
		let windInfo = `${weatherData.current_weather.windspeed}  ${weatherData.current_weather_units.windspeed}`;
		windPara.textContent = windInfo

	} catch (error) {
		if (!geoData.results) {
			alert("city not found");
			location.reload();
		} else {
			alert("Some Error occurred while fetching weather");
			loadIcon.classList.add("hidden");
			tempVal.classList.add("hidden");
			city.classList.add("hidden");
			windPara.classList.add("hidden");
			imgIcon.classList.add("hidden");
			tempImg.classList.add("hidden");
			windImg.classList.add("hidden");
			location.reload();
		}
	}
}


function searchFun() {
	welcomePara.classList.add("hidden");
	tempVal.classList.add("hidden");
	city.classList.add("hidden");
	windPara.classList.add("hidden");
	imgIcon.classList.add("hidden");
	tempImg.classList.add("hidden");
	windImg.classList.add("hidden");
	loadIcon.classList.remove("hidden");
};



async function finalFun() {
	await getWeather();
	loadIcon.classList.add("hidden");
	tempVal.classList.remove("hidden");
	city.classList.remove("hidden");
	windPara.classList.remove("hidden");
	imgIcon.classList.remove("hidden");
	tempImg.classList.remove("hidden");
	windImg.classList.remove("hidden");
}


// Usage:
searchBtn.addEventListener('click', () => {
	if (inputBox.value === "") {
		alert("please enter a city")
	} else {
		localStorage.setItem('input-city', inputBox.value);
		searchFun()
		finalFun();
	}
}
);

inputBox.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		if (inputBox.value === "") {
			alert("please enter a city")
		} else {
			localStorage.setItem('input-city', inputBox.value);
			searchFun()
			finalFun();
		}
	}
}
);


dropdown.addEventListener('change', () => {
	localStorage.setItem('tempunit', dropdown.value);
});

editPopBtn.addEventListener('click', () => {
	editPopCitiesFun();
});
