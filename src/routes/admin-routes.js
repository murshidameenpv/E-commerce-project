const express = require("express");
const router = express.Router();
const adminRender = require("../services/admin-render");
const validate = require("../middleware/admin/validateAdmin");
const checkSession = require("../middleware/admin/checkSession");
const adminController = require("../controllers/admin-controller");
const upload = require("../middleware/admin/multer");
//GET METHODS

router.get(
  "/admin",
        checkSession.ifLoggedIn,
        adminRender.adminLogin);
router.get(
  "/admin/dashboard",
  checkSession.sessionExists,
  adminRender.adminDashboard
);
router.get(
  "/admin/products/:page?",
  checkSession.sessionExists,
  adminRender.adminProductManagement
);
router.get(
  "/admin/orders",
  checkSession.sessionExists,
  adminRender.adminOrderManagement
);
router.get(
  "/admin/orders/details",
  checkSession.sessionExists,
  adminRender.adminViewOrderDetails
)
router.get(
  "/admin/users/:page?",
  checkSession.sessionExists,
  adminRender.adminUserManagement
);
router.get(
  "/admin/category",
  checkSession.sessionExists,
  adminRender.adminCategoryManagement
);
router.get(
  "/admin/banners",
checkSession.sessionExists,
adminRender.adminBannerManagement
);
router.get(
  "/admin/brands",
  checkSession.sessionExists,
  adminRender.adminBrandManagement
)
router.get(
  "/admin/coupons",
  checkSession.sessionExists,
  adminRender.adminCouponManagement
)
//POST METHODS
router.post(
  "/adminLogout", adminController.adminLogout);
router.post(
  "/admin",
  validate.checkAdminExists,
  adminController.adminLogin
);

router.put(
  "/api/admin/users/:id/block",
  checkSession.sessionExists,
  adminController.adminBlockUser
);
router.put(
  "/api/admin/users/:id/unblock",
  checkSession.sessionExists,
  adminController.adminUnBlockUser
);
router.delete(
  "/api/admin/users/:id/delete",
  checkSession.sessionExists,
  adminController.adminDeleteUser
);
router.post(
  "/api/admin/product/add-product",
  checkSession.sessionExists,
  upload.array("image"),
  adminController.adminAddProduct
);

router.put(
  "/api/admin/product/:id/block",
  checkSession.sessionExists,
  adminController.adminListProduct
);
router.put(
  "/api/admin/product/:id/unblock",
  checkSession.sessionExists,
  adminController.adminUnListProduct
);

router.put(
  "/api/admin/product/update",
  checkSession.sessionExists,
  upload.array('image'),
 adminController.adminUpdateProduct
);
router.post(
  "/api/admin/product/delete-image",
  checkSession.sessionExists,
  adminController.deleteProductImage
);
router.post(
  "/api/admin/category/add-category",
  checkSession.sessionExists,
  adminController.adminAddCategory  
);
router.put(
  "/api/admin/category/update",
  checkSession.sessionExists,
  adminController.adminUpdateCategory  
);

router.post(
  "/api/admin/product/add-banner",
  checkSession.sessionExists,
  upload.array("image"),
  adminController.adminAddBanner
);
router.delete(
  "/api/admin/banner/:id/delete",
  checkSession.sessionExists,
  adminController.deleteBanner
);
router.post(
  "/api/admin/brand/add-brand",
  checkSession.sessionExists,
  adminController.adminAddBrand
);
router.delete(
  "/api/admin/brand/:id/delete",
  checkSession.sessionExists,
  adminController.deleteBrand
);

router.post(
  "/api/admin/coupon/add-coupon",
checkSession.sessionExists,
adminController.addCoupon);

router.put(
  "/api/admin/coupon/:id/:action",
  checkSession.sessionExists,
  adminController.adminActivationCoupon
);
router.delete(
  "/api/admin/coupon/:id/delete",
  checkSession.sessionExists,
  adminController.adminDeleteCoupon
);
router.post(
  "/api/admin/order/reject",
  checkSession.sessionExists,
  adminController.rejectOrderByAdmin
)
router.post(
  "/api/admin/order/process",
  checkSession.sessionExists,
  adminController.processOrderByAdmin
)

router.post(
  "/api/admin/order/ship",
  checkSession.sessionExists,
  adminController.shipOrderByAdmin
)

router.post(
  "/api/admin/order/deliver",
  checkSession.sessionExists,
  adminController.deliverOrderByAdmin
)
router.post(
  "/api/admin/order/refund",
  checkSession.sessionExists,
  adminController.refundAmountByAdmin
)

module.exports = router;
