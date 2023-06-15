exports.sessionExists = (req, res, next) => {   
    if (!req.session.admin) {
        res.redirect('/admin')
    }
    next()
}
exports.ifLoggedIn = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard')
    } else {
        next() 
    }
}