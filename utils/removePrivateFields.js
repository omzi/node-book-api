const removePrivateFields = (privateFields, object) => {
  privateFields.forEach(field => delete object[field]);
  return object;
}

module.exports = removePrivateFields;