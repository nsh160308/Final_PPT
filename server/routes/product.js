const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

//이미지 업로드
var imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
var imgUpload = multer({ storage: imgStorage }).array("file", 5)

router.post('/image', (req, res) => {
    imgUpload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        let filePathArr = [];
        let fileNameArr = [];
        req.files.forEach(files => {
            filePathArr.push(files.path);
            fileNameArr.push(files.filename);
        })
        res.json({ success: true, filePath: filePathArr, fileName: fileNameArr })
    })
})

//디테일 이미지 업로드
var detailImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/detail')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
var detailImgUpload = multer({ storage: detailImgStorage }).array("file", 5)

router.post('/detailImage', (req, res) => {
    detailImgUpload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        let filePathArr = [];
        let fileNameArr = [];
        req.files.forEach(files => {
            filePathArr.push(files.path);
            fileNameArr.push(files.filename);
        })
        res.json({ success: true, filePath: filePathArr, fileName: fileNameArr })
    })
})

router.post('/', (req, res) => {
    console.log('상품을 백엔드에 저장', req.body);
    //받아온 정보들을 DB에 넣어 준다.
    const product = new Product(req.body)
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

router.post('/products', (req, res) => {
    console.log('products', req.body);
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    // // product collection에 들어 있는 모든 상품 정보를 가져오기 
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm
    let findArgs = {};
    console.log('필터', req.body.filters);  
    for (let key in req.body.filters) {//continents, price, clothes 3번 반복하게 된다.
        console.log('key를 알아보자', key);
        if (req.body.filters[key].length > 0) {//filters[continents, price, clothes]를 순회하면서 안에 내용이 있다면 분기 처리
            console.log('key', key);//clothes배열에 필터가 하나 들어가게 된다.
            if (key === "price") {//price는 아니기 때문에
                findArgs[key] = {
                    //Greater than equal
                    $gte: req.body.filters[key][0],
                    //Less than equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                console.log("price가 아닌 나머지")
                findArgs[key] = req.body.filters[key];
                console.log('findArgs', findArgs);
            }
        }
    }
    if (term) {
        console.log("텀", term);
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    } else {
        console.log('텀아님');
        Product.find(findArgs)//{clothes : [1]}
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({
                    success: true, productInfo,
                    postSize: productInfo.length
                })
            })
    }
})

//id=123123123,324234234,324234234  type=array
router.get('/products_by_id', (req, res) => {

    console.log("상세정보는 여기서 가져온다");

    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        //id=123123123,324234234,324234234 이거를 
        //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿈
        let ids = req.query.id.split(',')
        productIds = ids;
        //productIds 길이 만큼 map함수로 프로미스 반환
        let result = productIds.map((item) => {
            return Product.findOne({ _id: item })
                .populate('writer')
                .exec()
        })
        //배열형태로 받은 프로미스를 Promise.all()로 받고 res에 실어서 보냄
        Promise.all(result).then(response => {
            console.log(response);
            res.status(200).json({ success: true, product: response})//axios한테 다시 전달됨
        })
    } else {
        console.log('이미지 정보는 여기를 거친다.');
        Product.findOneAndUpdate(
        { _id: { $in: productIds }},
        {
            $inc: {
                views: 1
            }
        },
        { new: true})
        .populate('writer')
        .exec((err, product) => {
            console.log('프로덕트',product);
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
    }
})






module.exports = router;
