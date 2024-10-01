const account_Routes = require("./account_Routes")
const speciality_Routes = require('./speciality_Routes')
const region_Routes = require('./region_Routes')

function routes(app){
    app.use("/", (res, req) =>{
        res.redirect("/Home")
    })
    app.use("/acc", account_Routes)
    app.use("/special", speciality_Routes)
    app.use("/region", region_Routes)
}

module.exports = routes