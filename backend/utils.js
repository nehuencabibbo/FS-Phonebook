function getMissingFields(body) {
  const missingFields = []
  if (!body.name) missingFields.push('name')
  if (!body.number) missingFields.push('number')

  return missingFields
}

function validateRequest(body) {
  // Can this happen at all?
  const error = new Error()
  error.name = 'InvalidRequest'
  if (!body) {
    error.message = 'There was no response body'
    throw error
  }
  let missingFields = getMissingFields(body)
  if (missingFields.length > 0) {
    error.message = `Missing fields ${missingFields.join(' and ')}`
    throw error
  }
}

module.exports = { validateRequest }