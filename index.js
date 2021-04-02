const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const objectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxkd4.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 4000

client.connect(err => {
    const paintCollection = client.db("paintingPrecision").collection("paints");
    const orderCollection = client.db("paintingPrecision").collection("orders");

    app.post('/addPaint', (req,res) => {
        const paint = req.body;
        paintCollection.insertOne(paint)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder', (req,res) => {
      const order = req.body;
      orderCollection.insertOne(order)
      .then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
      })
    })

    app.get("/orders", (req,res) => {
      orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
      res.send(documents);
      })
    })

    app.get('/paints', (req, res) => {
        paintCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })
    
    app.get('/checkout/:id', (req, res) => {
      paintCollection.find({_id: objectId(req.params.id)})
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
    })

    app.get("/manageProduct", (req,res) => {
      paintCollection.find({email: req.query.email})
      .toArray((err, documents) => {
      res.send(documents);
      })
    })

    app.delete("/delete/:id", (req, res) => {
      paintCollection.findOneAndDelete({_id: objectId(req.params.id)})
      .then(result => {
        console.log(result)
        res.send(result.deletedCount > 0);
      })
    })

})

app.get('/', (req, res) => {
    res.send('Hello Painting Precision')
  })
  
app.listen(port)