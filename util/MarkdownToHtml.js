import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import {read} from 'to-vfile'

export async function readAndConvertToHtml(fileLoc) {
    const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(await read(fileLoc))
    
    return String(file);
}