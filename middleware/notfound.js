// notFound.js - Example 404 handler middleware

function notFound(req, res, next) {
    res.status(404).json({
      message: 'Resource not found',
    });
  }
  
  export default notFound;
  