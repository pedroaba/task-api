import http from "node:http"

import { json } from "./middleware/json"
import { routes } from "./routes"
import { extractQueryParameters } from "./utils/extract-query-parameters"

const PORT = process.env.PORT || 3000;
const server = http.createServer(async (request, response) => {
  const { method, url } = request

  await json(request, response)
  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParameters = request.url.match(route.path)
    const { query, ...params } = routeParameters.groups

    request.params = params
    request.query = query ? extractQueryParameters(query) : {}

    return route.handler(request, response)
  }

  return response.writeHead(404).end()
})

server.listen(PORT)
