var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.sendRedirect = function(response, location, statusCode) {
  statusCode = statusCode || 302;
  // redirects browser by allowing them call another GET request with the proper location
  response.writeHead(statusCode, {Location: location});
  response.end();
};

exports.sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(JSON.stringify(data));
};

exports.collectResponse = function(request, callback) {
  var data;
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on ('end', function() {
    var responseUrl = data.split('=')[1];
    callback(responseUrl);
  });
};

exports.serveAssets = function(res, asset, callback) {
  var encoding = {encoding: 'utf8'};
  fs.readFile( archive.paths.siteAssets + asset, encoding, function(error, data) {
    if (error) {
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(error, data) {
        if (error) {
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};


// As you progress, keep thinking about what helper functions you can put here!
