const tools = require('./tools')


const getGeoReports = (request, response) => {
    // react-native-maps: getMapBoundaries -> {northEast: LatLng, southWest: LatLng}
    if (request.query.NElat == undefined ||
      request.query.NElong == undefined ||
      request.query.SWlat == undefined ||
      request.query.SWlong == undefined) {
      return response.status(400).json({ "error": 'Incorrect map data entered.' })
    }
  
    else {
      const { NElat, NElong, SWlat, SWlong } = request.query
      let prep = `SELECT * FROM reports WHERE (latitude BETWEEN ${SWlat} AND ${NElat}) AND ((${SWlong} < ${NElong}) AND longitude BETWEEN ${SWlong} AND ${NElong}) OR ((${NElong} < ${SWlong}) AND ((longitude BETWEEN ${SWlong} AND 180) OR (longitude BETWEEN -180 AND ${NElong})))`
      tools.pool.query(prep, (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length == 0)
            return response.status(404).json({ "error": 'No reports found.' })
  
          response.status(200).json({ "response": { "reports": results.rows } })
        }
  
      })
    }
  }
  
  const createReport = (request, response) => {
    if (request.body.user_id == undefined || request.body.characteristic == undefined || request.body.latitude == undefined ||
      request.body.longitude == undefined || request.body.description == undefined || request.body.location == undefined
      || request.body.uploadTime == undefined || request.body.photo == undefined) {
      return response.status(400).json({ "error": 'Invalid object received.' })
    } // ak je nezadaný description alebo photo, príde "-"
  
    const { user_id, characteristic, latitude, longitude,
      description, location, uploadTime, photo } = request.body
    //query neakceptuje coordinates, pozrieť podľa db a zmeniť query
    tools.pool.query('INSERT INTO reports (user_id, characteristic, latitude, longitude, description,location, uploadTime, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [user_id, characteristic, latitude, longitude,
        description, location, uploadTime, photo], (error, results) => {
          if (error) {
            return response.status(500).json({ "error": error })
          }
          else {
            return response.status(201).json()
          }
  
        })
  }
  
  const updateReport = (request, response) => {
    if (tools.checkuuid(request.params.report_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
  
    if (request.body.user_id == undefined || request.body.characteristic == undefined || request.body.latitude == undefined ||
      request.body.longitude == undefined || request.body.description == undefined || request.body.location == undefined
      || request.body.uploadTime == undefined || request.body.photo == undefined) {
      return response.status(400).json({ "error": 'Invalid object received.' })
    } // ak je nezadaný description alebo photo, príde "-"
  
    const { user_id, characteristic, latitude, longitude,
      description, location, uploadTime, photo } = request.body
    const report_id = request.params.report_id
  
    const prep = `update reports set user_id=\'${user_id}\', characteristic=\'${characteristic}\', latitude=${latitude}, longitude=${longitude}, description=\'${description}\', location=\'${location}\', uploadTime=\'${uploadTime}\', photo=\'${photo}\' where report_id=\'${report_id}\'`
  
    tools.pool.query(prep, (error, results) => {
      if (error) {
        return response.status(500).json({ "error": error })
      }
      else {
        return response.status(200).json()
      }
  
    }
    )
  }
  
  const getReportsByOwner = (request, response) => {
    if (tools.checkuuid(request.params.user_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
    tools.pool.query('SELECT * FROM reports WHERE user_id = $1',
      [request.params.user_id], (error, results) => {
        if (error) {
          return response.status(404).json({ "error": error })
        }
        else {
          if (results.rows.length == 0) {
            return response.status(404).json({ "error": "No reports found." })
          }
          return response.status(200).json({ "response": { "reports": results.rows } })
        }
      })
  }
  
  const deleteReport = (request, response) => {
    if (tools.checkuuid(request.params.report_id) == false) {
      return response.status(400).json({ "error": 'Bad uuid format.' })
    }
    tools.pool.query('DELETE FROM reports WHERE report_id = $1',
      [request.params.report_id], (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          return response.status(204).json()
        }
      })
  
  
  }

  module.exports = {
    getGeoReports,
    getReportsByOwner,
    createReport,
    updateReport,
    deleteReport,
  }  
  