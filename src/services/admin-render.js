
const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const categoryDb = require("../models/categorySchema");

exports.adminLogin = (req, res) => {
  let message = "";
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message;
  }
  res.render("admin/login", { message });
};

exports.adminUserManagement = async (req, res) => {
  try {
    const users = await userDb.find().exec();
    res.render('admin/userManage', { users });
  } catch (err) {
    console.error("Error fetching users from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};



exports.adminProductManagement = async (req, res) => {
  try {
    const products = await productDb.find().exec();
    const category = await categoryDb.find().exec();
    res.render("admin/products", { products,category });
  } catch (err) {
    console.error("Error fetching users from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.adminDashboard = (req, res) => {
  res.render("admin/index");
};

exports.adminOrderManagement = (req, res) => {
  res.render("admin/orders");
};

exports.adminCategoryManagement = async (req, res) => {
  try {
    const categories = await categoryDb.find().exec();

    res.render("admin/category", { categories });
  } catch (err) {
    console.error("Error fetching categories from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminChartManagement = (req, res) => {
  res.render("admin/charts");
};
