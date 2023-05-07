const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose.connect(process.env.DATABASE).then((con) => {
  // console.log(con.connections);
  console.log("DB connection successful");
});

const port = process.env.port || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
