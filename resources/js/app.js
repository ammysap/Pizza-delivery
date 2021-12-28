const axios = require("axios");
const Noty = require("noty");
const initAdmin =require("./admin");

let addToCart = document.querySelectorAll(".add-to-cart");

let cartCounter = document.querySelector("#cartCounter");

function upadteCart(pizza) {
  axios
    .post("/updateCart", pizza)
    .then(function (res) {
      cartCounter.innerText = res.data.totalQty;
      console.log(res.data.totalQty);
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item added to cart",
        progressBar: false,
      }).show();
    })
    .catch(function (err) {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    let pizza = JSON.parse(btn.dataset.pizza);
    upadteCart(pizza);
    // console.log(pizza);
  });
});

//remove alert after t seconds

const alertMsg= document.querySelector('#success-alert');
if(alertMsg)
{
  setTimeout(function () {
    alertMsg.remove()
    },2000);
}

initAdmin();
