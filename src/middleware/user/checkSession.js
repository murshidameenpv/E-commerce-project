exports.sessionExists = (req, res, next) => {
  if (!req.session.user){
    res.redirect("/login");
  } else {
    next();
  }
};

exports.checkUserBlocked = (req, res, next) => {
  if (req.session.user && req.session.user.IsBlocked) {
    res.redirect("/login")
  } else {
    next()
  }
}