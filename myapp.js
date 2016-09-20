var express = require('express');
var app = express();
var aliGoGo = require('./parser.js');


//Converter Class
var Converter = require("csvtojson").Converter;
var converter = new Converter({
    delimiter: ","
});

//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonArray) {
    console.log(jsonArray); //here is your result jsonarray

    //showJson(jsonArray);

    aliGoGo.init(jsonArray);
    aliGoGo.tick();

});

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


