const express = require('express');
const app = express();
var path = require("path");
var bodyParser = require('body-parser');
var geodist = require('geodist');


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "mysqlip",
    user: "mysqluser",
    password: "mysqlpass",
    database: "mysqldatabase"
});

//get all companies from mysql and compare cordinates to find closest. then res.send

// enter the quarry with the array number already put in
function getlatfromquarry(quarry) {

    var i;
    var fixlowbug = false;
    var completnumber = '';
    var completnumberr = '';
    for (i = 0; i < 10; i++) {
        var a = i + 15;
        if (i == 9) {

            if (quarry.cord.charAt(a) == ',') {
                fixlowbug = true;
                console.log("bugfixed")
                a2 = a - 1
                completnumber = completnumber + quarry.cord.charAt(a2)

            }
            else {
                completnumber = completnumber + quarry.cord.charAt(a)
            }
        }
        else {
            completnumber = completnumber + quarry.cord.charAt(a)
        }

    }
    i = 0;
    for (i = 0; i < 10; i++) {

        var a = i + 39;
        if (fixlowbug == true) {
            a = a - 1
        }
        completnumberr = completnumberr + quarry.cord.charAt(a)

    }

    var array = [completnumber, completnumberr]
    return array;

}
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/mainpage.html'));
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/ajaxcall', function (req, res) {

    console.log("dis", req.body.dis);







    connection.query('SELECT * FROM finalstoreinfo', function (error, results, fields) {
        if (error) throw error;
        var a = 0;
        var b = results.length;
        var newarrayinorder = [];

        while (a < b) {

            var distance;
            var cordinates = getlatfromquarry(results[a]);
            var p1 = { lon: cordinates[1], lat: cordinates[0] }
            var p2 = { lat: req.body.long, lon: req.body.lat }

            distance = geodist(p1, p2, { format: false, unit: 'km' });
            console.log("distance", distance);
            var newobject = {
                name: results[a].name,
                website: results[a].website, price: results[a].price, distance: distance, lon: p1.lon, lat: p1.lat

            }
            if (req.body.dis+1 >= distance) {
                newarrayinorder.push(newobject);

                
            }
            a = a + 1;
        }
        var myJsonString = JSON.stringify(newarrayinorder);

        res.send(myJsonString);
        //console.log(getlatfromquarry(results[5]))
    });



});


app.listen(8000, () => console.log('Example app listening on port 3000!'))
