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
  "/admin/products",
  checkSession.sessionExists,
  adminRender.adminProductManagement
);
router.get(
  "/admin/orders",
  checkSession.sessionExists,
  adminRender.adminOrderManagement
);
router.get(
  "/admin/users",
  checkSession.sessionExists,
  adminRender.adminUserManagement
);
router.get(
  "/admin/category",
  checkSession.sessionExists,
  adminRender.adminCategoryManagement
);
router.get(
  "/admin/charts",
  checkSession.sessionExists,
  adminRender.adminChartManagement
);
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
router.delete(
  "/api/admin/product/delete-image",
  checkSession.sessionExists,
  adminController.deleteProductImage
);
router.post(
  "/api/admin/category/add-category",
  checkSession.sessionExists,
  adminController.adminAddCategory  
);
router.delete(
  "/api/admin/category/:id/delete",
  checkSession.sessionExists,
  adminController.deleteCategory
)


module.exports = router;
