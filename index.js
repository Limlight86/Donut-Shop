const express = require("express")
const pg = require("pg")

const app = express()
app.use(express.static('public'))
app.use(express.json())

const PORT = process.env.PORT || 3000

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL })

app.get("/votes", async (_request, response) =>{
  const result = await db.query(`SELECT * FROM votes WHERE date = CURRENT_DATE`)
  response.json(result.rows)
})

app.post("/votes", async (request, response)=>{
  const {voter, donut} = request.body
  if (!voter) {
    response.status(406).json({ error: 'You must be logged in to vote' });
  }
  else {
    const voteToDelete = await db.query(`SELECT * FROM votes WHERE user=$1 AND date=CURRENT_DATE`, [voter])
    if (voteToDelete.rows){
      await db.query(`DELETE FROM votes WHERE voter=$1 AND date=CURRENT_DATE RETURNING *`, [voter])
    }
    const result = await db.query(`INSERT INTO votes (donut, voter) VALUES ($1, $2) RETURNING *`, [donut, voter])
    response.json(result.rows[0])
  }
})

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
