import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const port = 3000;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded());

app.use(express.static("./views"));

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("club");
const membersCollection = db.collection("member");

app.get("/members", async (req, res) => {
  const members = await membersCollection.find({}).toArray();
  // console.log(members);
  res.render("members", {
    members,
  });
});

//sortera
app.get("/members/sort/asc", async (req, res) => {
  const members = await membersCollection.find({}).sort({ name: 1 }).toArray();
  console.log(members);

  res.render("members", {
    members,
  });
});

app.get("/members/sort/desc", async (req, res) => {
  const members = await membersCollection.find({}).sort({ name: -1 }).toArray();
  console.log(members);

  res.render("members", {
    members,
  });
});

app.get("/member/:id", async (req, res) => {
  const member = await membersCollection.findOne({
    _id: ObjectId(req.params.id),
  });
  res.render("member", {
    name: member.name,
    email: member.email,
    phone: member.phone,
    date: member.date,
    other: member.other,
    _id: member._id,
  });
});

app.get("/members/create", (req, res) => {
  res.render("create");
});

app.post("/members/create", async (req, res) => {
  await membersCollection.insertOne({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    date: new Date(req.body.date),
    other: req.body.other,
  });
  res.redirect("/members");
});

//uppdatera medlem
app.post("/member/update/:id", async (req, res) => {
  await membersCollection.updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        date: new Date(req.body.date),
        other: req.body.other,
      },
    }
  );
  res.redirect("/members");
});

app.get("/", (req, res) => {
  res.render("index", {});
});

app.get("/member/delete/:id", async (req, res) => {
  await membersCollection.deleteOne({ _id: ObjectId(req.params.id) });
  res.redirect("/members");
});

app.listen(port, () => console.log(`Listening on ${port}`));
