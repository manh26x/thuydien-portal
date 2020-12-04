module.exports = (req, res, next) => {
  if(req.path.match('/login')) {
    req.method = 'GET';
  }
  next()
}
