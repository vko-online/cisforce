import * as cron from 'node-cron'
import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'

const fileName = 'database.json'
const filePath = path.join(__dirname, fileName)

interface IData {
  lastPage: number
  data: any[]
}

if (!fs.existsSync(filePath)) {
  const db: IData = {
    lastPage: 0,
    data: []
  }
  fs.writeFileSync(filePath, JSON.stringify(db, null, 4))
}

cron.schedule('* * * * *', () => {
  fs.readFile(filePath, { encoding: 'utf8' }, (err, file) => {
    const db: IData = JSON.parse(file)
    if (err) throw err
    fetch(`https://reqres.in/api/users?page=${db.lastPage}`)
      .then(res => res.json())
      .then(res => {
        const newDb: IData = {
          lastPage: db.lastPage + 1,
          data: [
            ...db.data,
            ...res.data
          ]
        }
        fs.writeFile(filePath, JSON.stringify(newDb, null, 4), (err) => {
          if (err) console.error(err)
        })
      })
  })
})
