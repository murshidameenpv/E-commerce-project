exports.sessionExists = (req, res, next) => {
    if (!req.session.admin) {
        res.redirect('/admin')
    }
    next()
}