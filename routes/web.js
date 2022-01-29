
const homeController=require("../app/http/controllers/homeController");
const authController=require("../app/http/controllers/authController");
const cartController=require("../app/http/controllers/customers/cartController");
const orderController =require("../app/http/controllers/customers/orderController");
const adminOrderController =require("../app/http/controllers/admin/orderController");
const statusController =require("../app/http/controllers/admin/statusController");

//middlewares


const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth");
const admin =require("../app/http/middleware/admin");




function initRoutes(app) {

  app.get("/", homeController().index);

  app.get("/getotp",guest,authController().getOtp);

  app.post("/generateOTP",guest,authController().generateOTP);
  app.post("/validateOTP",guest,authController().validateOTP);
  
  app.get("/login",guest, authController().login);
  app.post("/userlogin", authController().postUserLogin);
  app.post("/adminlogin", authController().postAdminLogin);

  app.post("/userregister",authController().postuserRegister);
  app.post("/adminregister",authController().postadminRegister);
  
  app.post("/logout",authController().logout);

  app.get("/cart",cartController().index );

  app.post("/updateCart",cartController().update);

  app.post("/orders",auth,orderController().store);

  app.get("/customer/orders",auth,orderController().index);
  
  app.get("/customer/order/:id",auth,orderController().show);
  
  //Admin routes
  app.get("/admin/orders",admin,adminOrderController().index);

  app.post("/admin/order/status",admin,statusController().update);
  
}

module.exports=initRoutes
