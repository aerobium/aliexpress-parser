var fs = require('fs');
var request = require('request');
let cheerio = require('cheerio');

var Ali = {
    init(options){
        this.options = options;
    },

    getNext(){
        return this.options.pop()
    },

    tick(){

        Ali.current = Ali.getNext();
        if (!Ali.current){
            console.log('Process completed!');
            function second_passed() {
                process.exit();
            }
            setTimeout(second_passed, 3000)


        }else{
            request(Ali.current._URL_, function (error, response, body) {
                    let imageDetailPageUrl = 'http://' + body.substring(body.lastIndexOf('PageURL="') + 11, body.lastIndexOf('window.runParams.imageBigViewURL') - 3);
                    makeNextRequest(imageDetailPageUrl, Ali.current._FILE_NAME_, Ali.tick);
                }
            );
        }


    }
};

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream('output/' + filename)).on('close', callback);
    });
    console.log('Downloading: ' + filename)
};


let makeNextRequest = function (url, fileName, callback) {
    request(url, function (error, response, body) {

        let $ = cheerio.load(body);
        let arrOfImages = $('.new-img-600-center img');

        let arrOfUrls = [];

        arrOfImages.each(function () {
            arrOfUrls.push($(this).attr('src'));
        });

        let length = arrOfUrls.length;

        for (var i = 0; i < length; i++) {
            download(arrOfUrls[i], fileName + "-" + i + '.jpg', function () {
                //console.log('done ' + fileName + "-" + i + '.jpg');
            });
        }
        callback();
    });
};




module.exports = Ali;




