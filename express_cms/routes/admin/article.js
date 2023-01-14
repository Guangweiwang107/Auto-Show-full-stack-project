const express = require("express");

const router = express.Router();
const ArticleCateModel = require("../../model/articleCateModel")
const ArticleModel = require("../../model/articleModel")
const { multer, getUnix } = require("../../model/tools")

router.get("/", async (req, res) => {

    var page = req.query.page || 1;

    var pageSize = 8;

    var json = {};

    var keywords = req.query.keywords;

    if (keywords) {
        json = Object.assign(json, { "title": { $regex: new RegExp(keywords) } })
    }

    var result = await ArticleModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "cid",
                foreignField: "_id",
                as: "cate"
            }
        },
        {
            $match: json
        },
        {
            $sort: { "add_time": -1 }
        },
        {
            $skip: (page - 1) * pageSize
        },
        {
            $limit: pageSize
        }
    ])

    var count = await ArticleModel.count(json)

    res.render("admin/article/index", {
        list: result,
        totalPages: Math.ceil(count / pageSize),
        page: page,
        keywords:keywords
    })
})

router.get("/add", async (req, res) => {

    var result = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid: "0"
            }
        }
    ])

    res.render("admin/article/add", {
        articleCate: result
    })
})

router.post("/doAdd", multer().single('article_img'), async (req, res) => {
    var imgSrc = req.file ? req.file.path.substring(7) : "";

    var result = new ArticleModel(Object.assign(req.body, { "article_img": imgSrc }, { "add_time": getUnix() }))

    await result.save();

    res.redirect(`/${req.app.locals.adminPath}/article`)
})

router.get("/edit", async (req, res) => {
    var id = req.query.id;
    var articleResult = await ArticleModel.find({ "_id": id });
    var cateResult = await ArticleCateModel.aggregate([
        {
            $lookup: {
                from: "article_cate",
                localField: "_id",
                foreignField: "pid",
                as: "items"
            }
        },
        {
            $match: {
                pid: "0"
            }
        }
    ])

    res.render("admin/article/edit", {
        articleCate: cateResult,
        list: articleResult[0]
    })
})

router.post("/doEdit", multer().single('article_img'), async (req, res) => {
    try {
        if (req.file) {
            var imgSrc = req.file ? req.file.path.substring(7) : "";
            await ArticleModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { "article_img": imgSrc }))
        } else {
            await ArticleModel.updateOne({ "_id": req.body.id }, req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/article`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/article/edit?id=${req.body.id}`,
            "message": "修改数据失败"
        })
    }

})


router.post("/doUploadImage", multer().single('file'), (req, res) => {
    var imgSrc = req.file ? req.file.path.substring(7) : "";

    res.send({
        link: "/" + imgSrc
    })
})

router.get("/delete", async (req, res) => {
    var id = req.query.id;
    var articleResult = ArticleModel.deleteOne({ "_id": id });

    res.redirect(`/${req.app.locals.adminPath}/article`);
})
module.exports = router;