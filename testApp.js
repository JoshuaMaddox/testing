

// SET SERVER PORT
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/property-manager'

// REQUIRES
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//MONGOOSE CONFIG
const config = require('./config')
const NODE_ENV = process.env.NODE_ENV || 'development'
const DB_URI = config.db[NODE_ENV]
mongoose.Promise = Promise
mongoose.connect(DB_URI, err => {
  console.log(err || `MongoDB connected to ${DB_URI}`)
})

// process.env.NODE.ENV = 'development' / 'production' / 'test'

// APP DECLARATION
const app = express();

// GENERAL MIDDLEWARE
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('build'))

// ROUTES
app.use('/api', require('./routes/api'))

app.get('*', (req, res) => {
  let filepath = path.resolve('./build/index.html');
  res.sendFile(filepath);
});

module.exports = app
