const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("error", "All Fields are required");
        req.flash("email", email);
        return res.redirect("/login");
      }
      passport.authenticate("local", function (err, user, info) {
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
    async postRegister(req, res) {
      const { name, email, password } = req.body;

      //validation error
      if (!name || !email || !password) {
        req.flash("error", "All Fields are required");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      //check if email is already register

      User.findOne({ username: email }, function (err, foundUser) {
        if (foundUser) {
          req.flash("error", "Email already exist");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      newUser
        .save()
        .then(function (newUser) {
          passport.authenticate("local")(req, res, function () {
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
    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    },
  };
}

module.exports = authController;
