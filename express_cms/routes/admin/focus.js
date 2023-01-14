const express = require("express");
const { multer } = require("../../model/tools");
const FocusModel = require("../../model/focusModel");
const fs = require("fs");
var router = express.Router();

router.get("/", async (req, res) => {
    var result = await FocusModel.find({});
    res.render("admin/focus/index", {
        list: result
    })
})

router.get("/add", (req, res) => {
    res.render("admin/focus/add")
})
router.post("/doAdd", multer().single('focus_img'), async (req, res) => {
    var focus_img = req.file ? req.file.path.substring(7) : "";
    var result = new FocusModel(Object.assign(req.body, { "focus_img": focus_img }));
    await result.save();
    res.redirect(`/${req.app.locals.adminPath}/focus`)
})

router.get("/edit", async (req, res) => {
    var id = req.query.id;
    var result = await FocusModel.find({ "_id": id });
    res.render("admin/focus/edit", {
        list: result[0]
    })
})

router.post("/doEdit", multer().single('focus_img'), async (req, res) => {

    try {
        if (req.file) {
            var focus_img = req.file ? req.file.path.substring(7) : "";
            await FocusModel.updateOne({ "_id": req.body.id }, Object.assign(req.body, { "focus_img": focus_img }))
        } else {
            await FocusModel.updateOne({ "_id": req.body.id }, req.body)
        }
        res.redirect(`/${req.app.locals.adminPath}/focus`);
    } catch (error) {
        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/focus/edit?id=${req.body.id}`,
            "message": "修改数据失败"
        })
    }

})

router.get("/delete", async (req, res) => {
    var id = req.query.id;
    var resultList = await FocusModel.find({ "_id": id });
    var delresult = await FocusModel.deleteOne({ "_id": id })
    if (delresult.ok == 1 && delresult.n == 1) {
        if (resultList[0].focus_img) {
            fs.unlink("static/" + resultList[0].focus_img, (err) => {
                console.log(err);
            })
        }
    }
    res.redirect(`/${req.app.locals.adminPath}/focus`)
})
module.exports = router;