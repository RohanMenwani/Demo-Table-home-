const express = require("express");
const cors = require("cors");

const Emp = require("./models/emp.model");
const { query } = require("express");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/api", async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  let query = Emp.find();

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numEmp = await Emp.countDocuments();
    if (skip >= numEmp)
      return res.status(400).json({
        status: "fail",
        data: {
          data: "page not found",
        },
      });
  }

  const data = await query;

  res.status(200).json({
    status: "success",
    results: data.length,
    data: {
      data,
    },
  });
});

app.post("/api", async (req, res) => {
  try {
    const data = await Emp.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err: err.message,
    });
  }
});

app.delete("/api/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Emp.deleteOne({ _id: id });
    res.status(204).json({
      status: "success",
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      data: {
        data: err.message,
      },
    });
  }
});

module.exports = app;
