var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
    var dest, fileName, fs = require('fs');


    fileName = req.files[0].originalname;


    html = "";
    html += "<script type='text/javascript'>";
    html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
    html += "    var url     = \"/images/uploads/" + fileName + "\";";
    html += "    var message = \"Uploaded file successfully\";";
    html += "";
    html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url);";
    html += "</script>";

    res.send(html);


});

module.exports = router;
