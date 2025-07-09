var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'db', 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法開啟資料庫:', err.message);
  } else {
    console.log('成功連接到 SQLite 資料庫');
  }
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/quotes', (req, res) => {
  db.all('SELECT * FROM movie_quotes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/insert', (req, res) => {
  const { provider, movie_name, quote } = req.body;
  if (!provider || !movie_name || !quote) {
    res.status(400).send('缺少必要欄位');
    return;
  }
  const sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
  db.run(sql, [provider, movie_name, quote], function(err) {
    if (err) {
      res.status(500).send('新增失敗: ' + err.message);
      return;
    }
    res.send('新增成功，ID: ' + this.lastID);
  });
});

module.exports = app;
