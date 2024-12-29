// error.js - Example error handling middleware

function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  }
  
  export default errorHandler;
  