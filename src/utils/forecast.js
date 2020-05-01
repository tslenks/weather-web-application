const request = require('request')
const forecast = (latitude, longitude, callback) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=fe2b0352ea9e98fffea158225de38180&units=metric&lang=en`;
    request.get({url, json:true}, (error, response) => {
        if(!response || response === null || response === undefined){
            callback('Unable to connect to the server')   
        } else if (response.body.cod === '400') {
            const {message} = response.body
            callback(message);   
        } else {
            const {current, daily} = response.body    
            const datetime = current.dt
            callback(undefined, {current, datetime, daily})            
        }       
    })    
}

module.exports = forecast