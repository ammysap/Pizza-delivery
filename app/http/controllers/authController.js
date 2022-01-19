const passport = require("passport");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },

    postUserLogin(req, res, next) {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("error", "All Fields are required");
        req.flash("email", email);
        return res.redirect("/login");
      }
      passport.authenticate("user-local", function (err, user, info) {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    },

    postAdminLogin(req, res, next) {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("error", "All Fields are required");
        req.flash("email", email);
        return res.redirect("/login");
      }
      passport.authenticate("admin-local", function (err, user, info) {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },
    async postuserRegister(req, res) {
      console.log(req.body);
      const { name, email, phone, password } = req.body;

      //validation error
      if (!name || !email || !password || !phone) {
        req.flash("error", "All Fields are required");
        req.flash("name", name);
        req.flash("email", email);
        req.flash("phone", phone);
        return res.redirect("/register");
      }

      //check if email is already register

      User.findOne({ email: email }, function (err, foundUser) {
        if (foundUser) {
          req.flash("error", "Email already exist");
          req.flash("name", name);
          req.flash("email", email);
          req.flash("phone", phone);
          return res.redirect("/register");
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      });

      newUser
        .save()
        .then(function (newUser) {
          passport.authenticate("user-local")(req, res, function () {
            return res.redirect("/");
          });
          // return res.redirect("/");
        })
        .catch(function (err) {
          req.flash("error", "something went wrong");
          return res.redirect("/register");
        });

      //   User.register(newUser, password, function (err, user) {
      //     if (err) {
      //       // req.flash("error", "Email already exist");
      //       // req.flash("name", name);
      //       // req.flash("email", email);
      //       console.log(err);
      //       return res.redirect("/register");
      //     } else {
      //       // passport.authenticate("local", function(err, user, info) {

      //       //     console.log(user);
      //       //     if (err) return next(err);
      //       //     // if (!user) return res.redirect('/login');

      //       //     req.logIn(user, function(err) {
      //       //         if (err)  return next(err);
      //       //         return res.redirect("/");
      //       //     });

      //       // })(req, res, next);

      //       passport.authenticate("local")(req, res, function () {
      //         res.redirect("/");
      //       });
      //     }
      //   });

      console.log(req.body);
    },
    async postadminRegister(req, res) {
      console.log(req.body);
      const { resturentname,resturentaddress,resturentnumber,ownernumber,ownername,owneremail,adminpassword,} = req.body;
      // validation error
      if (!resturentname ||!owneremail ||!adminpassword ||!resturentaddress ||!resturentnumber ||!ownernumber ||!ownername) {
        req.flash("error", "All Fields are required");
        req.flash("name", resturentname);
        req.flash("email", owneremail);
        req.flash("address", resturentaddress);
        req.flash("resturentnumber", resturentnumber);
        req.flash("ownernumber", ownernumber);
        req.flash("ownername", ownername);

        return res.redirect("/register");
      }

      //check if email is already register

      Admin.findOne({ email: owneremail }, function (err, foundUser) {
        if (foundUser) {
          req.flash("error", "Email already exist");
          req.flash("name", resturentname);
          req.flash("email", owneremail);
          req.flash("address", resturentaddress);
          req.flash("resturentnumber", resturentnumber);
          req.flash("ownernumber", ownernumber);
          req.flash("ownername", ownername);
          return res.redirect("/register");
        }
      });

      const hashedPassword = await bcrypt.hash(adminpassword, 10);

      const newUser = new Admin({
        resturentname: resturentname,
        email: owneremail,
        resturentaddress: resturentaddress,
        resturentnumber: resturentnumber,
        ownernumber: ownernumber,
        ownername: ownername,
        role: req.body.role,
        password: hashedPassword,
      });

      newUser
        .save()
        .then(function (newUser) {
          // passport.authenticate("admin-local")(req, res, function () {
          //   return res.redirect("/");
          // });
          req.login(newUser,function(err)
          {
            if(!err)
            {
              return res.redirect("/");
            }
            else
            {
              console.log(err);
            }
          })
        })
        .catch(function (err) {
          req.flash("error", "something went wrong");
          return res.redirect("/register");
        });

      //   User.register(newUser, password, function (err, user) {
      //     if (err) {
      //       // req.flash("error", "Email already exist");
      //       // req.flash("name", name);
      //       // req.flash("email", email);
      //       console.log(err);
      //       return res.redirect("/register");
      //     } else {
      //       // passport.authenticate("local", function(err, user, info) {

      //       //     console.log(user);
      //       //     if (err) return next(err);
      //       //     // if (!user) return res.redirect('/login');

      //       //     req.logIn(user, function(err) {
      //       //         if (err)  return next(err);
      //       //         return res.redirect("/");
      //       //     });

      //       // })(req, res, next);

      //       passport.authenticate("local")(req, res, function () {
      //         res.redirect("/");
      //       });
      //     }
      //   });

      
    },

    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
