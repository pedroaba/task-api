import { randomUUID } from "node:crypto"
import { Database } from "../database"

const database = new Database()
const table = "tasks"

export const tasksRoutes = {
  listTasks: (request, response) => {
    const { search } = request.query
    const data = database.select(table, {
      title: search,
      description: search
    })

    return response.end(JSON.stringify(data))
  },
  insertTask: (request, response) => {
    const { title, description } = request.body

    if (!title) {
      return response.writeHead(400).end(
        JSON.stringify({
          message: "title is required"
        })
      )
    }

    if (!description) {
      return response.writeHead(400).end(
        JSON.stringify({
          message: "description is required"
        })
      )
    }

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date()
    }

    database.insert(table, task)
    return response.writeHead(201).end()
  },
  updateTask: (request, response) => {
    const { id } = request.params
    const { title, description } = request.body
    
    if (!title && !description) {
      return res.writeHead(400).end(
        JSON.stringify({ message: 'title or description are required' })
      )
    }

    const [task] = database.select(table, {
      id
    })

    const taskToUpdated = {
      id,
      title: title ?? task.title,
      description: description ?? task.description,
      updated_at: new Date(),
    }

    database.update(table, id, taskToUpdated)
    return response.writeHead(200).end()
  },
  deleteTask: (request, response) => {
    const { id } = request.params

    const [task] = database.select(table, { id })
    if (!task) {
      return response.writeHead(404).end()
    }

    database.delete(table, id)
    return response.writeHead(204).end()
  },
  toggleTaskComplete: (request, response) => {
    const { id } = request.params

    const [task] = database.select(table, { id })
    if (!task) {
      return response.writeHead(404).end()
    }
    
    const isTasksCompleted = !!task.completed_at
    database.update(table, id, {
      id,
      completed_at: isTasksCompleted ? null : new Date()
    })

    return response.writeHead(200).end()
  },
  importTasksByCSV: (request, response) => {
    
  }
}
