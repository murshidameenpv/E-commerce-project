const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");

exports.adminLoginController = (req, res) => {
  res.redirect(302, "/admin");
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/admin");
  });
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


// ADMIN UPDATE PRODUCT
exports.adminUpdateProduct = async (req, res) => {
  console.log("server here")
  try {
    const productId = req.query.productId;
    console.log(productId);
    const { productName, category, price, stock, description } = req.body;
    console.log(req.file, "file")
    console.log(req.files)
    const newImages = req.files.map((file) => file.filename);
    const updatedProduct = await productDb.findByIdAndUpdate(
      productId,
      {
        $push: { image: { $each: newImages } },
        $set: {
          productName: productName,
          category: category,
          price: price,
          stock: stock,
          description: description,
          listed: true,
        },
      },
      { new: true }
    );
    res.status(201).json(updatedProduct);
  } catch (err) {
    console.error("Error creating new product:", err);
    res.status(500).send("Internal Server Error");
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
