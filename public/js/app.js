// Fetch API is a modern browser API, not a javascript API
const getForecast = (address, callback) => {
  const url = `/weather?address=${address}`;
  fetch(url).then((data) => {
    data.json().then((weather) => {
      if (weather.error) {
        callback(weather.error);
      } else {
        callback(undefined, weather);
      }
    });
  }).catch((error) => {
    callback(`error on fetching data, check the url${error}`);
  });
};

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (e) => {
  // Do nothing after the submit instead of refreshing due its default behaviour
  e.preventDefault();
  const location = search.value;
  messageOne.textContent = 'Loading...';
  messageTwo.textContent = '';
  getForecast(location, (error, data) => {
    if (error) {
      return messageOne.textContent = error;
    }
    const {
      current, place_name: locationAddress, datetime: currentdate, daily,
    } = data;

    messageOne.textContent = '';
    messageTwo.innerHTML = renderCurrentMeteo(current, currentdate, locationAddress, daily);
  });
});

function renderCurrentMeteo(current, currentdate, locationAddress, daily) {
  const {
    temp: temperature, weather, sunrise, sunset, clouds: cloudiness,
  } = current;

  let htmlrendering = '<div class="weather">';
  htmlrendering = `<h4> ${locationAddress} </h4>`;
  htmlrendering += templatingWeatherRender('current-weather', weather[0].description, currentdate, current.sunrise, current.sunset, cloudiness, temperature, current.visibility);

  daily.forEach((item, index) => {
    if (index > 0 && index < 3) {
      htmlrendering += templatingWeatherRender('future-days', item.weather[0].description, item.dt, item.sunrise, item.sunset, item.clouds, item.temp.day, item.visibility);
    }
  });

  htmlrendering += '</div>';

  return htmlrendering;
}

function templatingWeatherRender(cssClass, description, date, sunrisetimestamp, sunsettimestamp, cloudiness, temperature, visibility) {
  let html = `<div class="${cssClass}">`;
  html += `<p>
                ${cssClass === 'current-weather' ? 'Today' : 'For the '} ${convertTimestampToDate(date)} , the weather forecast will be: <br/> 
                <span class="description"> In general it will be <strong><i>${description}</i></strong></span><br/>
                <span class="sunrise"> <strong>Sunrise</strong> :  ${convertTimestampToDate(sunrisetimestamp)} </span><br/>
                <span class="sunset"> <strong>Sunset</strong> : ${convertTimestampToDate(sunsettimestamp)} </span><br/>
                <span class="clouds"> <strong>Percentage of clouds</strong> : ${cloudiness} </span><br/>
                <span class="temperature"><strong>Temperature</strong> : ${temperature} </span><br/>
                <span class="visibility"><strong>Visibility (meter)</strong> : ${visibility || '-'} </span>
            </p>`;
  html += '</div>';

  return html;
}

function convertTimestampToDate(timestampnumber, sep = '-', isMilliseconds = false) {
  if (!isMilliseconds) {
    timestampnumber *= 1000;
  }

  const date = new Date(timestampnumber);
  const year = date.getFullYear();
  const convertedMonth = parseInt(date.getMonth() + 1);
  const month = (`0${convertedMonth.toString()}`).substr(-2);
  const day = (`0${date.getDate()}`).substr(-2);
  const hour = (`0${date.getHours()}`).substr(-2);
  const minute = (`0${date.getMinutes()}`).substr(-2);
  const seconds = (`0${date.getSeconds()}`).substr(-2);

  return `${year + sep + month + sep + day} ${hour}:${minute}:${seconds}`;
}
