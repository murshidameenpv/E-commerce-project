const express = require('express');
const router = express.Router();
const adminRender = require('../services/admin-render');
const validate = require('../middleware/admin/validateAdmin')
const checkSession = require('../middleware/admin/checkSession')
const adminController = require('../controllers/admin-controller')



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

//POST METHODS
router.post('/admin',
        validate.checkAdminExists,
        adminController.adminLoginController
);

//CRUD OPERATIONS API
router.get('/api/admin/users',adminController.adminFindUser)
router.put('/api/admin/users/:id/block', adminController.adminBlockUser)
router.put('/api/admin/users/:id/unblock', adminController.adminUnBlockUser)
router.delete('/api/admin/users/:id/delete', adminController.adminDeleteUser)


module.exports = router;