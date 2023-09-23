import { promises as fs } from "fs";

export async function fileExist(fileLoc) {   
    return !!(await fs.stat(fileLoc).catch(e => false));
}