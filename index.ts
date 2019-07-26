import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

const app = express()

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  fetch(`https://reqres.in/api/users/${userId}`)
    .then(response => response.json())
    .then(response => res.send(response.data))
})
app.get('/api/user/:userId/avatar', (req, res) => {
  const { userId } = req.params
  const filePath = path.join(__dirname, 'images', userId)
  fs.readdir(path.join(__dirname, 'images'), (err, files) => {
    // using cache
    if (err) throw err
    if (files.includes(userId)) {
      fs.readFile(filePath, (err, data) => {
        if (err) throw err
        res.send(Buffer.from(data).toString('base64'))
      })
    } else {
      // store image and return
      fetch(`https://reqres.in/api/users/${userId}`)
      .then(response => response.json())
      .then(response => {
        fetch(response.data.avatar)
          .then(response => {
            const stream = fs.createWriteStream(filePath)
            response.body.pipe(stream)
            response.body.on('error', (err) => {
              throw err
            })
            stream.on('finish', () => {
              fs.readFile(filePath, (err, data) => {
                if (err) throw err
                res.send(Buffer.from(data).toString('base64'))
              })
            })
          })
      })
    }
  })
})
app.delete('/api/user/:userId/avatar', (req, res) => {
  const { userId } = req.params
  const filePath = path.join(__dirname, 'images', userId)
  fs.unlink(filePath, (err) => {
    if (err) return res.status(400).send('NOT FOUND')
    res.status(200).end()
  })
})

app.listen(3000)
