import { number, object, string } from 'yup';

let createUserSchema = object({
  id : number(),
  email: string().required().trim(),
  password: string().required().trim(),
  role: string().required().trim()
});



export { createUserSchema };