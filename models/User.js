const Joi = require('joi');


const UserSchema = Joi.object({
    id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required(),
    
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'any.required': 'Name field is required',
            'string.empty': `Please enter a name`,
            'string.min': 'Your name should have a minimum length of {#limit}',
            'string.max': 'Your name should have a maximum length of {#limit}',
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'any.required': 'Email field is required',
            'string.email': 'Please enter a valid email address',
            'string.empty': `Please enter an email address`,
        }),
    
    role: Joi.string()
        .valid('user')
        .default('user')
        .messages({
            'any.only': 'Account role must be "user"',
        }),
    
    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{6,}$/)
        .required()
        .messages({
            'any.required': 'Password field is required',
            'string.empty': `Please enter a password`,
            'string.min': 'Your password should have a minimum length of {#limit}',
            'string.pattern.base': 'Your password MUST include a number, a lowercase letter and an uppercase letter'
        }),
    
    resetPasswordToken: Joi.string(),

    resetPasswordExpire: Joi.string(),

    createdAt: Joi.date()
        .default(Date.now)
})

module.exports = UserSchema;