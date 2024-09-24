const AccountRoutes = require("./account_Routes")

function routes(app){
    app.use("/acc", AccountRoutes)
}

module.exports = routes