// LOAD ENV VARIABLES
// require('dotenv').config({ silent: true })
// console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
//Set Port
const PORT = process.env.PORT || 8000


const app = require('./app')
const http = require('http')
const server = http.createServer(app)


// SERVER LISTEN
server.listen(PORT, err => {
  console.log(err || `Express listening on port ${PORT}`)
});

module.exports = server


