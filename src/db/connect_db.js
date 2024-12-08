const mongoose = require('mongoose');
require('dotenv').config()

async function connect() {
    try{
        await mongoose.connect(process.env.AtlasURI,{
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            family: 4,
        })
        console.log('Database connection successful')
    }catch(error){
        console.log('Database connection failed: ', error)
    }
}



module.exports = { connect }
