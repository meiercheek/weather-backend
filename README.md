# Weather Report App API

repo url: https://github.com/meiercheek/weather-backend

What do you need for running the API:
- Node.js v.10 or higher
- postgreSQL database (import file is included)

You need to create and store secret info in a `.env` file:
```
USER= <database user>
HOST= <ip adress of the db>
NAME= <db name>
PASS= <db user password>
PORT= <db port>
JWTSECRET= <enter a random string here>
```
After that:

`npm install` - first setup

`npm start` - start the API 

Runs on nodemon, so `npm install -g nodemon`, if there is an error while starting.

## Documentation
### Changes from previous submission:
  - all paths now requre JWT token in header `x-access-token` generated and sent by `POST /login` or `POST /users` paths
  - the logout is done only on the client side, with destroying of the token
  - added paths:
    - POST /me - for getting the current user id
    - POST /login - for logging in, doesnt require jwt token in header for access
### What does it do?
This API provides the app with all the informations that is needed while running the frontend application.
The paths that start with the word `reports` are used to fetch, update or delete reports in various contexts, such as:

The user is in a list of his reports, he picks the `Delete report` option, so a request on the backend is made like so: `DELETE /reports/4abcd-...` upon receiving this request, the backend verifies the jwt token, verifies the parameter(or JSON body in some requests), does the desired DB operation and returns a response based on what it has managed to do with a correct error code.

### Important methods
- auth
  - behaves like a gatekeep for all the access to sensitive data, such as reports and users
  - checks whether the frontend has sent a correct `x-access-token`
    -  if yes, we get forwarded to the next method that was requested
    -  if not, return a 401, because there was no token present in the request
    -  if the token is incorrect, return a response with the code 500

- createUser
    - verifies all the data entered in the json body, if not correct sends a 400
    -  hashes the password using `bcrypt`
    -  saves username, hashedpassword and an email to the database, database creates a uuid
    -  this uuid is returned in a hashed form as a token that is used for access in auth method
      -  if there's an db error -> 500
      -  if all operations ran correctly issue an 201 response with an object that the client has to process

 - loginUser
    - verifies all the data entered in the json body, if not correct sends a 400 
    - pulls out necessary data from db about the user
      - no user found? sends a 404
      - error during search? sends a 500
    - bcrypt compares the passwords, if they dont match, sends a 401
      - if they match, create a token, issue a 201 with the authentification object that contains a true/false value and token
 
 - getCurrentUserId
    - reads the token and parses the id of the current user
    - 401 if no token provided
    - 500 if token is incorrect
    - 200 if token is correct, returns the id that was requested
 
 - getUserById
    - verifies the uuid
    - searches db
    - returns a code about what happened (400 - bad format of uuid, 500 - db error, 404 - no such user, 200 - success, with username) 
 
 - getReportByOwner
    - verifies the report unique id
    - searches db for reports by this user
    - returns a code about what happened (400 - bad format of uuid, 500 - db error, 404 - no such reports, 200 - success, with report object(s)) 
 
 - updateReports
    - verifies, whether the report's body is correct, if not -> 400 response
    - updates the entry in the database
    - 500 if db error, 200 if success
  
 - createReport
    - verifies, whether the report's body is correct, if not -> 400 response
    - inserts the entry in the database
    - 500 if db error, 200 if success
 
 - getGeoReports
    - verifies the entered the data and calulcates the other two screen edges
    - if not correct -> 400
    - searches the db for reports that match these criteria
    - 500 db error, 404 no reports found, 200 with an array of reports matching criteria

    
