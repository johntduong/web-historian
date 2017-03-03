var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, content) {
    if (error) {
      callback(error); 
    } else {
      var fileList = content.split('\n');
      callback(fileList);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  // check if url is in sites.txt
  exports.readListOfUrls(function(content) {  
    callback(_.reduce(content, function(accumulator, curr) {
      if (url === curr) {
        accumulator = true;
      } 
      return accumulator;
    }, false));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(error, content) {
    if (error) {
      callback(error);
    } else {
      callback(url);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  if (url === '/') {
    fs.readFile('/Volumes/student/hrsf72-web-historian/web/public/index.html', 'utf8', function(error, content) {
      if (error) {
        callback(false, error, 404);
      } else {
        callback(true, content, undefined);
      }
    });
  } else {
    fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(error, content) {
      if (error) {
        callback(false, error, 404);
      } else {
        if (!content) {
          callback(false, null, 404);
        } else {
          callback(true, content, undefined);
        }
      }
    });
  }
};

exports.downloadUrls = function(urls) {
  // need http://
  // pipe the readable stream with a createWriteStream
  if (typeof urls === 'string') {
    urls = urls.split('\n');
  }
  _.each(urls, function(url) {
    console.log('inside', url)
    http.request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
