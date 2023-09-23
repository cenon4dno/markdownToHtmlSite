import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import {read} from 'to-vfile'
import {fileExist} from './fileExist.js'

export async function readAndConvertToHtml(fileLoc) {   
    if (await fileExist(fileLoc)) {
        const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(await read(fileLoc))
    
        return String(file);
    } else {
        return "Page not found " + fileLoc;
    }
}

