const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "./db.json";

const readTransactions = () => {
  try {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading transactions:", err);
    return [];
  }
};

const writeTransactions = (data) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing transactions:", err);
  }
};

app.get("/api/transactions", (req, res) => {
  res.json(readTransactions());
});

app.post("/api/transactions", (req, res) => {
  const transactions = readTransactions();
  const { description, amount, currency, type, category } = req.body;

  if (!category || !type || !description || !currency || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newTransaction = {
    id: transactions.length + 1,
    type,
    category,
    description,
    currency,
    amount: parseFloat(amount),
    date: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  writeTransactions(transactions);
  res.status(201).json({ message: "Transaction added", transaction: newTransaction });
});

app.put("/api/transactions/:id", (req, res) => {
  let transactions = readTransactions();
  const { id } = req.params;
  const trxIndex = transactions.findIndex((t) => t.id == id);

  if (trxIndex === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions[trxIndex] = { ...transactions[trxIndex], ...req.body };

  writeTransactions(transactions);
  res.json({ message: "Transaction updated", transaction: transactions[trxIndex] });
});

app.delete("/api/transactions/:id", (req, res) => {
  let transactions = readTransactions();
  const { id } = req.params;
  const trxIndex = transactions.findIndex((t) => t.id == id);

  if (trxIndex === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions.splice(trxIndex, 1);
  writeTransactions(transactions);
  res.json({ message: "Transaction deleted" });
});

app.get("/api/transactions/income", (req, res) => {
  const transactions = readTransactions().filter((t) => t.type === "income");
  res.json(transactions);
});

app.get("/api/transactions/expense", (req, res) => {
  const transactions = readTransactions().filter((t) => t.type === "expense");
  res.json(transactions);
});

app.get("/exchange-rate/:currency", async (req, res) => {
  const { currency } = req.params;
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`);
    if (!response.data.conversion_rates[currency]) {
      return res.status(400).json({ error: "Invalid currency code" });
    }
    res.json({ rate: response.data.conversion_rates[currency] });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    res.status(500).json({ error: "Error fetching exchange rate" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
