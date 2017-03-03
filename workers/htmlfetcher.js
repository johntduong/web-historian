var archive = require('../helpers/archive-helpers');
// utilize readListOfUrls to apply download on all listed urls
// pass in callback function which gets invoked in archive.readListOfUrls
archive.readListOfUrls(archive.downloadUrls);
// archive.downloadUrls('www.amazon.com')