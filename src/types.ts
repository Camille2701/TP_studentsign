type users = {
  id: number,
  email: string
  password: string
  role: string
}

type Course = {
  id: number,
  title: string;
  date: Date;
  students: users[];
}

type StudentCourses = {
  registeredat: Date;
  signedAt: Date;
}

type Data = {
  courses: Course[],
  users: users[]
}


export { users, Data, StudentCourses, Course }