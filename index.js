const express = require("express")
const pg = require("pg")

const app = express()
app.use(express.static('public'))
app.use(express.json())

const PORT = process.env.PORT || 3000

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL })

db.query(`
  CREATE TABLE IF NOT EXISTS votes( 
    id SERIAL PRIMARY KEY,
    donut VARCHAR(128) NOT NULL,
    voter VARCHAR(128) NOT NULL, 
    date DATE DEFAULT CURRENT_DATE);
  
    CREATE UNIQUE INDEX IF NOT EXISTS daily_vote ON votes (voter, date)
`)

app.listen(PORT, () =>
  console.log(`Server is up and running at port ${PORT} 🚀`)
);

