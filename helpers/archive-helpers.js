var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
};

exports.isUrlInList = function(url, callback) {
  // check if url is in sites.txt
  var listItems = fs.readFile('/Volumes/student/hrsf72-web-historian/test/testdata/sites.txt', 'utf8', function(error, content) {
    if (error) {
      callback(error);
    } else {
      var items = content.toString().split(' ');
      _.reduce(items, function(accumulator, curr) {
        if (url === curr) {
          accumulator = true;
        }
        return accumulator;
      }, false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.writeFile('/Volumes/student/hrsf72-web-historian/test/testdata/sites.txt', url, 'utf8');
};
exports.isUrlArchived = function(url, callback) {
};

exports.downloadUrls = function(urls) {
  var path = '/Volumes/student/hrsf72-web-historian/archives/sites' + urls;
  // make file and close
  var fd = fs.open(path, 'w', function() {});
  fs.write(fd, url, 'utf8');
  fs.close(fd);
};

// made by us
exports.readUrlFile = function(url) {
  var path = '/Volumes/student/hrsf72-web-historian/archives/sites' + url;
  console.log(path);
};

      // it('should return the content of a website from the archive', function (done) {
      //   var fixtureName = 'www.google.com';
      //   var fixturePath = archive.paths.archivedSites + '/' + fixtureName;

      //   // Create or clear the file.
      //   var fd = fs.openSync(fixturePath, 'w');
      //   fs.writeSync(fd, 'google');
      //   fs.closeSync(fd);

      //   // Write data to the file.
      //   fs.writeFileSync(fixturePath, 'google');

      //   request
      //     .get('/' + fixtureName)
      //     .expect(200, /google/, function (err) {
      //       fs.unlinkSync(fixturePath);
      //       done(err);
      //     });
      // });