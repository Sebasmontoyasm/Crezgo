const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect("mongodb+srv://sebasmontoyasm:ARLKmkfoL5oeb1UP@crezgodb.o8osfmn.mongodb.net/test");
        console.log('Database connected crezgo DB');
    } catch (error) {
        console.log('No se puede conectar a la base de datos');
    }
}

mongoose.set('strictQuery', true);

module.exports = {
    connection
};