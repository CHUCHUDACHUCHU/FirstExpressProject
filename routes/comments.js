const express = require('express');
const router = express.Router();
const Comments = require('../schemas/comment.js');
const Posts = require('../schemas/post.js');

//댓글 목록 조회 API
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id: { $eq: _postId } });
        const comments = await Comments.find({ postId: { $eq: _postId } });
        //가공해서 넣을 새로운 comments(commentId, user, content, createdAt)
        const newComments = [];
        comments.forEach((v) => {
            newComments.push({
                commentId: String(v['_id']),
                user: v['user'],
                content: v['content'],
                createdAt: v['createdAt'],
            });
        });
        res.status(200).json({ data: newComments });
    } catch (error) {
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});

//댓글 생성 API
/* router.post('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { user, password, content } = req.body;

    if (!content || !content.length) {
        return res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    try {
        //현재시각 및 한국시간으로 변환
        let now = new Date();
        let createdAt = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

        const createdComment = await Comments.create({ user, password, content, createdAt, postId: _postId });

        res.status(200).json({ message: '댓글을 생성하였습니다.', comment: createdComment });
    } catch (error) {
        res.json({ message: error.message });
    }
}) */
router.post('/:_postId', async (req, res) => {
    try {
        //바디에 들어온 변수들 객체분해할당
        const { _postId } = req.params;
        const { user, password, content } = req.body;


        //현재시각 및 한국시간으로 변환
        let now = new Date();
        let createdAt = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

        //db저장
        //이 부분에서 req.body가 비어있으면 validationError를 발생시킴.
        await Comments.create({ user, password, content, createdAt, postId: _postId });

        res.status(200).json({ message: '게시글을 생성하였습니다.' });
    } catch (error) {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
})

//댓글 수정 API
router.put('/:_commentId', async (req, res) => {
    try {
        if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
            throw (new Error('RequestError'));
        }
        //response, request 의 바디와 파람스로 값 가져옴.
        const { password, content } = req.body;
        const { _commentId } = req.params;

        //파람스로 받은 id와 같은 comment 받아옴.
        const comment = await Comments.findOne({ _id: { $eq: _commentId } });
        //비밀번호 맞으면 시간 새로 지정하고, 그 comment를 바로 updateOne()
        if (comment['password'] === password) {
            let now = new Date();
            let createdAt = new Date(
                now.getTime() - (now.getTimezoneOffset() * 60000))
                .toISOString();
            await comment.updateOne(
                { $set: { content, createdAt } }
            );
            return res.status(200).json({ message: '댓글을 수정하였습니다.' });
        } else {
            throw new Error('PasswordError');
        }
    } catch (error) {
        if (error.message == 'RequestError') {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else if (error.message == 'PasswordError') {
            res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' })
        } else {
            res.json({ message: error.name + ': ' + error.message });
        }
    }
})

//댓글 삭제 API
router.delete('/:_commentId', async (req, res) => {
    try {
        if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
            throw (new Error('RequestError'));
        }
        //response, request 의 바디와 파람스로 값 가져옴.
        const { _commentId } = req.params;
        const { password } = req.body;

        //파람스로 받은 id와 같은 post 받아옴.
        const comment = await Comments.findOne({ _id: { $eq: _commentId } });
        //비밀번호 맞으면 시간 새로 지정하고, 그 post를 바로 updateOne()
        if (comment['password'] === password) {
            await comment.deleteOne();
            return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
        } else {
            throw new Error('PasswordError');
        }
    } catch (error) {
        if (error.message == 'RequestError') {
            res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else if (error.message == 'PasswordError') {
            res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' })
        } else {
            res.json({ message: error.name + ': ' + error.message });
        }
    }
})



module.exports = router;