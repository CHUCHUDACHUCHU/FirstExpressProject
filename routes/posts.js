const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post');

//게시글 조회 API
router.get('/', async (req, res) => {
    const posts = await Posts.find();

    //가공해서 넣을 새로운 posts(postId, user, title, createdAt)
    const newPosts = [];
    posts.forEach((v) => {
        newPosts.push({
            postId: String(v['_id']),
            user: v['user'],
            title: v['title'],
            createdAt: v['createdAt'],
        });
    })

    res.status(200).json({ data: newPosts });
});


//게시글 작성 API
router.post('/', async (req, res) => {
    //바디에 들어온 변수들 객체분해할당
    const { user, password, title, content } = req.body;

    //현재시각 및 한국시간으로 변환
    let now = new Date();
    let createdAt = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    //db저장
    const createdPost = await Posts.create({ user, password, title, content, createdAt });

    res.status(200).json({ message: '게시글을 생성하였습니다.', post: createdPost });
})

//게시글 상세 조회 API
router.get('/:_postId', async (req, res) => {
    //request.params로 받은 값을 객체분해할당.
    const { _postId } = req.params;
    try {
        //쿼리연산자를 사용하여 조회. ($eq 는 주어진 갑과 일치하는 값.)
        const post = await Posts.findOne({ _id: { $eq: _postId } });

        //가져온 post는 가공되지 않은 정보이기 때문에 새로 가공.
        const data = {
            postId: post['_id'],
            user: post['user'],
            title: post['title'],
            content: post['content'],
            createdAt: post['createdAt'],
        }
        res.status(200).json({ data });
    } catch (message) {
        res.status(404).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

})

//게시글 수정 API
router.put('/:_postId', async (req, res) => {
    //response, request 의 바디와 파람스로 값 가져옴.
    const { password, title, content } = req.body;
    const { _postId } = req.params;

    //파람스로 받은 id와 같은 post 받아옴.
    const post = await Posts.findOne({ _id: { $eq: _postId } });

    //비밀번호 맞으면 시간 새로 지정하고, 그 post를 바로 updateOne()
    if (post['password'] === password) {
        let now = new Date();
        let createdAt = new Date(
            now.getTime() - (now.getTimezoneOffset() * 60000))
            .toISOString();
        await post.updateOne(
            { $set: { title, content, createdAt } }
        );
    }
    res.status(200).json({ message: '게시글을 수정하였습니다.' })
})

//게시글 삭제 API
router.delete('/:_postId', async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;

    //받아온 값들로 해당 post찾고 비밀번호 확인 후 삭제
    const post = await Posts.findOne({ _id: { $eq: _postId } });
    if (post['password'] === password) {
        await post.deleteOne();
    }
    res.json({ message: '게시글을 삭제하였습니다.' })
})

module.exports = router;