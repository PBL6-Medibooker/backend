
const mongoose = require('mongoose')
require('dotenv').config()



async function connect() {
    try {
        await mongoose.connect(process.env.AtlasURI, {
            family: 4,
        });
        // await mongoose.connect(process.env.MongoURI,{
        //     family: 4,
        // })
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection failed: ", error);
    }
}

// async function connect() {
//     try{
//         await mongoose.connect(process.env.MongoURI,{
//             useNewUrlParser: true, 
//             useUnifiedTopology: true,
//             family: 4,
//         })
//         console.log('Database connection successful')
//     }catch(error){
//         console.log('Database connection failed: ', error)
//     }
// }

module.exports = { connect };

