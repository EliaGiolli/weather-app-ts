const apiBtn = document.getElementById("apiBtn") as HTMLButtonElement;
const apiInput = document.getElementById("apiInput") as HTMLInputElement;
const apiDiv = document.getElementById("apiDiv") as HTMLDivElement;

apiBtn.addEventListener('click', async () =>{

    //First validation check: invalid city name
    const city = apiInput.value.trim();
    if(!city){
       apiDiv.innerText = "Type in a valid city name"
        return;
    }

    
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=it`
            );   
        const cityData = await response.json();
        console.log(cityData.results);
            //Second error validation: HTTP error
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

            //Third validation check: no valid city returned
        if(!cityData.results || cityData.results.lenght === 0){
            apiDiv.innerText="City not found";
            return;
        }
        //fetching latitude and longitude
        const { latitude, longitude } = cityData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Rome`
        );
        const weatherData = await weatherResponse.json();

        //fetching temperature and weathercode
        const { temperature, weathercode } = weatherData.current_weather;

        apiDiv.innerHTML= `
            <p class="p-2 my-2 bg-sky-200  text-zinc-500 font-semibold rounded-xl">Temperature: ${temperature}</p>
            <p class="p-2 my-2 bg-sky-200 text-zinc-500 font-semibold rounded-xl">Weather condition: ${getWeatherConditions(weathercode)}</p>          
        
        `;
    } catch (error) {
        console.error("error during fetching data")
    }
})

function getWeatherConditions(code:number):string{
    const descriptions: {[key: number]:string} ={
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog with rime",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Severe thunderstorm with hail",
    }
    return descriptions[code] || "Unknown weather condition";
}