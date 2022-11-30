const express = require('express');
const app = express();
const PORT = 3000;

//몽고디비 연결
const connect = require('./schemas')
connect();

//전역 미들웨어 생성
app.use(express.json());

const router = require('./routes/index.js');
app.use('/', router);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});