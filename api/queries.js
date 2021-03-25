const Pool = require('pg').Pool
const tools = require('./tools')

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.PASS,
  port: process.env.PORT,
})

 const getGeoReports = (request, response) => {
    // react-native-maps: getMapBoundaries -> {northEast: LatLng, southWest: LatLng}
    const { NElat, NElong, NWlat, NWlong,
       SElat, SElong, SWlat, SWlong, error } = tools.checkandcalccoords(request)
    
    if (error){
      response.status(400).json(error)
    }
  
    if (_radius != null && _latitude != null && _longitude != null) {
      pool.query('TODO', [], (error, results) => {
        if (error) {
          response.status(404).json(error)
        }
        else {
          response.status(200).json(results)
        }
        
      })
    }
  }
  


 const createReport = (request, response) => {
    const { report_id, user_id, characteristic, coordinates,
      description, location, uploadTime, photo } = request.body
  
    pool.query('INSERT INTO reports (report_id, user_id,\
       characteristic, coordinates, description,\
        location, uploadTime, photo) VALUES\
         ($1, $2, $3, $4, $5, $6, $7, $8)',
          [report_id, user_id, characteristic, coordinates,
             description, location, uploadTime, photo], (error, results) => {
        if (error) {
          response.status(409).json(error)
        }
        else {
          response.status(201).send(`Report added with ID: ${results}`)
        }
        
      })
  }
  
 const updateReport = (request, response) => {
    const id = parseInt(request.params.id)
    const { report_id, user_id, characteristic, coordinates,
      description, location, uploadTime, photo } = request.body

    pool.query(
      'UPDATE reports SET user_id = $1, characteristic = $2, coordinates = $3,\
       description = $4, location = $5, uploadTime = $6, photo = $7 WHERE \
       report_id = $8',
        [user_id, characteristic, coordinates,
        description, location, uploadTime, photo, report_id],
      (error, results) => {
        if (error) {
          response.status(404).json(error)
        }
        else {
          response.status(200).send(`Report modified with ID: ${id}`)
        }
        
      }
    )
  }
  
 const getReportById = (request, response) => {
  if (tools.checkuuid(request.params.id) == false){
    response.status(400).json('bad uuid format')
  }
    pool.query('SELECT * FROM reports WHERE report_id = $1',
     [request.params.id], (error, results) => {
      if (error) {
        response.status(404).json(error)
      }
      else {
        response.status(200).json(results.rows)
      }
      
      
    })
  }
  
 const deleteReport = (request, response) => {
  
    pool.query('DELETE FROM reports WHERE report_id = $1',
     [request.params.id], (error, results) => {
      if (error) {
        response.status(404).json(error)
      }
      else {
        response.status(204).send(`Report deleted with ID: ${id}`)
      }
      
  
    })
  }
 const getUserById = (request, response) => {
    if (tools.checkuuid(request.params.id) == false){
      response.status(400).json('bad uuid format')
    }
    else {
      pool.query('SELECT * FROM users WHERE user_id = $1', [request.params.id], (error, results) => {
        if (error) {
          response.status(404).json(error)
        }
        else{
          response.status(200).json(results.rows)
        }
        
      })
    }
    
  }
  
 const createUser = (request, response) => {
    const { username, email, password } = request.body
  
    pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id', [username, email, password], (error, results) => {
      if (error) {
        response.status(400).json(error)
      }
      response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
    })
  }

  module.exports = {
    getGeoReports,
    getUserById,
    getReportById,
    createUser,
    createReport,
    updateReport,
    deleteReport,
  }