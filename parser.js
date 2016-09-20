var request = require('request');
let cheerio = require('cheerio');
var ImageDownloader = require('./imageDownloader.js');


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

            setTimeout(second_passed, 5000)

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

            if (Ali.current._SIDE_ == '0') {

                //here we get url from window.runParams.imageDetailPageURL=
                let imageDetailPageUrl = 'http://' + body.substring(body.lastIndexOf('PageURL="') + 11, body.lastIndexOf('window.runParams.imageBigViewURL') - 3);

                console.log('Single url: ' + imageDetailPageUrl);
                parseLeftSideImageTab(imageDetailPageUrl, Ali.current._FILE_NAME_, Ali.tick);

            } else {
                parseRightHorizontalImageTab(url, Ali.current._FILE_NAME_, Ali.tick);
            }
        }
    );

};


/**
 * Parse left-side images tab and call download() for each image url.
 *
 * @param url
 * @param fileName
 * @param callback
 */
let parseLeftSideImageTab = function (url, fileName, callback) {
    request(url, function (error, response, body) {

        let $ = cheerio.load(body);
        let arrOfImages = $('.new-img-600-center img');

        let arrOfUrls = [];

        arrOfImages.each(function () {
            arrOfUrls.push($(this).attr('src'));
        });

        let length = arrOfUrls.length;

        for (var i = 0; i < length; i++) {
            ImageDownloader.oneImageDownload(arrOfUrls[i], fileName + "-" + i + '.jpg', function () {
            });
        }

        callback();
    });
};


let parseRightHorizontalImageTab = function (url, fileName, callback) {

    request(url, function (error, response, body) {

        let $ = cheerio.load(body);
        let arrOfImages = $('#j-sku-list-2 img');

        let arrOfUrls = [];

        arrOfImages.each(function () {
            let currentImageUrl = $(this).attr('bigpic');
            arrOfUrls.push(encodeUriForCyrillicLinks(currentImageUrl));

        });

        let length = arrOfUrls.length;

        //ToDo раскомментировать потом
        for (var i = 0; i < length; i++) {
            ImageDownloader.oneImageDownload(arrOfUrls[i], fileName + "-" + i + '.jpg', function () {
            });
        }
        callback();
    });
};


/**
 * Encode URI for url's with cyrillic chars
 *
 * @param uri
 * @returns {string}
 */
let encodeUriForCyrillicLinks = function (uri) {

    let leftPart = uri.substring(0, uri.lastIndexOf('/'));
    let rightPart = uri.substr(uri.lastIndexOf('/') + 1);
    let resultUrl = '';
    let encodedRightPart = '';

    encodedRightPart = encodeURIComponent(rightPart);
    resultUrl = leftPart + '/' + encodedRightPart;

    return resultUrl;
};


module.exports = Ali;




