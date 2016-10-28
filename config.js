const config = {
  db: {
    'production': process.env.MONGODB_URI,//on heroku
    'development': 'mongodb://localhost/property-manager',
    'test': 'mongodb://localhost/property-manager-test'
  }
}

module.exports = config