const { allLimit } = require('async');
const express = require('express');
const router = express.Router();
const { ProductComment } = require("../models/ProductComment");


//=================================
//           상품 리뷰
//=================================

router.post('/saveComment', (req, res) => {
    console.log('saveCommnet axios가 준 정보', req.body);

    const newProductComment = new ProductComment(req.body);
    newProductComment.save((err, comment) => {
        if(err) return res.status(400).json({ success: false, err })

        console.log('저장된 리뷰 정보', comment);
        
        ProductComment.find({ _id: comment._id })
            .populate('writer')
            .exec((err, review) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, productReview: review })                
            })
    })
})

//모든 댓글 정보 가져오기
router.post('/getComments', (req, res) => {
    console.log('getReviews함수가 준 정보', req.body);
    //삼항 연산자
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let limit = req.body.limit ? parseInt(req.body.limit) : allLimit
    //모든 리뷰 가져오기
    if(req.body.pageStatus === 'default') {
        //몽고DB에서 productId의 데이터 find
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')//productId에 연결된 유저정보도 find
        .exec((err, reviews) => {//결과
            if(err) res.send(err)//에러 발생하면 에러 클라이언트에게 보냄
            res.status(200)//그렇지 않다면, 성공 메세지 보냄
            .json({//성공메세지는 json형식으로 아래와 같은 객체형식으로 보냄
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'default'
            })
        })
    }
    //리뷰 10개씩 가져오기
    else if(req.body.pageStatus === 'limited') {
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'limited'
            })
        })
    }
    //최신 리뷰 순으로 정렬
    else if(req.body.pageStatus === 'Sort by latest') {
        console.log('최신 리뷰 순으로 정렬합니다.');
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .sort([['updatedAt', 'desc']])
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err);
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                pageStatus: 'Sort by latest'
            })
        })
    }
    //더 보기
    if(req.body.loadMore === 'default') {
        console.log('더 보기')
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err)
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                loadMorePage: 'default'
            })
        })
    } else if(req.body.loadMore === 'Sort by latest') {
        console.log('최신 정렬 더 보기')
        ProductComment.find({ productId: req.body.productId })
        .populate('writer')
        .sort([['updatedAt', 'desc']])
        .skip(skip)
        .limit(limit)
        .exec((err, reviews) => {
            if(err) res.send(err);
            res.status(200)
            .json({
                success: true,
                reviews: reviews,
                postSize: reviews.length,
                loadMorePage: 'Sort by latest'
            })
        })
    }
})

//선택한 댓글 삭제하기
router.post('/deleteComment', (req, res) => {
    console.log('클라이언트로 받은 정보~', req.body);
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let limit = req.body.limit ? parseInt(req.body.limit) : allLimit;
    console.log('스킵과 리미트 확인 합니다', skip, limit);
    if(!req.body.replyStatus) {
        console.log('false');
        ProductComment.findOneAndDelete({ _id: req.body._id },
            (err,doc) => {
                if(err) return res.status(400).json({ success: false, err })
                
                ProductComment.find()
                    .populate('writer')
                    .exec((err, reviews) => {
                        if(err) return res.status(400).json({ success: false, err })
                        res.status(200).json({ success: true, allReview: reviews})
                    })
            })
    } else {
        console.log('true');
        ProductComment.findOneAndDelete({ _id: req.body._id},
            (err, doc) => {
                if(err) return res.status(400).json({ success: false, err })

                ProductComment.find()
                    .populate('writer')
                    .sort([['updatedAt', 'desc']])
                    .skip(skip)
                    .limit(limit)
                    .exec((err, reviews) => {
                        if(err) res.send(err);
                        res.status(200)
                        .json({
                            success: true,
                            allReview: reviews
                        })
                    })
            })
    }

    
        
    
})

//선택한 댓글 수정하기
router.post('/modifyComment', (req, res) => {
    console.log('클라이언트가 준 정보',req.body);
    
    ProductComment.findOneAndUpdate(
        { _id: req.body._id }, 
        { $set: { content: req.body.content, modify: req.body.modify, rating: req.body.rating } },
        { new: true },
        (err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        })
        .populate('writer')
        .exec((err, review) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, review })
        })
})




module.exports = router;
