const morgan = require('morgan')

morgan.token('user-data', function (req) {
  if (req.method !== 'POST') {
    return null
  }
  return JSON.stringify(req.body)
})

function morgan_logging_function(tokens, req, res) {
  let logging_content = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]

  if (req.method === 'POST') {logging_content.push(tokens['user-data'](req, res))}

  return logging_content.join(' ')
}

module.exports = { morgan_logging_function, morgan }