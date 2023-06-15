const express = require("express");
const router = express.Router();
const adminRender = require("../services/admin-render");
const validate = require("../middleware/admin/validateAdmin");
const checkSession = require("../middleware/admin/checkSession");
const adminController = require("../controllers/admin-controller");
const upload = require("../middleware/admin/multer");

//GET METHODS

router.get("/admin",
        checkSession.ifLoggedIn,
        adminRender.adminLogin);
router.get("/admin/dashboard",
  checkSession.sessionExists,
  adminRender.adminDashboard
);
router.get("/admin/products",
  checkSession.sessionExists,
  adminRender.adminProductManagement
);
router.get("/admin/orders",
  checkSession.sessionExists,
  adminRender.adminOrderManagement
);
router.get("/admin/users",
  checkSession.sessionExists,
  adminRender.adminUserManagement
);
router.get( "/admin/category",
  checkSession.sessionExists,
  adminRender.adminCategoryManagement
);
router.get("/admin/charts",
  checkSession.sessionExists,
  adminRender.adminChartManagement
);
//POST METHODS
router.post("/adminLogout", adminController.adminLogout);
router.post("/admin",
  validate.checkAdminExists,
  adminController.adminLoginController
);

router.put("/api/admin/users/:id/block",
  checkSession.sessionExists,
  adminController.adminBlockUser
);
router.put("/api/admin/users/:id/unblock",
  checkSession.sessionExists,
  adminController.adminUnBlockUser
);
router.delete("/api/admin/users/:id/delete",
  checkSession.sessionExists,
  adminController.adminDeleteUser
);
router.post("/api/admin/product/add-product",
  checkSession.sessionExists,
  upload.array("image"),
  adminController.adminAddProduct
);
router.delete("/api/admin/product/:id/delete",
  checkSession.sessionExists,
  adminController.adminDeleteProduct
);
router.put("/api/admin/product/update",
  checkSession.sessionExists,
  upload.array('image'),
 adminController.adminUpdateProduct
);

module.exports = router;
