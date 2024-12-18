import Joi from "joi";

export const bugBusterSchema = Joi.object({
    title: Joi.string().min(5).required(),
    backstory: Joi.string().min(5).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    solution: Joi.string().required()
})