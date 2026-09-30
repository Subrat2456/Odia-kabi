import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const scriptIdx = html.indexOf('<script');
const htmlMarkup = html.slice(0, scriptIdx);
const jsCode = html.slice(scriptIdx);

const jsIdRefs = new Set();
const regex1 = /\$\(['"]#([a-zA-Z0-9_\-]+)['"]\)/g;
let m;
while ((m = regex1.exec(jsCode)) !== null) {
  jsIdRefs.add(m[1]);
}
const regex2 = /getElementById\(['"]([a-zA-Z0-9_\-]+)['"]\)/g;
while ((m = regex2.exec(jsCode)) !== null) {
  jsIdRefs.add(m[1]);
}

const htmlIds = new Set();
const regex3 = /id=['"]([a-zA-Z0-9_\-]+)['"]/g;
while ((m = regex3.exec(htmlMarkup)) !== null) {
  htmlIds.add(m[1]);
}

console.log('Total IDs in HTML markup:', htmlIds.size);
console.log('Total IDs queried in JS:', jsIdRefs.size);

const missing = [];
for (const id of jsIdRefs) {
  if (!htmlIds.has(id)) {
    missing.push(id);
  }
}
console.log('Queried IDs missing in HTML markup:', missing);
