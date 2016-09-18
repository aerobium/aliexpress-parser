var fs = require('fs');
var request = require('request');


var ImageDownloader = {


    /**
     * Download image by link and save it in the output folder.
     */
        oneImageDownload(uri, filename, callback){
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream('output/' + filename)).on('close', callback);
        });
        console.log('Downloading image: ' + filename)
    }

};


module.exports = ImageDownloader;