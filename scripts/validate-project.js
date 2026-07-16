const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const requiredPrograms = [
  'cyber-security',
  'artificial-intelligence',
  'computer-science',
  'software-engineering',
  'information-technology',
  'data-science'
];
const sourceFiles = [
  'EUM_BS_Artificial_Intelligence_Curriculum.md',
  'EUM_BS_Computer_Science_Curriculum(2).md',
  'EUM_BS_Software_Engineering_Curriculum(2).md',
  'EUM_BS_Information_Technology_Curriculum.md',
  'EUM_BS_Data_Science_Curriculum.md'
];

function fail(message) {
  throw new Error(message);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail(`Duplicate HTML ids: ${[...new Set(duplicateIds)].join(', ')}`);

for (const asset of ['curricula.js']) {
  if (!fs.existsSync(path.join(root, asset))) fail(`Missing browser asset: ${asset}`);
  if (!html.includes(`src="${asset}"`)) fail(`index.html does not load ${asset}`);
}

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'curricula.js'), 'utf8'), context);
const curricula = context.window.additionalCurricula;
if (!curricula || typeof curricula !== 'object') fail('curricula.js did not define additionalCurricula');

for (const id of requiredPrograms.slice(1)) {
  const courses = curricula[id];
  if (!Array.isArray(courses) || courses.length === 0) fail(`${id} has no courses`);
  for (const [index, course] of courses.entries()) {
    for (const key of ['category', 'code', 'name', 'creditText', 'credit']) {
      if (course[key] === undefined || course[key] === '') fail(`${id} course ${index + 1} is missing ${key}`);
    }
    if (!Number.isFinite(course.credit) || course.credit <= 0) fail(`${id} course ${index + 1} has invalid credit hours`);
  }
  if (!html.includes(`id:'${id}'`)) fail(`index.html is missing program ${id}`);
}

for (const source of sourceFiles) {
  if (!fs.existsSync(path.join(root, source))) fail(`Missing curriculum source: ${source}`);
}

const pdfs = fs.readdirSync(root).filter(file => file.toLowerCase().endsWith('.pdf'));
if (pdfs.length) fail(`PDF files must not be published: ${pdfs.join(', ')}`);

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).filter(Boolean);
for (const [index, script] of inlineScripts.entries()) {
  new vm.Script(script, { filename: `index-inline-${index + 1}.js` });
}

console.log(`Validated ${requiredPrograms.length} programs and ${Object.values(curricula).flat().length} generated course records.`);
