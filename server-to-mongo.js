import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const Product = mongoose.model("Product", {
  title: String,
  price: Number,
});

app.get("/products", (req, res) => {
  const { title } = req.query;
  Product.find().then((products) => {
    if (title) {
      const productsFilter = products.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(productsFilter);
    } else {
      res.send(products);
    }
  });
});

app.post("/products", (req, res) => {
  const { title } = req.body;
  Product.insertMany([
    {
      title,
      price: 30,
    },
  ]).then((products) => res.send(products));
});

app.patch("/products/:productId", (req, res) => {
  const { title } = req.body;
  const { productId } = req.params;
  Product.findByIdAndUpdate(productId, {
    title,
  })
    .then((product) => res.send(product))
    .catch((e) => res.send("ERROR!"));
});

app.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;
  Product.findByIdAndRemove(productId)
    .then((product) => res.send(product))
    .catch((e) => res.send("ERROR!"));
});

mongoose.connect("mongodb://localhost:27017/go-code-shop").then(() => {
  app.listen(8000);
});
