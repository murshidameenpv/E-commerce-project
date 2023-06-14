const axios = require('axios');




exports.adminLogin = (req, res) => {
  let message = "";
  if (req.session.message) {
    message = req.session.message;
    delete req.session.message
  }
  res.render('admin/login', { message });
}




exports.adminUserManagement = async (req, res) => {
     try {
        const response = await axios.get('http://localhost:8000/api/admin/users'); // Make a GET request to the user API endpoint
       const users = response.data //Extract the data
         res.render('admin/userManage', { users });
     }
     catch (err) { 
        console.error('Error fetching users from MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
  }


exports.adminProductManagement = async (req, res) => { 
try {
       const response = await axios.get('http://localhost:8000/api/admin/products'); // Make a GET request to the user API endpoint
       const products = response.data //Extract the data
         res.render('admin/products', { products });
     }
     catch (err) { 
        console.error('Error fetching users from MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
}
  




exports.adminAddUser = (req, res) => {
    res.render('admin/userManage');
}







exports.adminDashboard = (req, res) => { 
  res.render('admin/index')
}

exports.adminOrderManagement= (req, res) => { 
  res.render('admin/orders')
}

exports.adminCategoryManagement = (req, res) => { 
  res.render('admin/category')
}


exports.adminChartManagement = (req, res) => {
  res.render('admin/charts')
}