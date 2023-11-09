import { z } from 'zod'

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: 'title must be at least 5 characters.',
    })
    .max(130, {
      message: 'title can not be longer than 130 characters',
    }),
  // explanation: z.string(),
  explanation: z.string().min(10, {
    message: 'You should explain your question at least in 100 character',
  }),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const AnswerSchema = z.object({
  answer: z.string().min(20),
})

export const ProfileSchema = z.object({
  name: z.string(),
  // .min(5, {
  //   message: 'Username must be at least 2 characters.',
  // })
  // .max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(3).max(50),
})
