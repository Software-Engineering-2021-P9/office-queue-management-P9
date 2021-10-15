const express = require("express");
const { json } = require("express");
const path = require("path");
const cors = require("cors");
const { getTicketsByServiceType } = require("./dao/dao");

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(json());

app.use("/", express.static(path.resolve(__dirname, "../client/build")));

app.get("/tickets/:serviceTypeId", (req, res) => {
  const serviceTypeId = req.params.serviceTypeId;
  getTicketsByServiceType(serviceTypeId)
    .then((tickets) => {
      res.send(tickets);
    })
    .catch((err) => console.error("error reading data from database: " + err));
});

app.listen(port, () => {
  console.log(`Server listening at :${port}`);
});

// Export main app for testing
module.exports = app;
