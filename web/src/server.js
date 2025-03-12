import express from "express";
import bodyParser from "body-parser";
import { homeRoute } from "./routes/home.js";
import { newPublisherRoute } from "./routes/new-publisher.js";
import { createPublisherRoute } from "./routes/create-publisher.js";
import { deletePublisherRoute } from "./routes/delete-publisher.js";
import { deleteSoftwaresRoute } from "./routes/delete-softwares.js";

const app = express();
const port = 8080;

// Support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", homeRoute);
app.get("/publishers/new", newPublisherRoute);
app.post("/publishers/new", createPublisherRoute);
app.post("/publishers/:id/delete", deletePublisherRoute);
app.post("/softwares/delete", deleteSoftwaresRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
