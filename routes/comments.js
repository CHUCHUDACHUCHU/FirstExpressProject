const express = require('express');
const router = express.Router();
const Comments = require('../schemas/comment.js');

//댓글 목록 조회 API
router.get('/:_postId', async (req, res) => {
    const { _postId } = req.params;
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
    })

    res.status(200).json({ data: newComments });
});

//댓글 생성 API
router.post('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { user, password, content } = req.body;

    //현재시각 및 한국시간으로 변환
    let now = new Date();
    let createdAt = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    const createdComment = await Comments.create({ user, password, content, createdAt, postId: _postId });

    res.status(200).json({ message: '댓글을 생성하였습니다.', comment: createdComment });
})

//댓글 수정 API
router.put('/:_commentId', async (req, res) => {
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
    }
    res.status(200).json({ message: '댓글을 수정하였습니다.' })
})

//댓글 삭제 API
router.delete('/:_commentId', async (req, res) => {
    const { _commentId } = req.params;
    const { password } = req.body;

    //받아온 값들로 해당 comment찾고 비밀번호 확인 후 삭제
    const comment = await Comments.findOne({ _id: { $eq: _commentId } });
    if (comment['password'] === password) {
        await comment.deleteOne();
    }
    res.json({ message: '댓글을 삭제하였습니다.' })
})


module.exports = router;