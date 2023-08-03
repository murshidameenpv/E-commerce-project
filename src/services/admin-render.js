
const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const categoryDb = require("../models/categorySchema");
const bannerDb = require("../models/bannerSchema");
const brandDb = require("../models/brandSchema");
const couponDb = require('../models/couponSchema')
const orderDb = require('../models/orderSchema')
var moment = require("moment");

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

exports.adminOrderManagement = async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the current page from the query parameter (default to 1 if not provided)
    const limit = 10; 
    const count = await orderDb.countDocuments(); 
    const totalPages = Math.ceil(count / limit); 
    const skip = (page - 1) * limit;
    const orders = await orderDb
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name" }) // Populate only the 'name' field of the 'user' reference
      .populate({ path: "items.product", select: "productName image" }) // Populate the 'name' and 'image' fields of the 'items.product' reference
      .skip(skip)
      .limit(limit)
      .exec();
    const shippedOrder = await orderDb
      .find({ status: "Shipped" })
      .sort({ shippedAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });

    const placedOrder = await orderDb
      .find({ status: "Placed" })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });
    const processingOrder = await orderDb
      .find({ status: "Processing" })
      .sort({ processedAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });

    const deliveredOrder = await orderDb
      .find({ status: "Delivered" })
      .sort({ deliveredAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });

    const cancelledOrder = await orderDb
      .find({ status: "Cancelled" })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });
    const returnedOrder = await orderDb
      .find({ status: "Returned" })
      .sort({ returnedAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });
    const refundedOrder = await orderDb
      .find({ status: "Refunded" })
      .sort({ refundedAt: -1 })
      .populate({ path: "user", select: "name" })
      .populate({ path: "items.product", select: "productName image" });

    res.render("admin/orders", {
      orders,
      placedOrder,
      shippedOrder,
      processingOrder,
      deliveredOrder,
      cancelledOrder,
      returnedOrder,
      refundedOrder,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(" Internal Server error");
  }
};


exports.adminViewOrderDetails = async (req, res) => {
  const orderId = req.query.orderId;
  try {
    const order = await orderDb.findOne({ _id: orderId }).populate({
      path: "items.product",
      populate: ["brand", "category"],
    });
  const address = order.address;
    res.render("admin/orderDetails", {
      order,
      address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving order details");
  }
};

exports.adminDashboard = async (req, res) => {
  const deliveredOrders = await orderDb
    .find({ status: "Delivered" })
    .populate("user", "name")
    .select("user total createdAt payment_method deliveredAt");
  const totalAmount = deliveredOrders.reduce(
    (acc, order) => acc + order.total,
    0
  );
  const userCount = await userDb.countDocuments();
  const deliveredOrderCount = await orderDb.countDocuments({
    status: "Delivered",
  });

  const placedCount = await orderDb.countDocuments({ status: "Placed" });
  const deliveredCount = await orderDb.countDocuments({ status: "Delivered" });
  const cancelledCount = await orderDb.countDocuments({ status: "Cancelled" });
  const shippedCount = await orderDb.countDocuments({ status: "Shipped" });
  const processingCount = await orderDb.countDocuments({
    status: "Processing",
  });
  // Get the start and end dates for the current week
  const startOfCurrentWeek = moment().startOf("week").toDate();
  const endOfCurrentWeek = moment().endOf("week").toDate();

  // Get the start and end dates for the previous week
  const startOfPrevWeek = moment().subtract(1, "week").startOf("week").toDate();
  const endOfPrevWeek = moment().subtract(1, "week").endOf("week").toDate();

  // Find the total paid amount of delivered orders for each day in the current week
  const currentWeekSales = await orderDb.aggregate([
    {
      $match: {
        status: "Delivered",
        deliveredAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalAmount: { $sum: "$total" },
      },
    },
  ]);

  // Find the total paid amount of delivered orders for each day in the previous week
  const prevWeekSales = await orderDb.aggregate([
    {
      $match: {
        status: "Delivered",
        deliveredAt: { $gte: startOfPrevWeek, $lte: endOfPrevWeek },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalAmount: { $sum: "$total" },
      },
    },
  ]);

  // Convert the aggregation results to arrays
  const currentWeekSalesArray = Array(7).fill(0);
  for (const { _id, totalAmount } of currentWeekSales) {
    currentWeekSalesArray[_id - 1] = totalAmount;
  }
  const prevWeekSalesArray = Array(7).fill(0);
  for (const { _id, totalAmount } of prevWeekSales) {
    prevWeekSalesArray[_id - 1] = totalAmount;
  }
  res.render("admin/index", {
    deliveredOrders,
    totalAmount,
    userCount,
    deliveredOrderCount,
    placedCount,
    deliveredCount,
    cancelledCount,
    shippedCount,
    processingCount,
    currentWeekSalesArray,
    prevWeekSalesArray,
  });
}