const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2mkh8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('car_solutions').collection('services');
        const reviewCollection = client.db('car_solutions').collection('reviews');
        const userCollection = client.db('car_solutions').collection('users');


        //reviews
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        //---
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        //my order api 
        app.get('/service', async (req, res) => {
            const availableQuantity = req.query.availableQuantity;
            const query = { availableQuantity: availableQuantity };
            const cursor = serviceCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        })
        //PUT User create
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

    }
    finally {

    }



}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Car Soluations!')
})

app.listen(port, () => {
    console.log(`Car Soluations App listening on port ${port}`)
})