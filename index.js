import http from 'http'
import url from 'url'
import fs from 'mz/fs.js'
import 'dotenv/config'
import {readAndConvertToHtml} from './util/MarkdownToHtml.js'

// Retrieve and set env vairables
var invalidPathArr = process.env.INVALID_URLS.split(' ');
var blogDir = process.env.BLOG_DIR;
var blogFileType = process.env.BLOG_FILE_TYPE;
var port = process.env.PORT;
var siteDir = process.env.SITE_DIR;
var home = process.env.SITE_HOME;
var title = process.env.SITE_TITLE;
var footer = process.env.SITE_FOOTER;
var layout = siteDir + '/' + process.env.SITE_LAYOUT;
var title_placeholder = process.env.SITE_TITLE_PLACEHOLDER;
var menu_placeholder = process.env.SITE_MENU_PLACEHOLDER;
var content_placeholder = process.env.SITE_CONTENT_PLACEHOLDER;
var footer_placeholder = process.env.SITE_FOOTER_PLACEHOLDER;

// Create a server running on :port
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // Get URL and extract the path
  var path = url.parse(req.url,true).pathname;
  path = path.replace(/\//g,'');  
  var valid = (invalidPathArr.indexOf(path) >= 0) ? false : true;
  if (valid) {
    // Get markdown file from URL path
    if (path != '') {
      var fileLoc = blogDir + '/' + path + blogFileType;
    } else {
      var fileLoc = siteDir + '/' + home + blogFileType;
    }
    // Call markdown converter and send HTML
    var result = "";
    // Call the layout of the page
    const text = fs.readFile(layout, { encoding: 'utf8' })
    .then(
      function(data) {
        result = data;
        result = result.replace(title_placeholder, title);
        result = result.replace(footer_placeholder, footer);
        // Call content
        return readAndConvertToHtml(fileLoc);
      }
    )
    .then(
        function(data) {
          result = result.replace(content_placeholder, data);
          // Call Menu
          return readAndConvertToHtml(siteDir + '/menu' + blogFileType);
        }
    )
    .then(
      function(data) {
        result = result.replace(menu_placeholder, data);
        res.end(result);
      }
    );
  } else {
    res.end();
  }
}).listen(port);