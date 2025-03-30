const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
  
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    // Handle other errors
    res.status(500).json({ error: 'Something went wrong!' });
  };
  
  module.exports = errorHandler;