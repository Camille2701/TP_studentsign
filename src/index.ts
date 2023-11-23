import Express, { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup';

import { createUserSchema } from './validation'
import db from './db'

const app = Express()

app.use(Express.json())


const validateSchema = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, {abortEarly: false});
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(error.errors);
      res.status(400).json({message: error.errors})
    }
  }
}


app.post('/users', validateSchema(createUserSchema), async (req, res) => {
  const user = req.body    

  // Load data from db.json into db.data
  await db.read()

  if (db.data.users) {
    const lastCreatedUser = db.data.users[db.data.users.length - 1]
    const id = lastCreatedUser ? lastCreatedUser.id + 1 : 1

    db.data.users.push({ id, ...user })

    // Save data from db.data to db.json file
    await db.write()

    res.json({ id })
  } else {
    res.status(500).json({ error: 'Database error' })
  }
})



// Create a new course
app.post('/courses', async (req: Request, res: Response) => {
  const course = req.body

  // Add validation for course data here

  // Load data from db.json into db.data
  await db.read()

  // Check if db.data.courses is defined and if not, initialize it to an empty array
  if (!db.data.courses) {
    db.data.courses = [];
  }

  const lastCreatedCourse = db.data.courses[db.data.courses.length - 1]
  const id = lastCreatedCourse ? lastCreatedCourse.id + 1 : 1

  db.data.courses.push({ id, ...course })

  // Save data from db.data to db.json file
  await db.write()

  res.json({ id })
})

app.post('/courses/:id/students', async (req: Request, res: Response) => {
  const courseId = req.params.id
  const student = req.body

  // Add validation for student data here

  // Load data from db.json into db.data
  await db.read()

  const course = db.data.courses.find(course => course.id === Number(courseId))

  if (!course) {
    res.status(404).json({ error: 'Course not found' })
    return
  }

  course.students = course.students || []
  course.students.push(student)

  // Save data from db.data to db.json file
  await db.write()

  res.json(student)
})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})