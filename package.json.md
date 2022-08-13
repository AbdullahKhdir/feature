** PACKAGE.JSON **

** Quick Explanation Of The Used Packages **

## Productive Environment

```LIST
bcryptjs                = is used to encrypt the users password using salt string with hash
body-parse              = is used to parse the request and response
connect-flash           = is used to give the user a message on connecting e.g. Login or SignUp
cors                    = is used to allow or deny access from third parties hosts to our application
csurf                   = is used to identify or verify every post request that manipulated the data in the db 
dotenv                  = is used to load all the environments variables in the .env file
ejs                     = is used to render the dynamic html code with passed functions and variables
express                 = is used to build the node application using the framework express
mysql2                  = is used to build a mysql connection
express-mysql-session   = is used to save the built db connection in session for the whole cycle of the user login session 
express-session         = is used to validate the user session and compare it with the temporarily saved session 
helmet                  = is used to add a suitable headers to our application to prevent all kind of security leaks in the application to prevent exposure
lodash                  = is used to pass and is a very handy package that has a lot of utilities functions that can be used while building an application
morgan                  = is used to log every request that does not end up with 404 request, will be saved in a file on the server
workerpool              = is used to offload heavy (methods or functions) tasks to the cpu in asynchronous way and does not effect the application flow 
```

## Development Environment

```LIST
autocannon              = is used to send multiple requests to the server and test the number of requests per second
nodemon                 = is used to reload the server automatically upon saving new implementations
rewire                  = is used to prepare a test environment when testing specific function or method using the Ponicode extension  
sass                    = is used to compile the sass code into .css files and offers functionality on writing css code
```