var adminDb = require('../../models/adminSchema');


exports.checkAdminExists = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const adminData = await adminDb.findOne({ email });
    if (!adminData) {
      req.session.message = {
        field: 'email',
        msg: 'Email not found'
      };
      return res.redirect("/admin");
    }
    // Compare passwords
    if (adminData.password !== password) {
      req.session.message = {
        field: 'password',
        msg: 'Incorrect password'
      };
      return res.redirect("/admin");
    }
    // Authentication successful
    req.session.admin = adminData;
    next();
  } catch (err) {
    console.error('Error creating or checking admin existence in MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
};
