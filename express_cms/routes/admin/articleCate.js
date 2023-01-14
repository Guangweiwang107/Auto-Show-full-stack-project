
const express = require("express");
const { getUnix } = require("../../model/tools");
const ArticleModel = require("../../model/articleModel");
const ArticleCateModel = require("../../model/articleCateModel");
const mongoose = require("../../model/core");

var router = express.Router();
router.get("/", async (req, res) => {
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


    console.log(result)


    res.render("admin/articleCate/index.html", {
        list: result
    })
})
router.get("/add", async (req, res) => {
    //获取顶级分类
    var topCateList = await ArticleCateModel.find({ "pid": "0" });
    res.render("admin/articleCate/add.html", {
        cateList: topCateList
    })
})

router.post("/doAdd", async (req, res) => {
    //获取顶级分类   

    if (req.body.pid != "0") {
        req.body.pid = mongoose.Types.ObjectId(req.body.pid);
    }
    req.body.add_time = getUnix();
    var result = new ArticleCateModel(req.body)
    await result.save();
    res.redirect(`/${req.app.locals.adminPath}/articleCate`);

})

router.get("/edit", async (req, res) => {
    var id = req.query.id;
    var result = await ArticleCateModel.find({ "_id": id });
    console.log(result);
    //获取顶级分类
    var topCateList = await ArticleCateModel.find({ "pid": "0" });
    res.render("admin/articleCate/edit.html", {
        list: result[0],
        cateList: topCateList
    })
})

router.post("/doEdit", async (req, res) => {
    try {
        if (req.body.pid != "0") {
            req.body.pid = mongoose.Types.ObjectId(req.body.pid);
        }
        await ArticleCateModel.updateOne({ "_id": req.body.id }, req.body);
        res.redirect(`/${req.app.locals.adminPath}/articleCate`);
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/articleCate/edit?id=${req.body.id}`,
            "message": "增加数据失败"
        })
    }
})
router.get("/delete", async (req, res) => {
    var id = req.query.id;
    var subReuslt = await ArticleCateModel.find({ "pid": mongoose.Types.ObjectId(id) });
    if (subReuslt.length > 0) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
            "message": "当前分类没法删除，请删除下面的子分类后重试"
        })
    } else {

        var subArticelReuslt = await ArticleModel.find({ "cid": mongoose.Types.ObjectId(id) });
        if (subArticelReuslt.length > 0) {
            res.render("admin/public/error.html", {
                "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
                "message": "当前分类下面有文章信息没法删除，删除文章后重试"
            })
        } else {
            await ArticleCateModel.deleteOne({ "_id": id });
            res.render("admin/public/success.html", {
                "redirectUrl": `/${req.app.locals.adminPath}/articleCate`,
                "message": "删除数据成功"
            })
        }

    }


})


module.exports = router