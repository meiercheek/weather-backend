const tools = require('./tools')

const getUserById = (request, response) => {
    if (tools.checkuuid(request.params.user_id) == false) {
      return response.status(400).json({ "error": 'bad uuid format' })
    }
    else {
      tools.pool.query('SELECT * FROM users WHERE user_id = $1', [request.params.user_id], (error, results) => {
        if (error) {
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length == 0) {
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
  
    tools.jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err)
        return response.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
  
        return response.status(200).json({
  
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
  
    tools.pool.query('SELECT * FROM users WHERE username = $1', [request.body.username], (err, results) => {
      if (err)
        return response.status(500).json({ "error": 'Error on the server.' })
      if (!results.rows[0])
        return response.status(404).json({ "error": 'No user found.' })
  
      let validPass = tools.bcrypt.compareSync(request.body.password, results.rows[0].password);
      if (!validPass)
        return response.status(401).json({ auth: false, token: null });
  
  
      let token = tools.jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
        expiresIn: 86400 // expires in 24 hours
      })
  
      return response.status(200).json({ auth: true, token: token })
    })
  
  }
  
  const logoutUser = (request, response) => {
    return response.status(200).json({ auth: false, token: null });
  }
  
  
  const checkEmail = (request, response,callback) => {
    if (request.body.username == undefined ||
      request.body.email == undefined ||
      request.body.password == undefined) {
      return response.status(400).json({ "error": 'invalid object' })
    }
    const { username, email, password } = request.body
  
    tools.pool.query('SELECT * from users where email=$1',
      [email], (error, results) => {
        if (error) {
          callback(error)
          return response.status(500).json({ "error": error })
        }
        else {
          if (results.rows.length > 0)
            return response.status(409).json({ "error": "user with this email already exists." })
          else
            callback(response, username, email, password)
        }
      })
  }
  
  const createUser = (response, username, email, password) => {
    const hashedPass = bcrypt.hashSync(password);
  
    tools.pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) returning user_id', [username, email, hashedPass], (error, results) => {
      if (error) {
        return response.status(500).json({ "error": error })
      }
      else {
        let token = tools.jwt.sign({ id: results.rows[0].user_id }, process.env.JWTSECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
  
        return response.status(201).json({ auth: true, token: token });
      }
  
    })
  }

  module.exports = {
    getUserById,
    checkEmail,
    createUser,
    getCurrentUserId,
    loginUser,
    logoutUser,
  }  