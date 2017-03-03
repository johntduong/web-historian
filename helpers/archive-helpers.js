var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');

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
      console.log(content);
      var fileList = content.split('\n');
      callback(fileList);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  // check if url is in sites.txt
  // console.log('url ',url)
  exports.readListOfUrls(function(content) {  
    // console.log('list of content ', content)
    var booleanValue = _.reduce(content, function(accumulator, curr) {
      // console.log('curr', curr)
      // console.log('url', url)
      if (!curr.length) {
        return accumulator;
      }

      if (url === curr) {
        console.log('equal', url)
        accumulator = true;
      } 
      return accumulator;
    }, false);
    // console.log(booleanValue);
    callback(booleanValue);
  });
};

exports.addUrlToList = function(url, callback) {
  console.log('we are adding to the list');
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(error, content) {
    if (error) {
      callback(error);
    } else {
      callback();
    }
  });

  fs.readFile(exports.paths.list, 'utf8', function(error, content) {
    if (error) {
      console.log(' THERE IS A HUGE ERROR HERE');
    } else {
      console.log('content after adding to the list', content)
    }
  })
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(error, content) {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  // need http://
  // pipe the readable stream with a createWriteStream
  console.log(urls)
  if (typeof urls === 'string') {
    urls = urls.split('\n');
  }
  console.log(urls)
  _.each(urls, function(url) {
    console.log(url);
    http.request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
    // fs.writeFile(exports.paths.archivedSites + '/' + url, 'hi friend');
    fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', function(error, content) {
      console.log(content);
    });
  });
};
