/*globals module:false User:false*/

function createGuid() {
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
}

module.exports = {
    _config: {},

    signIn: function (req, res) {
        var body = req.body;
        if (!body.email && !body.password) {
            res.view();
        } else if (!body.email) {
            res.view({errors:["Missing email"]});
        } else if (!body.password) {
            res.view({errors:["Missing password"]});
        } else {
            User.findOne({email: body.email})
                .done(function (err, user) {
                    if (err) {
                        res.view({errors:[err]});
                    } else if (!user) {
                        res.view({errors:["Incorrect email or password."]});
                    } else {
                        user.verifyPassword(body.password, function (err, match) {
                            if (err || !match) {
                                res.view({errors:["Incorrect email or password."]});
                            } else {
                                req.session.user = user;
                                req.session.authenticated = true;
                                res.redirect('/');
                            }
                        });
                    }
                });
        }
    },

    emailSent: function (req, res) {
        console.log("emailSent");
        if (req.session.user) {
            res.view(req.session.user);
        } else {
            res.redirect('user/signIn');
        }
    },

    signUp: function (req, res) {
        console.log("signUp");
        var body = req.body,
            created, type;
        User.create(body).done(function(err, user) {
            if (err) {
                console.error(JSON.stringify([err]));
                res.view({errors:[err]});
            } else {
                created = new Date().getTime();
                type = "email";
                user.validation = {
                    guid: createGuid(),
                    createdAt: created,
                    type: type
                };
                user.save(function (err, user) {
                    if (err) {
                        console.error(JSON.stringify([err]));
                        res.view({errors:[err]});
                    } else {
                        req.session.user = user;
                        res.redirect('user/emailSent');
                    }
                });
            }
        });
    },

    validate: function (req, res) {
        var email = req.query.e;
        User.findOne({email: email}).done(function (err, user) {
            var validation = user && user.validation,
                guid = validation && validation.guid;
            if (user.validated) {
                res.view('user/validationNotRequired');
            } else if (req.query.k === guid ) {
                user.validated = new Date().getTime();
                user.save(function (err, user) {
                    if (err) {
                        console.error(JSON.stringify([err]));
                        res.view('user/validationFailed');
                    } else {
                        req.session.user = user;
                        res.view('user/validationSuccessful');
                    }
                });
            } else if (req.query.k) {
                res.view('user/validationFailed');
            } else {
                res.send(404);
            }
        });
    }
};
