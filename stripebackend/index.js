const cors = require("cors");

const express = require("express");
const app = express();
//insert stripe secret key in second set of brackets below
const stripe = require("stripe")("");
const { v4: uuidv4 } = require("uuid");

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("It works");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product", product);
  console.log("Price", product.price);
  const idempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.listen(8282, () => console.log("Listening on Port 8282"));
