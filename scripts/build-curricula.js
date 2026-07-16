const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sources = {
  'artificial-intelligence': 'EUM_BS_Artificial_Intelligence_Curriculum.md',
  'computer-science': 'EUM_BS_Computer_Science_Curriculum(2).md',
  'software-engineering': 'EUM_BS_Software_Engineering_Curriculum(2).md',
  'information-technology': 'EUM_BS_Information_Technology_Curriculum.md',
  'data-science': 'EUM_BS_Data_Science_Curriculum.md'
};

function parseCurriculum(markdown) {
  let category = '';
  const courses = [];

  for (const rawLine of markdown.split(/\r?\n/)) {
    const heading = rawLine.match(/^##\s+(?:\d+\.\s*)?(.+?)(?:\s+\([^)]*Credit Hours?\))?\s*$/i);
    if (heading) {
      category = heading[1].trim();
      continue;
    }

    if (!category || /^(Summary|Curriculum Summary)$/i.test(category)) continue;
    const cells = rawLine.split('|').slice(1, -1).map(cell => cell.trim());
    if (cells.length !== 4 || !/^\d+$/.test(cells[0])) continue;

    const creditText = cells[3];
    const credit = Number.parseFloat(creditText);
    if (!Number.isFinite(credit)) continue;
    courses.push({ category, code: cells[2], name: cells[1], creditText, credit });
  }

  return courses;
}

const curricula = Object.fromEntries(Object.entries(sources).map(([id, filename]) => {
  const markdown = fs.readFileSync(path.join(root, filename), 'utf8');
  return [id, parseCurriculum(markdown)];
}));

const banner = '// Generated from the local EUM curriculum Markdown files.\n// Run: node scripts/build-curricula.js\n';
const output = `${banner}window.additionalCurricula = ${JSON.stringify(curricula, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'curricula.js'), output, 'utf8');

for (const [id, courses] of Object.entries(curricula)) {
  const credits = courses.reduce((sum, course) => sum + course.credit, 0);
  console.log(`${id}: ${courses.length} listed courses, ${credits} listed credits`);
}
