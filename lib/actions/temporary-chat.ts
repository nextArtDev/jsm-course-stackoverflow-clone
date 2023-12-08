const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Assuming connectToDatabase is not needed as Prisma automatically manages the database connection

const search = async () => {
  const { query, type } = params
  const regexQuery = { contains: query, mode: 'insensitive' }

  let results = []

  const modelsAndTypes = [
    { model: prisma.question, searchField: 'title', type: 'question' },
    { model: prisma.user, searchField: 'name', type: 'user' },
    { model: prisma.answer, searchField: 'content', type: 'answer' },
    { model: prisma.tag, searchField: 'name', type: 'tag' },
  ]

  const typeLower = type?.toLowerCase()

  if (!typeLower || !searchableTypes.includes(typeLower)) {
    // Search across everything

    for (const { model, searchField, type } of modelsAndTypes) {
      const queryResults = await model.findMany({
        where: { [searchField]: regexQuery },
        take: 2,
      })

      results.push(
        ...queryResults.map((item) => ({
          title:
            type === 'answer' ? `Answers contain ${query}` : item[searchField],
          type,
          id:
            type === 'user'
              ? item.userId
              : type === 'answer'
              ? item.question
              : item.id,
        }))
      )
    }
  } else {
    // Search across specific model type
    const modelInfo = modelsAndTypes.find((item) => item.type === type)

    if (!modelInfo) {
      throw new Error('invalid search type')
    }

    const queryResults = await modelInfo.model.findMany({
      where: { [modelInfo.searchField]: regexQuery },
      take: 8,
    })

    results = queryResults.map((item) => ({
      title:
        type === 'answer'
          ? `Answers contain ${query}`
          : item[modelInfo.searchField],
      type,
      id:
        type === 'user'
          ? item.userId
          : type === 'answer'
          ? item.question
          : item.id,
    }))
  }

  return results
}

// Remember to call the function and handle the results accordingly

///////////////////
// BARD
const { query, type } = params
const regex = new RegExp(query, 'i')

let results = []

const models = [
  { model: 'Question', field: 'title', type: 'question' },
  { model: 'User', field: 'name', type: 'user' },
  { model: 'Answer', field: 'content', type: 'answer' },
  { model: 'Tag', field: 'name', type: 'tag' },
]

if (!type || !searchableTypes.includes(type)) {
  // Search across all models
  for (const { model, field, type } of models) {
    const data = await prisma[model].findMany({
      where: { [field]: { matches: regex } },
      take: 2,
    })

    results.push(
      ...data.map((item) => ({
        title: type === 'answer' ? `Answers contain ${query}` : item[field],
        type,
        id: type === 'user' ? item.userId : item.id,
      }))
    )
  }
} else {
  // Search in specific model
  const info = models.find((m) => m.type === type)
  if (!info) throw new Error('Invalid search type')

  const data = await prisma[info.model].findMany({
    where: { [info.field]: { matches: regex } },
    take: 8,
  })

  results = data.map((item) => ({
    title: type === 'answer' ? `Answers contain ${query}` : item[info.field],
    type,
    id: type === 'user' ? item.userId : item.id,
  }))
}

////////////////////////////////////////

async function search(params: { query: string; type: string }): Promise<any[]> {
  const { query, type } = params
  const regexQuery = { regex: query, options: 'i' }

  const modelsAndTypes = [
    { model: Prisma.Question, searchField: 'title', type: 'question' },
    { model: Prisma.User, searchField: 'name', type: 'user' },
    { model: Prisma.Answer, searchField: 'content', type: 'answer' },
    { model: Prisma.Tag, searchField: 'name', type: 'tag' },
  ]

  const typeLower = type?.toLowerCase()

  if (!typeLower || !searchableTypes.includes(typeLower)) {
    // Search across everything

    const queries = modelsAndTypes.map((model) => {
      return prisma
        .model(model.model)
        .find({ [model.searchField]: regexQuery })
        .limit(2)
    })

    const results = await Promise.all(queries)

    return results.flat()
  } else {
    // Search across specific model type
    const modelInfo = modelsAndTypes.find((item) => item.type === type)

    if (!modelInfo) {
      throw new Error('invalid search type')
    }

    const queryResults = await prisma
      .model(modelInfo.model)
      .find({ [modelInfo.searchField]: regexQuery })
      .limit(8)

    return queryResults.map((item) => ({
      title:
        type === 'answer'
          ? `Answers contain ${query}`
          : item[modelInfo.searchField],
      type,
      id:
        type === 'user'
          ? item.userId
          : type === 'answer'
          ? item.question
          : item._id,
    }))
  }
}
