
const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const categoryDb = require("../models/categorySchema");
const bannerDb = require("../models/bannerSchema");
const brandDb = require("../models/brandSchema");
const couponDb = require('../models/couponSchema')
const orderDb = require('../models/orderSchema')
 
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
    const perPage = 10; // Number of users per page
    const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter
    const totalUsers = await userDb.countDocuments(); // Get the total number of users
    const totalPages = Math.ceil(totalUsers / perPage); // Calculate the total number of pages
    const users = await userDb
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();  
    res.render("admin/userManage", { users, currentPage: page, totalPages });
  } catch (err) {
    console.error("Error fetching users from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminProductManagement = async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the current page from the query parameter (default to 1 if not provided)
    const limit = 8; // Number of products to display per page
    const count = await productDb.countDocuments(); // Get the total count of products
    const totalPages = Math.ceil(count / limit); // Calculate the total number of pages
    const skip = (page - 1) * limit; // Calculate the number of products to skip based on the current page
    const products = await productDb
      .find()
      .populate("category")
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .exec();
    const categories = await categoryDb.find().exec();
    const brands = await brandDb.find().exec();
    res.render("admin/products", {
      products,
      categories,
      brands,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching products from MongoDB", err);
    res.status(500).send("Internal Server Error");
  }
};



exports.adminDashboard = (req, res) => {
  res.render("admin/index");
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

exports.adminBannerManagement = async (req, res) => {
  try {
    const banners = await bannerDb.find().exec()
    res.render("admin/banners",{banners})
  } catch (err) {
    console.error("Error fetching banners from mongoDB", err);
    res.status(500).send("Internal Server Error")
  }
}

exports.adminBrandManagement = async (req, res) => {
  try {
    const brands = await brandDb.find().populate("category").exec();
    const category = await categoryDb.find().exec()
    res.render("admin/brands", { brands, category });
  } catch (err) {
    console.error("Error retrieving brands:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminCouponManagement = async (req, res) => {
  try {
    const coupons = await couponDb.find().exec();
    res.render("admin/coupon", { coupons });
  } catch (error) {
    console.error(error);
    res.status(500).sens("Internal Server Error");
  }
};


exports.adminChartManagement = (req, res) => {
  res.render("admin/charts");
};

exports.adminOrderManagement = async (req, res) => {
  try {
    const orders = await orderDb
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name" }) // Populate only the 'name' field of the 'user' reference
      .populate({ path: "items.product", select: "productName image" }); // Populate the 'name' and 'image' fields of the 'items.product' reference

const rejectedOrder = await orderDb
  .find({ status: "Rejected" })
  .sort({ createdAt: -1 })
  .populate({ path: "user", select: "name" })
  .populate({ path: "items.product", select: "productName image" });

const shippedOrder = await orderDb
  .find({ status: "Shipped" })
  .sort({ createdAt: -1 })
  .populate({ path: "user", select: "name" })
  .populate({ path: "items.product", select: "productName image" });

const processingOrder = await orderDb
  .find({ status: "Processing" })
  .sort({ createdAt: -1 })
  .populate({ path: "user", select: "name" })
  .populate({ path: "items.product", select: "productName image" });

const deliveredOrder = await orderDb
  .find({ status: "Delivered" })
  .sort({ createdAt: -1 })
  .populate({ path: "user", select: "name" })
  .populate({ path: "items.product", select: "productName image" });

const canceledOrder = await orderDb
  .find({ status: "Canceled" })
  .sort({ createdAt: -1 })
  .populate({ path: "user", select: "name" })
  .populate({ path: "items.product", select: "productName image" });

   res.render("admin/orders", {
     orders,
     rejectedOrder,
     shippedOrder,
     processingOrder,
     deliveredOrder,
     canceledOrder,
   });
  } catch (err) {
    console.error(err);
    res.status(500).send(" Internal Server error");
  }
};


exports.  adminViewOrderDetails = async (req, res) => {
  const orderId = req.query.orderId;
  try {
    const order = await orderDb.findOne({ _id: orderId }).populate({
      path: "items.product",
      populate: ["brand", "category"],
    });
    const user = await userDb.findOne({ _id: order.user });
    const address = user.address.id(order.address);
    res.render("admin/orderDetails", {
      order,
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving order details");
  }
};

