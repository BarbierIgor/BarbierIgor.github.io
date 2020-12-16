const _APIKEY = "bFIOY2ux014PCzNtwSCQJ5LObJDR2RZD7Zk77yww"
let lat = 0
let long = 0

let ozone = 0
let no2 = 0
let pm10 = 0
let pm25 = 0

let grassPollen = ""
let treePollen = ""
let weedPollen = ""

const getAQI = async (lat, long) => {
		const request = await fetch(`https://api.ambeedata.com/latest/by-lat-lng?lat=${lat}&lng=${long}`, {
        "method": "GET",
        "headers": {
            "x-api-key": _APIKEY,
            "Content-type": "application/json"
        }
    })
    const data = await request.json();
    showAqi(data.stations[0])
};

const getPollen = async (lat, long) => {
        const request = await fetch(`https://api.ambeedata.com/latest/pollen/by-lat-lng?lat=${lat}&lng=${long}`, {
        "method": "GET",
        "headers": {
            "x-api-key": _APIKEY,
            "Content-type": "application/json"
        }
    })
    const data = await request.json();
    if(data.data[0] != undefined){
        console.log(data.data[0].Risk)
        setPollen(data.data[0].Risk)
    }
};


const getLocation = function(){
    navigator.geolocation.getCurrentPosition(showLogPosition)
};

const showLogPosition = function(position){
    lat = position.coords.latitude
    long = position.coords.longitude
    console.log(`lat: ${lat}, long: ${long}`)
    getAQI(lat, long)
    getPollen(lat, long)
}

let showAqi = queryResponse => {
    var aqi = queryResponse.AQI
    var location = queryResponse.city
    var graden

    const needle = document.querySelector(".js-meter-arrow")
    const aqiText = document.querySelector(".js-aqi-text")
    const locationText = document.querySelector(".js-location-text")

    console.log(queryResponse)
    if(aqi <= 200){
        graden = aqi / 200  * 120
        needle.style.transform = `rotate(${graden}deg)`
    }
    else if(aqi > 200 && aqi <= 300){
        graden = ((aqi-200) / 100 * 30) + 120
        needle.style.transform = `rotate(${graden}deg)`
    }
    else if(aqi > 300){
        graden = ((aqi-300) / 200 * 30) + 150
        needle.style.transform = `rotate(${graden}deg)`
    }
    aqiText.innerHTML = `AQI: ${aqi}`
    ozone = queryResponse.OZONE
    no2 = queryResponse.NO2
    pm10 = queryResponse.PM10
    pm25 = queryResponse.PM25

    locationText.innerHTML = `Location: ${location}`
    showParticles()
    document.querySelector(".js-option-particles").addEventListener("click", showParticles)
}

let showParticles = function(){
    const dataText1 = document.querySelector(".js-data-text-1")
    const dataText2 = document.querySelector(".js-data-text-2")
    const dataText3 = document.querySelector(".js-data-text-3")
    const dataText4 = document.querySelector(".js-data-text-4")
    dataText1.innerHTML = `OZONE: ${ozone}ppb`
    dataText2.innerHTML = `NO2: ${no2}ppb`
    dataText3.innerHTML = `PM10: ${pm10}µg/m3`
    dataText4.innerHTML = `PM25: ${pm25}µg/m3`
}

let setPollen = queryResponse => {
    grassPollen = queryResponse.grass_pollen
    treePollen = queryResponse.tree_pollen
    weedPollen = queryResponse.weed_pollen
    document.querySelector(".js-option-pollen").addEventListener("click", showPollen)
}

let showPollen = function(){
    const dataText1 = document.querySelector(".js-data-text-1")
    const dataText2 = document.querySelector(".js-data-text-2")
    const dataText3 = document.querySelector(".js-data-text-3")
    const dataText4 = document.querySelector(".js-data-text-4")
    dataText1.innerHTML = `Tree pollen: ${treePollen}`
    dataText2.innerHTML = `Grass pollen: ${grassPollen}`
    dataText3.innerHTML = `Weed pollen: ${weedPollen}`
    dataText4.innerHTML = ""
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded")
    const aqiPage = document.querySelector(".js-app-aqi")

    if(aqiPage){
        getLocation()
        getPollen()
    }
});