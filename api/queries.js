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
    return response.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err)
      return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
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
    return response.status(400).json('Incorrect map data entered.')
  }
  else {
    pool.query('TODO', [], (error, results) => {
      if (error) {
        return response.status(500).json(error)
      }
      else {
        if (!results.rows)
          return response.status(404).json('No reports found.')

        response.status(200).json(results.rows)
      }

    })
  }
}

const createReport = (request, response) => {
  if (!request.body.user_id || !request.body.characteristic || !request.body.coordinates ||
    !request.body.description || !request.body.location || !request.body.uploadTime || !request.body.photo) {
    return response.status(400).json('Invalid object received.')
  } // ak je nezadaný description alebo photo, príde "-"

  const { report_id, user_id, characteristic, coordinates,
    description, location, uploadTime, photo } = request.body
  //query neakceptuje coordinates, pozrieť podľa db a zmeniť query
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
          response.status(201).send(`Report added.`)
        }

      })
}

const updateReport = (request, response) => {
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
        response.status(500).json(error)
      }
      else {
        response.status(200).send(`Report modified.`)
      }

    }
  )
}

const getReportByOwner = (request, response) => {
  if (tools.checkuuid(request.params.user_id) == false) {
    response.status(400).json('Bad uuid format.')
  }
  pool.query('SELECT * FROM reports WHERE user_id = $1',
    [request.params.user_id], (error, results) => {
      if (error) {
        response.status(404).json(error)
      }
      else {
        if (!results.rows) {
          response.status(404).json("")
        }
        response.status(200).json(results.rows[0])
      }
    })
}

const deleteReport = (request, response) => {

  pool.query('DELETE FROM reports WHERE report_id = $1',
    [request.params.id], (error, results) => {
      if (error) {
        response.status(500).json(error)
      }
      else {
        response.status(204).send(`Report deleted.`)
      }
    })


}

const getUserById = (request, response) => {
  if (tools.checkuuid(request.params.id) == false) {
    response.status(400).json('bad uuid format')
  }
  else {
    pool.query('SELECT * FROM users WHERE user_id = $1', [request.params.id], (error, results) => {
      if (error) {
        return response.status(500).json(error)
      }
      else {
        if (!results.rows) {
          return response.status(404).json('No user found.')
        }
        return response.status(200).json(results.rows[0].username)
      }
    })
  }

}

const getCurrentUserId = (request, response) => {
  let token = request.headers['x-access-token'];
  if (!token)
    return response.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err)
      return response.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    response.status(200).send(decoded.id);
  });
}

const loginUser = (request, response) => {
  if (request.body.username == undefined) {
    return response.status(400).json('no username supplied')
  }
  if (request.body.password == undefined) {
    return response.status(400).json('no password supplied')
  }

  pool.query('SELECT * FROM users WHERE username = $1', [request.body.username], (err, results) => {
    if (err)
      return response.status(500).send('Error on the server.')
    if (!results.rows[0])
      return response.status(404).send('No user found.')

    let validPass = bcrypt.compareSync(request.body.password, results.rows[0].password);
    if (!validPass)
      return response.status(401).send({ auth: false, token: null });


    let token = jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
      expiresIn: 86400 // expires in 24 hours
    })

    response.status(200).send({ auth: true, token: token })
  })

}

const logoutUser = (request, response) => {
  response.status(200).send({ auth: false, token: null });
}

const createUser = (request, response) => {
  if (request.body.username == undefined ||
    request.body.email == undefined ||
    request.body.password == undefined) {
    response.status(400).json('invalid object')
  }
  const { username, email, password } = request.body
  const hashedPass = bcrypt.hashSync(password);

  pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) returning user_id', [username, email, hashedPass], (error, results) => {
    if (error) {
      response.status(500).json(error)
    }
    else {
      let token = jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
        expiresIn: 86400 // expires in 24 hours
      });

      response.status(201).send({ auth: true, token: token });
    }

  })
}

module.exports = {
  getGeoReports,
  getUserById,
  getReportByOwner,
  createUser,
  createReport,
  updateReport,
  deleteReport,
  getCurrentUserId,
  loginUser,
  logoutUser,
  auth
}