import Joi from 'joi';

function createUserSchema(req, res, next) {
  const createSchema = Joi.object({
      name: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      rol: Joi.string().valid('teacher', 'student').required()
  });
  validateRequest(req, next, createSchema);
};
function updateUserSchema(req, res, next) {
  const updateSchema = Joi.object ({
      name: Joi.string().empty(''),
      lastName: Joi.string().empty('')
  });
  validateRequest(req, next, updateSchema);  
};

function validateRequest(req, next, schema) {
  const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
      next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
      req.body = value;
      next();
  }
}

export {createUserSchema, updateUserSchema}