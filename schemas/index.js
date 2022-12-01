const mongoose = require('mongoose');
require('dotenv').config();
const { MONGODB_URI } = process.env;
const connect = () => {
    mongoose.connect(MONGODB_URI).then(() => console.log('몽고디비 연결완료')).catch(err => console.log(err));
};

mongoose.connection.on('error', err => {
    console.error('몽고디비 연결 에러', err);
});

module.exports = connect;