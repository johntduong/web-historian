var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, utils.headers);
  response.end(JSON.stringify(data));
};

var collectResponse = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on ('end', function() {
    var responseUrl = data.split('=')[1];
    // should parse data but causes undefined
    callback(responseUrl);
  });
};

var actions = {
  'GET': function(req, res) {
    // // check if url exists
    // if (archive.isUrlInList(url, null)) {
    //   // if it exists, display it
    //     // ie render in index
    // } else {
    //   // else add it to the list
    //   // archive.addUrlToList(url, null);
    //   // archive.downloadUrls(url);
    //     // TODO: show placeholder
    // }
    var url = req.url;
    archive.isUrlArchived(url, function(bool, data, statusCode) {
      sendResponse(res, data, statusCode);
    });
  },
  'POST': function(req, res) {
    collectResponse(req, function(data) {
      archive.addUrlToList(data, function(content) {
        sendResponse(res, content, 302);
      });
    });
  },
  'OPTIONS': ''// TODO: set headers
};

exports.handleRequest = function (req, res) {
  var action = req.method; // grab request method
  if (actions[action]) {
    actions[action](req, res);
  } else {
    // TODO: send response with 404;
    sendResponse(res, '', 404);
  }
};
