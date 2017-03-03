var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    // change request url to match formatting of actual stored archive urls
    var url = req.url;
    if (req.url !== '/' ) {
      url = req.url.split('=')[1];
    } 
    archive.isUrlInList(url, function(bool) {
      if (bool) {
        // if in list
        archive.isUrlArchived(url, function(bool, data, statusCode) {
          utils.sendResponse(res, data, statusCode);
        });
      } else {
        // add to list
        archive.addUrlToList(url, function(data) {
          archive.downloadUrls(url);
        });
      }
    });
  },

  'POST': function(req, res) {
    // utils.collectResponse(req, function(data) {
    //   archive.addUrlToList(data, function(content) {
    //     utils.sendResponse(res, content, 302);
    //   });
    // });
  }
};

exports.handleRequest = function (req, res) {
  var action = req.method; // grab request method
  if (actions[action]) {
    actions[action](req, res);
  } else {
    // TODO: send response with 404;
    utils.sendResponse(res, null, 404);
  }
};