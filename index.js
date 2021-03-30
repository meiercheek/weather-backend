require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const db = require('./api/queries')


app.use(express.json())
app.use(
    express.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Weather Report API v1.0' })
})

app.listen(port, () => {
    console.log(`Weather App API is running on port ${port}.`)
})


app.post('/users', db.createUser)
app.get('/users/:user_id', (req, res) =>db.auth(req, res, db.getUserById))

app.post('/login', db.loginUser)
app.get('/logout', (req, res) => db.auth(req, res, db.logoutUser))
app.get('/me',  db.getCurrentUserId)

app.post('/reports', (req, res) => db.auth(req, res, db.createReport))
app.put('/reports/:report_id', (req, res) => db.auth(req, res, db.updateReport))
app.get('/reports/:user_id', (req, res) => db.auth(req, res, db.getReportsByOwner))
app.delete('/reports/:report_id', (req, res) => db.auth(req, res,db.deleteReport))

app.get('/georeports',(req, res) => db.auth(req, res, db.getGeoReports))

