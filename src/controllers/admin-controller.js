const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");

exports.adminLoginController = (req, res) => {
  res.redirect(302, "/admin/dashboard");
};

//ADMIN USERS VIEW CONTROLLER
exports.adminFindUser = async (req, res) => {
  try {
    console.log("apicall");
      const userData = await userDb.find();
      res.send(userData);
  } catch (err) {
    console.error("Error retrieving data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

//ADMIN BLOCK_UNBLOCK CONTROLLER
exports.adminBlockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndUpdate(userId, { isBlocked: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.adminUnBlockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndUpdate(userId, { isBlocked: false });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

//ADMIN DELETE USER CONTROLLER
exports.adminDeleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndRemove(userId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error Deleting  data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

// ADMIN NEW PRODUCT
exports.adminAddProduct = async (req, res) => {
  try {
    const { productName, category, price, stock, description } = req.body;
    const images = req.files.map((file) => file.filename);
    const newProduct = await productDb.create({
      productName: productName,
      category: category,
      price: price,
      stock: stock,
      description: description,
      image: images,
      listed: true,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating new product:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ADMIN VIEW PRODUCTS
exports.adminFindAllProduct = async (req, res) => {
  try {
    const productsData = await productDb.find();
    console.log(productsData);
    res.send(productsData);
  } catch (err) {
    console.error("Error retrieving data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

//ADMIN GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  const productId = req.query.id;
  console.log(productId);
  try {
    const product = await productDb.findById(productId);
    res.json(product);
  } catch (err) {
    console.error("Error retrieving data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

// ADMIN UPDATE PRODUCT
exports.adminUpdateProduct = async (req, res) => {
  const productId = req.query.id;
  const updatedData = req.body.data;
  console.log(productId);
  console.log(updatedData, "ooooooooooooooooooo");

  try {
    const updatedProduct = await userDb.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );
    res.status(200).json({ success: true, updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//ADMIN DELETE PRODUCTS
exports.adminDeleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await productDb.findByIdAndRemove(productId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error Deleting  data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};
