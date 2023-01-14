const express = require('express');

const FocusModel = require("../../model/focusModel");
const NavModel = require("../../model/navModel");
const ManagerModel = require("../../model/managerModel");
const ArticleCateModel = require("../../model/articleCateModel");
const ArticleModel = require("../../model/articleModel");
var appModel = {
    FocusModel,
    NavModel,
    ManagerModel,
    ArticleCateModel,
    ArticleModel

}
var router = express.Router();
router.get("/", (req, res) => {
    res.render("admin/main/index.html")
})

router.get("/welcome", (req, res) => {
    res.send("欢迎来到后台管理中心")
})

router.get("/changeStatus", async (req, res) => {

    let id = req.query.id;
    let model = req.query.model + "Model";
    let field = req.query.field;
    let json;
    var result = await appModel[model].find({ "_id": id });
    if (result.length > 0) {
        var tempField = result[0][field];
        tempField == 1 ? json = { [field]: 0 } : json = { [field]: 1 };
        await appModel[model].updateOne({ "_id": id }, json);
        res.send({
            success: true,
            message: '修改状态成功'
        });
    } else {
        res.send({
            success: false,
            message: '修改状态失败'
        })
    }

})

router.get("/changeNum", async (req, res) => {

    let id = req.query.id;
    let model = req.query.model + "Model";
    let field = req.query.field;
    let num = req.query.num;

    var result = await appModel[model].find({ "_id": id });
    if (result.length > 0) {


        await appModel[model].updateOne({ "_id": id }, { [field]: num });
        res.send({
            success: true,
            message: '修改状态成功'
        });
    } else {
        res.send({
            success: false,
            message: '修改状态失败'
        })
    }

})



module.exports = router;