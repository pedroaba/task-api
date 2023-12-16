import * as fs from "node:fs/promises"

const DATABASE_URL = new URL("../db/db.json", import.meta.url)

export class Database {
  #database = {}
  #persist() {
    fs.writeFile(DATABASE_URL, JSON.stringify(this.#database, null, 2))
  }

  #does_table_exists(table) {
    return Object.keys(this.#database).includes(table)
  }

  constructor() {
    fs.readFile(DATABASE_URL, { encoding: "utf8" })
      .then(data => this.#database = JSON.parse(data))
      .catch(console.error)
  }

  select(table, query) {
    const tableData = this.#database[table] ?? []

    if (query) {
      return tableData.filter(item => {
        return Object.entries(query).some(([queryParam, queryValue]) => {
          if (!queryValue) {
            return true
          }

          return item[queryParam].includes(queryValue)
        })
      })
    }

    return tableData
  }

  insert(table, data) {
    if (this.#does_table_exists(table) && Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  update(table, dataId, data) {
    const indexOfItem = this.#database[table].findIndex(item => item.id === dataId)

    if (indexOfItem > -1) {
      const item = this.#database[table][indexOfItem]
      this.#database[table][indexOfItem] = {
        id: dataId,
        ...item,
        ...data
      }

      this.#persist()
    }
  }

  delete(table, id) {
    const indexOfItem = this.#database[table].findIndex(item => item.id === id)

    if (indexOfItem > -1) {
      this.#database[table].splice(indexOfItem, 1)
      this.#persist()
    }
  }
}
