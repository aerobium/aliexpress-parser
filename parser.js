var fs = require('fs');
var request = require('request');
let cheerio = require('cheerio');


/**
 *
 * @type {{init, getNext, tick}}
 */
var Ali = {
    init(options){
        this.options = options;
    },

    getNext(){
        return this.options.pop()
    },

    tick(){

        Ali.current = Ali.getNext();
        if (!Ali.current) {
            console.log('Process completed!');
            function second_passed() {
                process.exit();
            }

            setTimeout(second_passed, 3000)


        } else {
            getPage(Ali.current._URL_);
        }


    }
};

/**
 * Download page and call page parser
 * @param url
 */
let getPage = function (url) {
    request(url, function (error, response, body) {
            let imageDetailPageUrl = 'http://' + body.substring(body.lastIndexOf('PageURL="') + 11, body.lastIndexOf('window.runParams.imageBigViewURL') - 3);
            parseOnePage(imageDetailPageUrl, Ali.current._FILE_NAME_, Ali.tick);
        }
    );

};

/**
 * Download image by link and save it in the output folder.
 *
 * @param uri
 * @param filename
 * @param callback
 */
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream('output/' + filename)).on('close', callback);
    });
    console.log('Downloading: ' + filename)
};


/**
 * Parse left-side images tab and call download() for each image url.
 *
 * @param url
 * @param fileName
 * @param callback
 */
let parseOnePage = function (url, fileName, callback) {
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




