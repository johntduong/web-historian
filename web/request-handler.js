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
    callback(JSON.parse(data));
  });
};

var actions = {
  'GET': function(req, res) {
    // take url request
    var returnResult;
    var url = req.url;
    // check if url exists
    if (archive.isUrlInList(url, null)) {
      // if it exists, display it
        // ie render in index
      returnResults = archive.readUrlFile(url);
    } else {
      // else add it to the list
      archive.addUrlToList(url, null);
      archive.downloadUrls(url);
        // TODO: show placeholder
      // console.log('constructor', Object.constructor(archive.readUrlFile));
      console.log(url);
      returnResults = archive.readUrlFile(url);
    }
    sendResponse(res, returnResults);
  },
  'POST': function(req, res) {
    collectResponse(req, function(data) {
      // 
    });
    // check if url is in list
    // if it is, call serve assets (show the page)
    // if not, add it to the list
      // show placeholder bot working page
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
  res.end(archive.paths.list);
};
