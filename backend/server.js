const  express = require('express');
const { Pool } = require('pg');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Signup',
    password: 'Pavan@017',
    port: 5432,
  });


app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received data:", { name, email, password }); // 👈 LOG values

  const sql = 'INSERT INTO login(name, email, password) VALUES ($1, $2, $3)';
  const values = [name, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB Insert Error:", err); // 👈 LOG errors
      return res.status(500).json({ error: 'Failed to insert data' });
    }
    console.log("✅ Insert success");
    return res.status(200).json({ message: 'Signup success' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Received data:", { email, password });

  const sql = 'SELECT * FROM login WHERE email = $1 AND password = $2';
  const values = [email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB Query Error:", err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});


  app.listen(3001, ()=>{
    console.log("Listening")
  })