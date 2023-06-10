const userDb = require("../models/userSchema");


exports.adminLoginController = (req, res) => {
     res.redirect(302, "/admin/dashboard");;
}


exports.adminFindUser = async (req, res) => {
     //find user by single id
     if (req.query.id) {
          try {
               const id = req.query.id;
               data = await userDb.findById(id)
               res.send(data)
          }
          catch (err) {
           console.error('Error retrieving data from Mongoose', err);
           res.status(500).send('Internal Server Error');
        }
     }
     else {
          try {
               const data = await userDb.find();
               res.send(data)
          }
          catch (err) {
           console.error('Error retrieving data from Mongoose', err);
           res.status(500).send('Internal Server Error');
        }
     }
}


//ADMIN BLOCK_UNBLOCK CONTROLLERS
exports.adminBlockUser = async (req, res) => {
  const userId = req.params.id;
  try {
     await userDb.findByIdAndUpdate(userId, { isBlocked: true });
    return res.json({ success: true });
  }
  catch (err) {
      console.error('Error Updating data from Mongoose', err);
      res.status(500).send('Internal Server Error');
        }
}
exports.adminUnBlockUser = async (req, res) => {
 const userId = req.params.id;
  try {
     await userDb.findByIdAndUpdate(userId, { isBlocked: false });
     return res.json({ success: true});
  }
  catch (err) {
      console.error('Error Updating data from Mongoose', err);
      res.status(500).send('Internal Server Error');
        }
}


//ADMIN DELETE USER
exports.adminDeleteUser = async (req, res) => {
     const userId = req.params.id;
     try {
      await userDb.findByIdAndRemove(userId)
          res.json({ success: true });  
     }
     catch (err) {
      console.error('Error Deleting  data from Mongoose', err);
      res.status(500).send('Internal Server Error');
     }
}