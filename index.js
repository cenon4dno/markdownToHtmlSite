import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import http from 'http'
import url from 'url'
import fs from 'mz/fs.js'
import 'dotenv/config'

// Set variables
var invalidPathArr = process.env.INVALID_URLS.split(' ');
var blogDir = process.env.BLOG_DIR;
var blogFileType = process.env.BLOG_FILE_TYPE;
var port = process.env.PORT;
var defaultDir = process.env.DEFAULT_DIR;
var home = process.env.DEFAULT_HOME;
var layout = defaultDir + '/' + process.env.DEFAULT_LAYOUT;

async function readFile(fileLoc) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(await read(fileLoc))

  return String(file);
}

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  // Get URL
  var path = url.parse(req.url,true).pathname;
  path = path.replace(/\//g,'');  
  var valid = (invalidPathArr.indexOf(path) >= 0) ? false : true;
  if (valid) {
    // Get markdown file from URL path
    if (path != '') {
      var fileLoc = blogDir + '/' + path + blogFileType;
    } else {
      var fileLoc = defaultDir + '/' + home + blogFileType;
    }
    // call markdown converter and send HTML
    var result = "";
    const text = fs.readFile(layout, { encoding: 'utf8' })
    .then(
      function(data) {
        result = data;
        // call content
        return readFile(fileLoc);
      }
    )
      .then(
          function(data) {
            result = result.replace("CCCC", data);
            // call Menu
            return readFile(defaultDir + '/menu' + blogFileType);
          }
      )
      .then(
        function(data) {
          result = result.replace("MMMM", data);
          res.end(result);
        }
    );
  } else {
    res.end();
  }
}).listen(port);