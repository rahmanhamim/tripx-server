const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

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

  const doc = {
   name: "Paris Hill Tour",
   img: "https://i.ibb.co/x76qZb4/tourPkg1.png",
   price: "180",
   rating: 3,
   tourDays: "6",
  };

  const result = await serviceCollection.insertOne(doc);
  console.log("added to db", result);
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
 console.log(`Tourx server is running on port:${port}`);
});
