const account_Routes = require("./account_Routes")
const speciality_Routes = require('./speciality_Routes')
const region_Routes = require('./region_Routes')
const client_Routes = require('./client_Routes')
const appointment_Routes = require('./appointment_Routes')

function routes(app){
    app.use("/acc", account_Routes)
    app.use("/special", speciality_Routes)
    app.use("/region", region_Routes)
    app.use("/client", client_Routes)
    app.use("/appointment", appointment_Routes)
}

module.exports = routes