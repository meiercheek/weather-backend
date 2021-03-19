const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.PASS,
  port: process.env.PORT,
})


//TODO: db operations

const getGeoReports = (request, response) => {
  const { radius, latitude, longitude } = request.body
  pool.query('TODO', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { username, email, password, user_id } = request.body

  pool.query('INSERT INTO users (username, email, password, user_id) VALUES ($1, $2, $3, $4)', [username, email, password, user_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const createReport = (request, response) => {
  const { report_id, user_id, characteristic, coordinates,
     location, uploadTime, description, photo} = request.body

  pool.query('TODO', [report_id, user_id, characteristic, coordinates,
    location, uploadTime, description, photo], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Report added with ID: ${results.insertId}`)
  })
}

const updateReport = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Report modified with ID: ${id}`)
    }
  )
}

const getReportById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM reports WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const deleteReport = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Report deleted with ID: ${id}`)
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