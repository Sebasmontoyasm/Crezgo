const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect("mongodb+srv://crezgo:ScDrdF2Ex1m3fqNz@clustercrezgo.rqfyyap.mongodb.net/crezgoDB?retryWrites=true&w=majority");
        console.log('Database connected crezgo DB');
    } catch (error) {
        console.log('No se puede conectar a la base de datos');
    }
}

mongoose.set('strictQuery', true);

module.exports = {
    connection
};