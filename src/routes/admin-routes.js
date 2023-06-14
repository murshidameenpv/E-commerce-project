const express = require('express');
const router = express.Router();
const adminRender = require('../services/admin-render');
const validate = require('../middleware/admin/validateAdmin')
const checkSession = require('../middleware/admin/checkSession')
const adminController = require('../controllers/admin-controller')
const upload = require('../middleware/admin/multer');
const { isAdminLoggedIn } = require('../middleware/admin/checkSession');



//GET METHODS

router.get('/admin', adminRender.adminLogin);
router.get('/admin/dashboard',
        checkSession.sessionExists,
        adminRender.adminDashboard);
router.get('/admin/products',
        checkSession.sessionExists,
        adminRender.adminProductManagement);
router.get('/admin/orders',
        checkSession.sessionExists,
        adminRender.adminOrderManagement);
router.get('/admin/users',
        checkSession.sessionExists,
        adminRender.adminUserManagement);
router.get('/admin/category',
        checkSession.sessionExists,
        adminRender.adminCategoryManagement);
router.get('/admin/charts',
        checkSession.sessionExists,
        adminRender.adminChartManagement);      

//POST METHODS
router.post('/admin',
        validate.checkAdminExists,
        adminController.adminLoginController
);
//user
router.get(
  "/api/admin/users", isAdminLoggedIn, adminController.adminFindUser
);
router.put('/api/admin/users/:id/block', adminController.adminBlockUser)
router.put('/api/admin/users/:id/unblock', adminController.adminUnBlockUser)
router.delete('/api/admin/users/:id/delete', adminController.adminDeleteUser)
//products
// router.get('/api/admin/products',adminController.adminFindAllProduct)
router.post('/api/admin/product/add-product', upload.array('image'), adminController.adminAddProduct)
router.delete('/api/admin/product/:id/delete', adminController.adminDeleteProduct)
router.get('/api/admin/product', adminController.getProductById)
router.put('/api/admin/product/update',adminController.adminUpdateProduct)



module.exports = router;