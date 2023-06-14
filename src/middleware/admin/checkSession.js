exports.sessionExists = (req, res, next) => {   
    if (!req.session.admin) {
        res.redirect('/admin')
    }
    next()
}

exports.isAdminLoggedIn = (req, res, next) => {
    if (req.session.admin) {
        console.log("api call on middleware")
        next()
    } else {
        res.redirect('/admin');
    }
}