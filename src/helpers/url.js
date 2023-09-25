import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export default function basePathName(url){
    return url.split('/')[url.split('/').length - 1]
}