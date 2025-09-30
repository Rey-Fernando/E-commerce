const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    message: err.message || 'Algo salió mal',
    details: err.details || null
  })
}

export default errorHandler
