/**
 * Created by Vijaya Yeruva on 5/27/2017.
 */

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://weblesson8:weblesson8@ds117913.mlab.com:17913/aplwebdemo';// change it with your db credentials

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var myobj = [
        {Id: '4af31b30f964a520b3ea21e3', Name: 'Pizza Bar'},
        {Id: '4b019e70f964a520ff4322e3', Name: 'Minsky Pizza'},
        {Id: '4b944769f964a520a37234e3', Name: 'Pizza Hut'},
        {Id: '4bbcc68fa0a0c9b696c61a0f', Name: 'KFC/Pizza Hut Express'},
        {Id: '55008ea0498ef17172c53198', Name: 'SPIN! Neapolitan Pizza'},
        {Id: '58bef838eef5da0959f053f7', Name: 'Homeslice Pizza & Pints'},
        {Id: '58c70a133e88355bb46c240d', Name: 'Dominos Pizza'},
        {Id: '4abd956af964a5200c8b20e3', Name: 'Waldo Pizza'},
        {Id: '4adfb4aaf964a520de7c21e3', Name: 'Pizza Bella'},
        {Id: '4b78b677f964a520f7de2ee3', Name: 'Joes Pizza Buy the Slice'}
    ];
    db.collection("Restaurants").insertMany(myobj, function (err, res) {
        if (err) throw err;
        db.close();
    });
});

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("Restaurants").find({}).toArray(function (err, result) {
        if (err) throw err;
        db.close();
        var fs = require('fs');
        var data = []
        for (i = 0; i < 10; i++) {
            var obj = {
                name: result[i].Name,
                id: result[i].Id

            }
            data.push(obj)
        }
        var newdata = [{
            "name": "Kansas City",
            "parent": "US",
            "children": data
        }
        ]
        fs.writeFile("Restaurants.json", JSON.stringify(newdata), function (err) {
                if (err) throw err;
            }
        );
    });
});