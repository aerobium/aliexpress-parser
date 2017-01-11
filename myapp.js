var express = require('express');
var app = express();
var aliGoGo = require('./parser.js');

var fs = require('fs');


//Converter Class
var Converter = require("csvtojson").Converter;
var converter = new Converter({
    delimiter: ","
});

//end_parsed will be emitted once parsing finished


//ToDo comment this to make parse

//converter.on("end_parsed", function (jsonArray) {
//    console.log(jsonArray); //here is your result jsonarray
//
//    //showJson(jsonArray);
//
//    aliGoGo.init(jsonArray);
//    aliGoGo.tick();
//
//});





//--------------------------- Start of file name parser ------------------------------------------
//let prefix = 'data/goods/5350/';  // - variant 1
let prefix = 'catalog/goods/105/';  // - variant 2


let files = fs.readdirSync('./output');
let fileNameArr = [];

let lastZeroFileNAme = '';
let zeroFileNameArr = [];

let longUrl = '';


for (let i in files) {


    let currentFileName = files[i].substring(0, files[i].lastIndexOf('-'));

    //console.log('A1: ' + currentFileName)

    if (currentFileName != lastZeroFileNAme) {
        console.log(prefix+longUrl);

        longUrl = '';
        lastZeroFileNAme = currentFileName;

        zeroFileNameArr.push(prefix+files[i]);

        //console.log(files[i])
        var index = files.indexOf(files[i]);
        files.splice(index, 1);
    }

    longUrl = longUrl + ',' + prefix + files[i];

}

let mySet = new Set(fileNameArr);

console.log(zeroFileNameArr)


for (let i of mySet) {

    console.log(i.left)
}

//--------------------------- End of file name parser ------------------------------------------



//read from file
require("fs").createReadStream("./testcsv-2.csv").pipe(converter);


///**
// * Display JSON file. For test.
// *
// * @param json
// */
//let showJson = function (json) {
//    for (var i = 0; i < json.length; i++) {
//        console.log(json[i]._FILE_NAME_ + " | " + json[i]._URL_)
//        console.log(json[i]._SIDE_)
//    }
//};


app.listen(3000, function () {
    console.log('Parser app listening on port 3000! GL & HF!');
});


