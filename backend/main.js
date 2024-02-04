const express = require('express')
const cors = require('cors')
const port = 4000
const db = require('./database')

const app = express()

app.use(cors())
app.use(express.urlencoded())

app.get('/work', (_, res) => {
  db.query('SELECT * FROM worklist ORDER BY created_at DESC', (_, r) => {
    let html = ''
    if (r.length === 0) {
      return res.send('Tidak ada worklist')
    } else {
      r.map(
        (data) =>
          (html += `<li id='items-${data.id}'>
          <div id="card">
            <p>${data.title}</p>
            <span hx-delete="http://localhost:4000/work/${data.id}" hx-trigger="click" 
                hx-swap="outerHTML" 
                hx-target="#items-${data.id}"
              >
                Hapus
              </span>
          </div>
        </li>`)
      )
      res.send(html)
    }
  })
})

app.post('/work', (req, res) => {
  const title = req.body.title
  if (!title) return res.send('Harus isi kegiatanmu')
  db.query(`INSERT INTO worklist (title) VALUES('${title}')`, (err, _) => {
    if (err) return res.send('Gagal menambahkan worklist')
    res.send('Berhasil ditambahkan')
  })
})

app.delete('/work/:id', (req, res) => {
  const id = req.params.id

  db.query(`DELETE FROM worklist WHERE id='${id}'`, (err, _) => {
    if (err) return res.send('Gagal menghapus worklist')
    res.send('')
  })
})

app.listen(port, () => {
  console.log('server running in ' + port)
})
