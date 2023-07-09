const Order = require("../../../models/order");
function orderController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customerId", "-password")
        .exec()
        .then(function (orders) {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
  };
}

module.exports = orderController;
