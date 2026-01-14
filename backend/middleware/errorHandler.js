// Gestion des erreurs 404
exports.notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Gestion globale des erreurs
exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    ...(err.name === 'ValidationError' && {
      errors: Object.values(err.errors).map(e => e.message)
    }),
    ...(err.code === 11000 && {
      message: 'Cette valeur existe déjà'
    })
  });
};