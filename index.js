const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { connection } = require("./database/connection");
const { WebhookClient } = require("dialogflow-fulfillment");

// Models
const Customer = require("./models/Customer");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const { response } = require("express");

const port = process.env.PORT || 6000;

// for parsing json
app.use(bodyParser.json({ limit: "50mb" }));

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.get("/", function (req, res) {
  res.send("Hello World desde la raiz /");
});

// Conexion a la BD
connection();

app.post("/webhook", express.json(), function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  // Create Customers
  function createCustomer(agent) {
    saveCustomerData(agent);
    agent.add(`Se ha creado el cliente ${agent.parameters["fullName"]} 
        
        Marca:
        
        0 Regresar al menu
        9 Salir`);
  }

  function saveCustomerData(agent) {
    let fullName = agent.parameters["fullName"];
    let email = agent.parameters["email"];
    let phone = agent.parameters["phone"];

    const customer = new Customer({
      fullName,
      email,
      phone,
    });
    customer.save((err, customerStored) => {
      if (err) {
        console.log("Error al guardar el cliente", err);
      } else {
        console.log("Cliente guardado correctamente", customerStored);
      }
    });
  }

  // GET Products
  const getProducts = async (agent) => {
    const products = await Product.find();
    console.log(products);

    if (products.length === 0) {
      agent.add("No hay productos disponibles");
    } else {
      const productsList = products.map((product) => {
        // agregar return con salto de linea para que se vea bien en el chat
        return `
        ${product.name} - ${product.price}`;
      });
      agent.add(`Los productos disponibles son: 
      
    ${productsList.join(`, `)}
        
    Para continuaer escribe "vender"`);
    }
  };

  // GET Products voleo
  const getProductsVoleo = async (agent) => {
    const products = await Product.find();

    // agregar un filtro para que solo muestre los productos que tengan hardWork en true
    const productsHardWork = products.filter((product) => {
        return product.hardWork === "Si";   
    });

    if (productsHardWork.length === 0) {
      agent.add("No hay productos disponibles para voleo");
    } else {
      const productsList = productsHardWork.map((product) => {
        return `
            ${product.name} - ${product.price}`;
      });
      agent.add(`Los productos disponibles son: 
          
        ${productsList.join(`, `)}
            
        Para continuaer escribe "vender"`);
    }
  };

  // Create Products
  function createProduct(agent) {
    saveProductData(agent);
    agent.add(`Se ha creado el producto ${agent.parameters["name"]} 
        
        Marca:

        0 Regresar al menu
        9 Salir`);
  }

  function saveProductData(agent) {
    let name = agent.parameters["name"];
    let img = agent.parameters["img"];
    let hardWork = agent.parameters["hardWork"];
    let price = agent.parameters["price"];

    const product = new Product({
      name,
      img,
      hardWork,
      price,
    });

    product.save((err, productStored) => {
      if (err) {
        console.log("Error al guardar el producto", err);
      } else {
        console.log("Producto guardado correctamente", productStored);
      }
    });
  }

  // Crear userios
  function createUser(agent) {
    saveUserData(agent);
    agent.add(`Se ha creado el usuario ${agent.parameters["fullName"]} 
        
        Marca:

        0 Regresar al menu
        9 Salir`);
  }

  function saveUserData(agent) {
    let fullName = agent.parameters["fullName"];
    let email = agent.parameters["email"];
    let mobile = agent.parameters["mobile"];
    let role = agent.parameters["role"];
    let company = agent.parameters["company"];
    let industry = agent.parameters["industry"];

    const user = new User({
      fullName,
      email,
      mobile,
      role,
      company,
      industry,
    });

    user.save((err, userStored) => {
      if (err) {
        console.log("Error al guardar el user", err);
      } else {
        console.log("usuario guardado correctamente", userStored);
      }
    });
  }

  // Crear Venta normal
  function createOrder(agent) {
    saveOrderData(agent);
    agent.add(`Se ha creado una venta a ${agent.parameters["fullName"]} de ${agent.parameters["name"]}, una cantidad de ${agent.parameters["quantity"]}, el metodo de pago ${agent.parameters["tipo"]}
        
        Marca:

        0 Regresar al menu
        9 Salir`);
  }

  const saveOrderData = async (agent) => {
    const fullName = agent.parameters["fullName"];
    const name = agent.parameters["name"];
    const quantity = agent.parameters["quantity"];
    const tipo = agent.parameters["tipo"];

    const client = await Customer.findOne({ fullName: fullName });
    if (!client) {
      throw new Error("El cliente no existe");
    }

    const customer = client._id;
    const productos = [];

    const p = await Product.findOne({ name: name });
    if (!p) {
      return res.status(400).send(`El producto no existe`);
    }

    const product = p._id;
    const total = p.price * quantity;
    productos.push({ producto: product, cantidad: quantity, total: total, tipo: tipo });

    const order = new Order({
      customer,
      productos,
    });

    try {
      const orderStored = await order.save();
      console.log("Orden guardada correctamente", orderStored);
      return "La orden se ha guardado correctamente.";
    } catch (error) {
      console.log("Error al guardar la orden", error);
      throw new Error("Ha ocurrido un error al guardar la orden.");
    }
  };

  function parametrizacion(agent) {
    agent.add(`Bienvenido a la parametrización de Crezgo Bot
        
        Marca:

        0 Regresar al menu 
        1 Crear cliente
        2 Crear producto
        3 Crear usuario
        9 Salir`);
  }

  function operacion(agent) {
    agent.add(`Bienvenido a la operación de Crezgo Bot
        
        Marca:

        0 Regresar al menu 
        1 Crear una venta
        2 Crear una compra
        9 Salir`);
  }

  function compra(agent) {
    agent.add(`Operación de compra Crezgo Bot
        
    ⚠️ Funcionalidad en Desarrollo...
        
        Marca:

        0 Regresar al menu
        9 Salir`);
  }

  let intentMap = new Map();
  // Parametrizacion
  intentMap.set("IniciarParameterization", parametrizacion);

  // Clientes
  intentMap.set("Customers.create", createCustomer);

  // Productos
  intentMap.set("Products.create", createProduct);
  intentMap.set("Products.get", getProducts);
  intentMap.set("Products.get.voleo", getProductsVoleo);

  // Usuarios
  intentMap.set("Users.create", createUser);

  // Operacion
  intentMap.set("IniciarOperacion", operacion);

  // Operacion de Venta
  intentMap.set("Operacion.venta.create", createOrder);

  // Operacion de Compra
  intentMap.set("Operacion.compra", compra);

  agent.handleRequest(intentMap);
});

app.listen(port, () =>
  console.log(`Estamos ejecutando el servidor en el puerto: ${port}`)
);
