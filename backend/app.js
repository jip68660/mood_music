const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.post('/', (req,res) => {
  console.log('handling /session');
  db.serialize(() => {
    let handle = sessionToHandle[req.body.sessionkey];
    if (handle === undefined) {
      res.json({'error': 'invalid session'});
      return
    }
    console.log("using handle: " + handle);
    db.each(`SELECT name FROM users WHERE username='${handle}' `, (err, row) => {
      console.log("selecting name");
      if (err) {
        console.error(err.message);
      }
      else {
        console.log("returning name and handle");
        res.json({'name': row.name, 'handle': handle})
      }
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
