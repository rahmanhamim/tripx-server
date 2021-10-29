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
   console.log("getting specific service", id);
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
  // -----------------------------------------------------------------------------------------------------
  // GET USER BOOKING DATA
  // app.get("/bookings/:email", async (req, res) => {
  //  const email = req.params?.email;
  //  console.log("getting specific  user data", email);
  //  const query = { email: email.toString() };
  //  const result = await bookingCollection.find({ query }).toArray();
  //  console.log(result);
  //  res.json(result);
  // });

  // GET BOOKING BY EMAIL
  app.get("/bookings/:email", (req, res) => {
   console.log(req.params);
   bookingCollection
    .find({ email: req.params.email })
    .toArray((err, results) => {
     res.send(results);
    });
  });

  // -----------------------------------------------------------------------------------------------------
  //
  //
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
