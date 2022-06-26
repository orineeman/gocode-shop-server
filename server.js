import express from "express";
import fs from "fs/promises";
// const port = 8000;

const app = express();
app.use(express.json());

app.get("/products", (req, res) => {
  fs.readFile("./products.json", "utf-8").then((products) => {
    const productsInJson = JSON.parse(products);
    if (req.query) {
      const { title } = req.query;
      const filterProducts = productsInJson.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(filterProducts);
    } else {
      res.send(productsInJson);
    }
  });
});

app.get("/products/:id", (req, res) => {
  fs.readFile("./products.json", "utf-8").then((products) => {
    const productsInJson = JSON.parse(products);
    const requestedProduct = productsInJson.find(
      (product) => product.id === +req.params.id
    );
    res.send(requestedProduct);
  });
});

app.post("/products", (req, res) => {
  console.log(req.body);
  if (req.body.title) {
    fs.readFile("./products.json", "utf-8").then((products) => {
      const productsInJson = JSON.parse(products);
      const newProduct = {
        id: getMaxId(productsInJson) + 1,
        title: req.body.title,
        price: 0,
        description: "no description",
        category: "no category",
        image: "no image",
        rating: {
          rate: 0,
          count: 0,
        },
      };
      productsInJson.push(newProduct);
      fs.writeFile("./products.json", JSON.stringify(productsInJson));
      res.send(productsInJson);
    });
  } else res.send("please enter product");
});

app.patch("/products/:productId", (req, res) => {
  const { productId } = req.params;
  fs.readFile("./products.json", "utf-8")
    .then((products) => {
      console.log(products);
      const productsInJson = JSON.parse(products);
      const productIndex = productsInJson.findIndex(
        (product) => product.id === +productId
      );
      productsInJson[productIndex] = {
        ...productsInJson[productIndex],
        ...req.body,
      };
      fs.writeFile("./products.json", JSON.stringify(productsInJson)).then(
        () => {
          res.send(productsInJson[productIndex]);
        }
      );
    })
    .catch((e) => res.send("error"));
});

function getMaxId(arr) {
  const ids = arr.map((object) => {
    return object.id;
  });

  const max = Math.max(...ids);
  return max;
}

app.delete("/products/:productId", (req, res) => {
  const { productId } = req.params;
  fs.readFile("./products.json", "utf-8")
    .then((products) => {
      const productsInJson = JSON.parse(products);
      const productIndex = productsInJson.findIndex(
        (product) => product.id === +productId
      );
      if (productIndex >= 0) {
        productsInJson.splice(productIndex, 1);
      }
      fs.writeFile("./products.json", JSON.stringify(productsInJson)).then(
        () => {
          res.send(productsInJson);
        }
      );
    })
    .catch((e) => res.send("error"));
});

// app.listen(port, () => console.log(`listening on port ${port}`));
app.listen(8000);
