exports.sessionExists = (req, res, next) => {   
    if (!req.session.admin) {
        res.redirect('/admin')
    } else {
        next()
    }
}
exports.ifLoggedIn = (req, res, next) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard')
    } else {
        next() 
    }
}