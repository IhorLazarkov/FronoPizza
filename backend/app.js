const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');

const  { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method to generate a hashed CSRF token
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

//Check if Sequelize Validation Errors
app.use((err, _req, _res, next) => {
    if(err instanceof ValidationError){
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Last line of defense
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

app.use(routes);

module.exports = app;