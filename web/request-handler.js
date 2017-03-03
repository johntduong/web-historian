var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    // change request url to match formatting of actual stored archive urls
    var url = req.url;

    if (url.includes('=')) {
      url = req.url.split('=')[1];
    }

    if (url === '/') {
      url = '/index.html';
    }

    utils.serveAssets(res, url, function() {
      // serve assets will check url against public (index&loading)
      // will also check archivedSites
        // will then execute callback IF not in archivedSites
        // otherwise, sends response
      // so check if url is in list
      archive.isUrlInList(url, function(bool) {
        if (bool) {
          // if it is already in list, redirect
          utils.sendRedirect(res, '/loading.html');
        } else { // if not
          // ** send 404 **  (get is just serving so do not add to list)
          utils.sendResponse(res, 'File not found 404', 404);
        }
      });
    });
  },

  'POST': function(req, res) {
    utils.collectResponse(req, function(data) {
      if (data.includes('=')) {
        var url = data.split('=')[1].replace('http://', '');
      } else {
        url = data;
      }
      // adding a new url so do not invoke serveAssets
      // check if url is in the list
      archive.isUrlInList(url, function(bool) {
        if (bool) {
          // if it is in the list, check if it is in the archive
          archive.isUrlArchived(url, function(bool) {
            if (bool) {
              // serve if already in archive
              utils.sendRedirect(res, '/' + url);
            } else {
              // in list but not archived yet, send redirect
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          // not yet in list
          archive.addUrlToList(url, function() {
            // add to list and redirect client
            utils.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var action = req.method;
  if (actions[action]) {
    actions[action](req, res);
  } else {
    utils.sendResponse(res, null, 404);
  }
};