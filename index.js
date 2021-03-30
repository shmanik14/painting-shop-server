const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 4000

client.connect(err => {
    const paintCollection = client.db("paintingPrecision").collection("paints");

    app.post('/addPaint', (req,res) => {
        const paint = req.body;
        paintCollection.insertOne(paint)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/paints', (req, res) => {
        paintCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })

})

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port)