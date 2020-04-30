// Fetch API is a modern browser API, not a javascript API
const getForecast = (address, callback) => {
    const url = `/weather?address=${address}`;
    fetch(url).then((data) => {
        data.json().then((weather) => {
            if(weather.error){
                callback(weather.error);
            } else {
                callback(undefined, weather)
            }
        })
    }).catch((error) => {
        callback(`error on fetching data, check the url${error}`) 
    })
}

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    // Do nothing after the submit instead of refreshing due its default behaviour   
    e.preventDefault()
    const location = search.value
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    getForecast(location, (error, data) => {
        if(error) {
            return messageOne.textContent = error
        }
        const {current, place_name : locationAddress} = data
        const {temp: temperature, weather, datetime} = current
        const {description} = weather[0]
        const message = `For ${locationAddress}, it is ${temperature} °C actually, in general it is ${description}`
        messageOne.textContent = ''
        messageTwo.textContent = message
    })
})
