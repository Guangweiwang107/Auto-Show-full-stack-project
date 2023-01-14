const express = require('express');
const tools = require("../../model/tools");
const { getUnix } = require("../../model/tools");
const NavModel = require("../../model/navModel");

var router = express.Router();

router.get('/', async (req, res) => {
    var result = await NavModel.find({});
    res.render("admin/nav/index", {
        list: result
    })
})

router.get("/add", (req, res) => {
    res.render("admin/nav/add")
})

router.post('/doAdd', async (req, res) => {

    try {

        var addResult = new NavModel(Object.assign(req.body, { add_time: getUnix() }))
        await addResult.save()
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav`,
            "message": "添加成功"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav/add`,
            "message": "添加失败"
        })
    }
})

router.get('/edit', async (req, res) => {

    var id = req.query.id;

    var result = await NavModel.find({ "_id": id });

    if (result.length > 0) {
        res.render("admin/nav/edit", {
            list: result[0]
        })
    } else {
        res.redirect(`/${req.app.locals.adminPath}/nav`)
    }
})


router.post('/doEdit', async (req, res) => {

    try {

        await NavModel.updateOne({ "_id": req.body.id }, req.body)

        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav`,
            "message": "修改成功"
        })
    } catch (error) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/nav/edit?id=${req.body.id}`,
            "message": "修改失败"
        })
    }
})

router.get('/delete', async (req, res) => {

    var id = req.query.id;

    await NavModel.deleteOne({ "_id": id });

    res.render("admin/public/success", {
        redirectUrl: `/${req.app.locals.adminPath}/nav`,
        message: "删除成功"
    })


})

module.exports = router;