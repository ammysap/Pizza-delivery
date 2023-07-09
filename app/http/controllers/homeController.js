const Menu = require("../../models/menu");

function homeController() {
  return {
    index(req, res) {
      Menu.find()
        .then((foundMenu) => {
          if (req.user) {
            let name;
            if (req.user.role === "customer") {
              console.log(req.user.name);
              name = req.user.name.split(" ")[0];
            } else {
              console.log(req.user.resturentname);
              name = req.user.resturentname.split(" ")[0];
            }
            name = name.toUpperCase();
            res.render("home", { pizzas: foundMenu, userName: name });
          } else {
            res.render("home", { pizzas: foundMenu });
          }
        })
        .catch((err) => {
          // Handle error
          console.error(err);
          res.status(500).send("An error occurred");
        });
    },
  };
}

module.exports = homeController;
