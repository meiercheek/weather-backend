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
app.get('/users/:id', db.getUserById)


app.post('/reports', db.createReport)
app.put('/reports/:id', db.updateReport)
app.get('/reports/:id', db.getReportById)
app.delete('/reports/:id', db.deleteReport)

app.get('/georeports', db.getReportById)