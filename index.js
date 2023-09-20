import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import http from 'http'
import url from 'url'
import 'dotenv/config'

// Set variables
var invalidPathArr = process.env.INVALID_URLS.split(' ');
var blogDir = process.env.BLOG_DIR;
var blogFileType = process.env.BLOG_FILE_TYPE;
var port = process.env.PORT;

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
    var fileLoc = blogDir + '/' + path + blogFileType;
    // call markdown converter and send HTML
    const text = readFile(fileLoc).then(
        function(result) {res.end(result);}
    );
  } else {
    res.end();
  }
}).listen(port);