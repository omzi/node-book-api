const Joi = require('joi'); 


const BookSchema = Joi.object({
    id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required(),
    
    title: Joi.string()
        .min(1)
        .max(100)
        .required(),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .required(),

    author: Joi.string()
        .min(3)
        .max(50)
        .required(),

    datePublished: Joi.date()
        .required(),
    
    pages: Joi.number()
        .positive()
        .min(1)
        .max(10000)
        .required(),
    
    publisher: Joi.string()
        .min(1)
        .max(100)
        .required(),
    
    description: Joi.string()
        .min(100)
        .max(500)
        .required(),

    isbn: Joi.string()
        .regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
        .message('isbn must be valid ISBN-10 or ISBN-13')
        .required()
})

module.exports = BookSchema;