const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const categoryDb = require("../models/categorySchema");

exports.adminLogin = (req, res) => {
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
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating new product:", err);
    res.status(500).send("Internal Server Error");
  }
};


// ADMIN UPDATE PRODUCT
exports.adminUpdateProduct = async (req, res) => {
  try {
    const productId = req.query.productId;
    console.log("server here", productId);
    console.log("body here", req.body);
    const { productName, category, price, stock, description } = req.body;
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




//PRODUCT LISTED UNLISTED CONTROLLER
exports.adminListProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await productDb.findByIdAndUpdate(productId, { listed: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.adminUnListProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await productDb.findByIdAndUpdate(productId, { listed: false });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminAddCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const newCategory = await categoryDb.create({ category })
    res.status(201).json(newCategory);
  }
  catch (err) {
    console.error("Error creating new Category:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    await categoryDb.findByIdAndRemove(categoryId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error Deleting  data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};