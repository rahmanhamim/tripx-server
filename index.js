const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4rb3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

// -------------------------------------------------

async function run() {
 try {
  await client.connect();

  const database = client.db("tripx");
  const serviceCollection = database.collection("services");
  const bookingCollection = database.collection("bookings");

  // GET API
  app.get("/services", async (req, res) => {
   const cursor = serviceCollection.find({});
   const services = await cursor.toArray();
   res.send(services);
  });

  // GET SINGLE SERVICE API
  app.get("/services/:id", async (req, res) => {
   const id = req.params.id;
   //  console.log("getting specific service", id);
   const query = { _id: ObjectId(id) };
   const service = await serviceCollection.findOne(query);
   res.send(service);
  });

  // POST API CONFIRM BOOKING
  app.post("/bookings", async (req, res) => {
   const order = req.body;
   const result = await bookingCollection.insertOne(order);
   res.json(result);
  });

  // GET BOOKING BY EMAIL
  app.get("/bookings/:email", (req, res) => {
   //  console.log(req.params);
   bookingCollection
    .find({ email: req.params.email })
    .toArray((err, results) => {
     res.send(results);
    });
  });

  // DELETE SINGLE USER ORDER API
  app.delete("/bookings/:id", async (req, res) => {
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const result = await bookingCollection.deleteOne(query);
   res.json(result);
  });

  // GET ALL BOOKING FOR ADMIN
  app.get("/bookings", async (req, res) => {
   const cursor = bookingCollection.find({});
   const services = await cursor.toArray();
   res.send(services);
  });

  // POST API FOR NEW SERVICE
  app.post("/services", async (req, res) => {
   const service = req.body;
   const result = await serviceCollection.insertOne(service);
   //  console.log(result);
   res.json(result);
  });

  // PUT API UPDATE STATUS
  app.put("/bookings/:id", (req, res) => {
   const id = req.params.id;
   const updatedInfo = req.body;
   bookingCollection
    .updateOne(
     { _id: ObjectId(id) },
     {
      $set: {
       status: updatedInfo.status,
      },
     }
    )
    .then((result) => res.send(result));
  });
 } finally {
  // await client.close();
 }
}
run().catch(console.dir);

// --------------------------------------------------

app.get("/", (req, res) => {
 res.send("TourX server home");
});

app.listen(port, () => {
 console.log(`Tripx server is running on port:${port}`);
});
