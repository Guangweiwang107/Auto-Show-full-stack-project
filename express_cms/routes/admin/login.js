const express = require("express");
const svgCaptcha = require('svg-captcha');
const ManagerModel = require('../../model/managerModel')

const md5 = require('md5');

var router = express.Router();

router.get("/", async (req, res) => {
    // let result = new ManagerModel({
    //     username: "zhangsan",
    //     password: md5("1234567")
    // })
    // await result.save((err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log(result);
    // });

    res.render("admin/login/login.html")
})

router.post('/doLogin', async (req, res) => {
    let verify = req.body.verify;
    let username = req.body.username;
    let password = req.body.password;

    if (verify.toLocaleLowerCase() != req.session.captcha.toLocaleLowerCase()) {
        res.render("admin/public/error.html", {
            "redirectUrl": `/${req.app.locals.adminPath}/login`,
            "message": "图形验证码输入错误"
        })
        return
    }

    let result = await ManagerModel.find({ "username": username, "password": md5(password) });

    if (result.length > 0) {
        req.session.userinfo = result[0]

        res.render("admin/public/success.html", {
            "redirectUrl": `/${req.app.locals.adminPath}`,
            "message": "登陆成功"
        })
    } else {
        res.render('admin/public/error.html', {
            "redirectUrl": `/${req.app.locals.adminPath}/login`,
            "message": "用户名或者密码错误"
        })
    }
})

router.get('/verify', (req, res) => {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
})

router.get('/loginOut', (req, res) => {
    req.session.userinfo = null;
    res.redirect(`/${req.app.locals.adminPath}/login`)
})

module.exports = router;