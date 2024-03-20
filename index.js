const express = require('express');
const db = require('./db');

const app = express();

app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/', async (req, res) =>{
    try{
        const { name, price, author } = req.body;
        const result = await db.query(`INSERT INTO books (name, author, price) VALUES ($1,$2,$3)`,[name, author, price])
        res.json(result)
    } catch(err){
        console.log(err)
        res.status(500).send(`Internal server error`)
    }
})

app.delete('/:id', async (req, res) =>{
    try{
        const id = req.params.id
        const result = await db.query(`DELETE FROM books WHERE id = $1`, [id])
        res.json(result)
    }catch(err){
        console.log(err)
        res.status(500).send(`Internal server error`)
    }
})

app.put('/:id', async (req, res) =>{
    try{
        const id = req.params.id
        const {name, author, price} = req.body;
        const result = await db.query(`UPDATE books SET name = $1, author = $2, price = $3 WHERE id = $4`, [name, author, price, id])
        res.json(result)
    }catch(err){
        console.log(err)
        res.status(500).send(`Internal server error`)
    }
})

app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, author, price } = req.body;
        let queryParams = [];
        let query = 'UPDATE books SET ';
        
        if (name) {
            query += 'name = $1';
            queryParams.push(name);
        }
        if (author) {
            if (queryParams.length > 0) query += ', ';
            query += 'author = $' + (queryParams.length + 1);
            queryParams.push(author);
        }
        if (price) {
            if (queryParams.length > 0) query += ', ';
            query += 'price = $' + (queryParams.length + 1);
            queryParams.push(price);
        }
        
        query += ' WHERE id = $' + (queryParams.length + 1);
        queryParams.push(id);

        const result = await db.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});