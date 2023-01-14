const express = require("express");
const router = express.Router();
const ManagerModel = require('../../model/managerModel');
const { md5, getUnix } = require("../../model/tools")

router.get('/', async (req, res) => {

    let result = await ManagerModel.find({})

    res.render("admin/manager/index.html", {
        list: result
    })
});

router.get("/add", (req, res) => {
    res.render('admin/manager/add.html')
})

router.post("/doAdd", async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;

    if (username == "") {
        res.render("admin/public/error.html", {
            "redirectUrl": "/admin/manager/add",
            "message": "用户名不能为空"
        })
        return;
    }
    if (password.length < 6) {
        res.render('admin/public/error', {
            message: '密码长度不能小于6',
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }
    if (password != rpassword) {
        res.render('admin/public/error', {
            message: "密码和确认密码不一致",
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    }



    let result = await ManagerModel.find({ "username": username })
    if (result.length > 0) {
        res.render('admin/public/error', {
            message: "当前用户已经存在，请换一个用户",
            redirectUrl: `/${req.app.locals.adminPath}/manager/add`
        })
        return;
    } else {
        var addResult = new ManagerModel({
            username,
            password: md5(password),
            email,
            mobile,
            status,
            add_time: getUnix()
        })

        await addResult.save()

        res.redirect(`/${req.app.locals.adminPath}/manager`)
    }

})

router.get("/edit", async (req, res) => {

    var id = req.query.id;
    var result = await ManagerModel.find({ "_id": id });
    console.log(result);
    if (result.length > 0) {
        res.render("admin/manager/edit.html", {
            list: result[0]
        })
    } else {
        res.redirect(`/${req.app.locals.adminPath}/manager`)
    }
})

router.post("/doEdit", async (req, res) => {

    var id = req.body.id;
    var password = req.body.password;
    var rpassword = req.body.rpassword;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var status = req.body.status;

    if (password.length > 0) {
        if (password.length < 6) {
            res.render('admin/public/error', {
                message: '密码长度不能小于6',
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        if (password != rpassword) {
            res.render("admin/public/error", {
                message: "密码和确认密码不一致",
                redirectUrl: `/${req.app.locals.adminPath}/manager/edit?id=${id}`
            })
            return;
        }
        await ManagerModel.updateOne({ "_id": id }, {
            "email": email,
            "mobile": mobile,
            "password": md5(password),
            "status": status
        })

    } else {
        await ManagerModel.updateOne({ "_id": id }, {
            "email": email,
            "mobile": mobile,
            "status": status
        })
    }
    res.redirect(`/${req.app.locals.adminPath}/manager`)
})

router.get("/delete", async (req, res) => {

    var id = req.query.id;
    var result = await ManagerModel.deleteOne({ "_id": id });
    console.log(result);
    res.render("admin/public/success", {
        message: "删除成功",
        redirectUrl: `/${req.app.locals.adminPath}/manager`
    })
})

module.exports = router;