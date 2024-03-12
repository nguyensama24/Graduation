const express = require('express');
const app = express();
const InvoiceController = require("../controller/Invoicesontroller")


app.post("/",InvoiceController.CreateInvoice)
app.get("/",InvoiceController.getInvoice)

module.exports = app;