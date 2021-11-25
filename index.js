const express =require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app=express();
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId;
const port =process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irhuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        const database = client.db("mongoDb");
        const usersCollection = database.collection("users");
        //insert api
        app.post('/users',async(req,res)=>{
           const newUser =req.body;
           const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })
        //find api
        app.get("/users",async(req,res)=>{
            const cursor =usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //find one api
        app.get("/users/:id",async(req,res)=>{
            const id =req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await usersCollection.findOne(query);
           res.send(result)
        })
        //update api
        app.put('/users/:id',async(req,res)=>{
            const id =req.params.id;
            const updatedUser =req.body;
            const filter={_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name:updatedUser.name,
                  email:updatedUser.email
                },
              };
              const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log("updating user",id);
            res.json(result)
        })
        //delete api
        app.delete('/users/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            console.log("delleting id",result)
           res.json(result)
        })

      
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("starting server")
})
app.listen(port,()=>{
    console.log("connecting the port",port)
})
