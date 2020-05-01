// This file is the entry point of the application 
const hbs = require('hbs') // handlebars specific for express
const path = require('path') // core node module
const express = require('express') // single function
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')
const converdate = require('./utils/convertdate.js')

// no argument, config the server
const app = express() 

// port
const port = process.env.PORT || 3000

// Change the views of express for its default views folder
app.set('views', path.join(__dirname, '../templates/views'))

// Configure the templating. The view engine is a special property for express to define if we used an template for rendering html,
// we use hbs templating
app.set('view engine', 'hbs')

// Set up partials
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)

// setup assets directory to serves so the browser search in this directory
const publicDirectoryPath = path.join(__dirname, '../public');
const url = express.static(path.join(publicDirectoryPath))
app.use(url)

// Because we use hbs template, we need actually to get the response of the requesting url and then send back the template file
// in the user browser
app.get('', (req, res) => { 
    // It is like in java, we send to the render file the variables that we need to display
    // then into the destination file :  we put {{ variable_name }}
    res.render('index', {
        title:' Weather 1.0',
        description:'Application for forecasting weather',
        author:'Tslenks'
    }) 
}) // no need to specify the extension and the name must match with the file name

// About
app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About',
        description: 'This app is about Weather application for learning node js',
        src: '/images/photo.jpg',
        author: 'Tslenks'
    })
})

// Help
app.get('/help',(req, res) => {
    res.render('help', {
        title:'Help',
        description: 'Weather 1.1 : This app is about Weather application for learning node js',    
        author: 'Tslenks'            
    })
})

// Express queryString <=> url => ?param1=val1&param2=val2&... <=> it is the GET URL
app.get('/products',(req, res) => {
    console.log(req.query)
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
       products:[]
    })
})

// Express and query string
app.get('/weather',(req, res) => {
    const { query } = req;
    const { address } = query
    
    if(!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(address, (error, geocodeResponse) => {
        if(!geocodeResponse || geocodeResponse.error || error) {
            const connexionError = !geocodeResponse ? 'Not available :: Check your connection' : geocodeResponse.error
            return res.send({ error :  error ? error : connexionError })
        }
        const {place_name, latitude, longitude} = geocodeResponse
        forecast(latitude, longitude, (forecastError, {daily, current, datetime}) => {
            if(forecastError) { return res.send({ error: forecastError}) }
            res.send({
                place_name,
                current,
                datetime,
                daily
            })
        })
    })
})

/** THE ERROR SHOULD BE IN BOTTOM OF THE PAGE TO LET EXPRESS FIND ALL THE AVAILABLES PATTERN **/
app.get('/help/*', (req, res) => {
    res.render('error-404', {
        message: 'This help article not found',
        author:'Tslenks'
    })
})

app.get('*', (req, res) => {
    res.render('error-404', {
        message: 'This article not found',
        author:'Tslenks'
    })
})

// Set the port to see the application running through the browser
app.listen(port, ()=> {  console.log(`the app is running in ${port} port`) })
