const Pool = require('pg').Pool
const tools = require('./tools')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.PASS,
  port: process.env.PORT,
})

const auth = (request, response, next) => {
  let token = request.headers['x-access-token'];
  if (!token)
    return response.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err)
      return response.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    else {
      next(request, response)
    }

  });
}

const getGeoReports = (request, response) => {
  // react-native-maps: getMapBoundaries -> {northEast: LatLng, southWest: LatLng}
  const { NElat, NElong, NWlat, NWlong,
    SElat, SElong, SWlat, SWlong, error } = tools.checkandcalccoords(request)

  if (error) {
    return response.status(400).json({ "error": 'Incorrect map data entered.' })
  }
  else {
    pool.query('SELECT * FROM reports WHERE \
    (latitude BETWEEN $1 AND $2) \
    AND \
    ($3 < $4 AND longitude BETWEEN $3 AND $4) \
    OR (($4 < $3) AND ((longitude BETWEEN $3 AND 180) OR (longitude BETWEEN -180 AND $4)))',
     [SWlat, NElat, SWlong, NElong], (error, results) => {
      if (error) {
        return response.status(500).json({ "error": error })
      }
      else {
        if (!results.rows)
          return response.status(404).json({ "error": 'No reports found.' })

        response.status(200).json({ "response": { "reports": results.rows } })
      }

    })
  }
}

const createReport = (request, response) => {
  if (!request.body.user_id || !request.body.characteristic || !request.body.latitude ||
    !request.body.longitude || !request.body.description || !request.body.location || !request.body.uploadTime || !request.body.photo) {
    return response.status(400).json({ "error": 'Invalid object received.' })
  } // ak je nezadaný description alebo photo, príde "-"

  const { user_id, characteristic, latitude, longitude,
    description, location, uploadTime, photo } = request.body
  //query neakceptuje coordinates, pozrieť podľa db a zmeniť query
  pool.query('INSERT INTO reports (user_id, characteristic, latitude, longitude, description,location, uploadTime, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [user_id, characteristic, latitude, longitude,
      description, location, uploadTime, photo], (error, results) => {
        if (error) {
          response.status(500).json({ "error": error })
        }
        else {
          response.status(201).json()
        }

      })
}

const updateReport = (request, response) => {
  if (tools.checkuuid(request.params.report_id) == false) {
    response.status(400).json({ "error": 'Bad uuid format.' })
  }

  if (!request.body.user_id || !request.body.characteristic || !request.body.latitude 
      ||!request.body.longitude || !request.body.description || !request.body.location 
      || !request.body.uploadTime || !request.body.photo) {
    return response.status(400).json({ "error": 'Invalid object received.' })
  } // ak je nezadaný description alebo photo, príde "-"

  const { user_id, characteristic, latitude, longitude,
    description, location, uploadTime, photo } = request.body
  const report_id = request.params.report_id

  const prep = `update reports set user_id=\'${user_id}\', characteristic=\'${characteristic}\', latitude=${latitude}, longitude=${longitude}, description=\'${description}\', location=\'${location}\', uploadTime=\'${uploadTime}\', photo=\'${photo}\' where report_id=\'${report_id}\'`
          
  pool.query(prep, (error, results) => {
      if (error) {
        response.status(500).json({ "error": error })
      }
      else {
        response.status(200).json()
      }

    }
  )
}

const getReportsByOwner = (request, response) => {
  if (tools.checkuuid(request.params.user_id) == false) {
    response.status(400).json({ "error": 'Bad uuid format.' })
  }
  pool.query('SELECT * FROM reports WHERE user_id = $1',
    [request.params.user_id], (error, results) => {
      if (error) {
        response.status(404).json({ "error": error })
      }
      else {
        if (!results.rows) {
          response.status(404).json({ "error": "No reports found." })
        }
        response.status(200).json({ "response": { "reports": results.rows } })
      }
    })
}

const deleteReport = (request, response) => {
  if (tools.checkuuid(request.params.report_id) == false) {
    response.status(400).json({ "error": 'Bad uuid format.' })
  }
  pool.query('DELETE FROM reports WHERE report_id = $1',
    [request.params.report_id], (error, results) => {
      if (error) {
        response.status(500).json({ "error": error })
      }
      else {
        response.status(204).json()
      }
    })


}

const getUserById = (request, response) => {
  if (tools.checkuuid(request.params.user_id) == false) {
    response.status(400).json({ "error": 'bad uuid format' })
  }
  else {
    pool.query('SELECT * FROM users WHERE user_id = $1', [request.params.user_id], (error, results) => {
      if (error) {
        return response.status(500).json({ "error": error })
      }
      else {
        if (!results.rows) {
          return response.status(404).json({ "error": 'No user found.' })
        }
        return response.status(200).json({
          "response": { "username": results.rows[0].username }

        })
      }
    })
  }

}

const getCurrentUserId = (request, response) => {
  let token = request.headers['x-access-token'];
  if (!token)
    return response.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err)
      return response.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    response.status(200).json({

      "response": {
        "user_id": decoded.id
      }
    });
  });
}

const loginUser = (request, response) => {
  if (request.body.username == undefined) {
    return response.status(400).json({ "error": 'no username supplied' })
  }
  if (request.body.password == undefined) {
    return response.status(400).json({ "error": 'no password supplied' })
  }

  pool.query('SELECT * FROM users WHERE username = $1', [request.body.username], (err, results) => {
    if (err)
      return response.status(500).json({ "error": 'Error on the server.' })
    if (!results.rows[0])
      return response.status(404).json({ "error": 'No user found.' })

    let validPass = bcrypt.compareSync(request.body.password, results.rows[0].password);
    if (!validPass)
      return response.status(401).json({ auth: false, token: null });


    let token = jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
      expiresIn: 86400 // expires in 24 hours
    })

    response.status(200).json({ auth: true, token: token })
  })

}

const logoutUser = (request, response) => {
  response.status(200).json({ auth: false, token: null });
}

const createUser = (request, response) => {
  if (request.body.username == undefined ||
    request.body.email == undefined ||
    request.body.password == undefined) {
    response.status(400).json({ "error": 'invalid object' })
  }
  const { username, email, password } = request.body
  const hashedPass = bcrypt.hashSync(password);

  pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) returning user_id', [username, email, hashedPass], (error, results) => {
    if (error) {
      response.status(500).json({ "error": error })
    }
    else {
      let token = jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
        expiresIn: 86400 // expires in 24 hours
      });

      response.status(201).json({ auth: true, token: token });
    }

  })
}

module.exports = {
  getGeoReports,
  getUserById,
  getReportsByOwner,
  createUser,
  createReport,
  updateReport,
  deleteReport,
  getCurrentUserId,
  loginUser,
  logoutUser,
  auth
}