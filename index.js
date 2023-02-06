const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;



const { MongoClient } = require('mongodb');
const { query } = require('express');
const port = process.env.PORT || 5000;

//middle ware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6fks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism')
        const serviceCollection = database.collection('services')
        const orderCollection = database.collection('orders')
        console.log('connected');

        app.get('/services', async (req, res) => {
            await client.connect();
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();

            res.send(services)

        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('single data');
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            console.log('id', id);
            console.log('done');
            res.json(service);
        })
        app.get('/orders', async (req, res) => {
            await client.connect();
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();

            res.send(orders)

        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('single data');
            const query = { _id: ObjectId(id) }
            const service = await orderCollection.findOne(query)
            console.log('id', id);
            console.log('done');
            res.json(service);
        })

        //orders post
        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.status = 'pending';
            console.log(order.status);

            console.log("order", order);
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
        //service post
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log("order", service);
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        //delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

        //update
        // app.put('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('updating user', id);
        //     const updatedUser = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: 'true' }
        //     const status = 'approved';
        //     const updateDoc = {
        //         $set: {

        //             name: updatedUser.name,
        //             email: updatedUser.email,
        //             status:updatedUser.status,
        //         },
        //     };
        //     const result = await orderCollection.updateOne(filter, options, updateDoc)
        //     res.json(result)

        //     // const query = { _id: ObjectId(id) }

        // })
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            console.log("updating req", updatedUser);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    phone: updatedUser.phone,
                    name: updatedUser.name,
                    days: updatedUser.days,
                    price: updatedUser.price,
                    status: updatedUser.status,
                    id: updatedUser.id,

                },
            };
            const result = await orderCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            console.log("updating", id);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tourism site yah!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})