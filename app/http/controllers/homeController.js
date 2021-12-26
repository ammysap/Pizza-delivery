const Menu=require("../../models/menu");

function homeController()
{
    return {
        index(req,res)
        {
            
            Menu.find(function(err,foundMenu)
            {
                // if(!err)
                // {
                //     console.log(foundMenu);
                // }
                // else
                // {
                //     console.log(err);
                // }
                res.render("home",{pizzas:foundMenu});
            });
        }
    }
}

module.exports=homeController;