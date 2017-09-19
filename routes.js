let express = require('express');
let router = express.Router();
let busboy = require('busboy');
const lokijs = require('lokijs');
const usersCollection = db.addCollection('users');

router.post('/form', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  req.pipe(busboy);

  busboy.on('file', (fieldname, file) => {
    file.on('data', (chunk) => {
      let rows = parseRows(chunk.toString());
      let users = rows.map((row) => {
        let values = parseValuesFromRow(row);

        return {
          firstName: values[0],
          surname: values[1],
          email: values[2]
        };
      });
      //write in db per chunk
      usersCollection.insert(users);
    });

    file.on('end', () => {
      console.log('Finished with ' + fieldname);
    });
  });
  busboy.on('finish', () => {
    res.redirect('/users/1');
  });

  function parseRows(data) {
    return data.split('\n');
  }

  function parseValuesFromRow(data) {
    return data.split(',');
  }
});

router.get('/',(req, res) => {
  res.render('form');
});

router.get('/users/:page', (req, res) => {
  let page = req.params.page;
  let limit = 50;
  let offset = limit * page;
  let users = usersCollection
    .chain()
    .find({})
    .offset(offset)
    .limit(limit)
    .data();
  let count = usersCollection.count();

  res.render('users', {
    users: users,
    limit: limit,
    count: count
  });
});

module.exports = router;