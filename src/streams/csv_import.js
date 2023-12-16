import { parse } from "csv-parser"
import * as fs from "node:fs"

const PORT = process.env.PORT || 3000

const csvPath = new URL("./tasks.csv", import.meta.url)
const stream = fs.createReadStream(csvPath)

const csvParser = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2
})

async function importCSV() {
  const lines = stream.pipe(csvParser)

  for await (const line of lines) {
    const [title, description] = line

    await fetch(`http://localhost:${PORT}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

importCSV()
