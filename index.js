require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const tools = require('./api/tools')
const users = require('./api/users')
const reports = require('./api/reports')


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


app.post('/users', (req, res) => users.checkEmail(req, res, users.createUser))
app.get('/users/:user_id', (req, res) => tools.auth(req, res, users.getUserById))

app.post('/login', users.loginUser)
app.get('/logout', (req, res) => tools.auth(req, res, users.logoutUser))
app.get('/me',  users.getCurrentUserId)

app.post('/reports', (req, res) => tools.auth(req, res, reports.createReport))
app.put('/reports/:report_id', (req, res) => tools.auth(req, res, reports.updateReport))
app.get('/reports/:user_id', (req, res) => tools.auth(req, res, reports.getReportsByOwner))
app.delete('/reports/:report_id', (req, res) => tools.auth(req, res,reports.deleteReport))

app.get('/georeports',(req, res) => tools.auth(req, res, reports.getGeoReports))

