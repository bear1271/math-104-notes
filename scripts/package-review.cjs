
/* SPDX-License-Identifier: GPL-3.0-only */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const source = process.argv[2];
if (!source) throw Error('Pass the path to the local Interactive Review folder.');
const target = path.join(__dirname, '..', 'docs');
const read = name => fs.readFileSync(path.join(source, name), 'utf8');
const write = (name, content) => fs.writeFileSync(path.join(target, name), content, 'utf8');
const context = {window: {}};
for (const name of ['data.js', 'reference-data.js']) vm.runInNewContext(read(name), context, { filename: name });

const { M104: local, M104Reference: reference } = context.window;
const summaries = new Map(reference.proofs.map(p => [p.ref, p.statement]));
const escape = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const review = {
  built: local.built,
  publicEdition: true,
  events: [],
  classes: local.classes.map(({ reading, exercises_html, exam_links, ...c }) => ({
    ...c, reading: '', exercises_html: '', exam_links: [],
  })),
  items: Object.fromEntries(Object.entries(local.items).map(([key, { statement, proof, extra, ...item }]) => {
    const authored = summaries.get(key);
    const summary = authored && authored !== 'See the numbered handout statement.'
      ? escape(authored) : escape(item.gist);
    const structured = item.hypotheses?.length && item.conclusion
      ? '<p><strong>Conditions.</strong> ' + item.hypotheses.map(escape).join('; ')
        + '</p><p><strong>Conclusion.</strong> ' + escape(item.conclusion) + '</p>'
      : '';
    return [key, { ...item, statement: '<p>' + summary + '</p>' + structured, proof: '', extra: [] }];
  })),
  relations: local.relations,
  questions: local.questions,
  comparisons: local.comparisons,
  threads: local.threads,
  museum: local.museum,
};
const shell = read('app.js');
const patched = shell
  .replace(/Built \$\{esc\(D\.built\.slice\(0, 10\)\)\} from the official Rudin[\s\S]*?check against Rudin\/Ross\./,
    'Independent Math 104 study notes. Class and theorem numbers identify the course and textbook references. <a href="https://github.com/bear1271/math-104-notes">Source and licensing</a>.')
  .replaceAll("srcTag(true, 'Handout statement')", "srcTag(false, 'Study statement')")
  .replace('srcTag(true, `Handout ·', 'srcTag(false, `Study statement ·')
  .replace('Numbered handout results', 'Numbered course results')
  .replace("if (location.protocol.startsWith('http')) fetch('api/health')", "if (!D.publicEdition && location.protocol.startsWith('http')) fetch('api/health')")
  .replace("location.protocol === 'file:' ? 'opened from disk: the model check needs the workstation server'", "D.publicEdition ? 'Self-check is available on this public edition' : location.protocol === 'file:' ? 'opened from disk: the model check needs the workstation server'")
  .replace('    <div class="row" style="margin-top:.6rem"><button class="btn primary" id="ai" disabled>', '    <div class="row" style="margin-top:.6rem"><button class="btn primary" id="ai" hidden disabled>')
  .replace("${srcTag(true, 'Suggested exercises')}<div class=\"small\">${c.exercises_html || '—'}</div>",
    "RESOURCE_SLOT");
const slot=patched.includes('RESOURCE_SLOT')
  ? patched.replace('RESOURCE_SLOT', '<a class="small" href="#/homework">Homework references</a>')
  : patched.replace(/\$\{srcTag\(true, 'Suggested exercises'\)\}<div class="small">[^\r\n]*<\/div>/, '<a class="small" href="#/homework">Homework references</a>');

assert(!slot.includes('D.handout_sha256'), 'Private data footer still present.');
assert(!slot.includes("if (location.protocol.startsWith('http')) fetch('api/health')"), 'Private endpoint would be queried.');
assert.equal(Object.keys(review.items).length, Object.keys(local.items).length);
for (const item of Object.values(review.items)) {
  assert(item.gist && item.statement && !item.proof && item.extra.length === 0);
}
const data = 'window.M104=' + JSON.stringify(review) + ';\n';

const copied = ['style.css','labs.js','reference-data.js','proof-lab-data.js','proof-source-notes.js'];
const stamp = crypto.createHash('sha256').update(data).update(slot)
  .update(copied.map(read).join('\n')).digest('hex').slice(0,12);
fs.mkdirSync(target, {recursive: true});
write('data.js', data);
write('app.js', slot);
write('index.html', read('index.html').replace(/\?v=[0-9a-f]+/g, '?v=' + stamp));
write('.nojekyll', '');
for (const name of copied) fs.copyFileSync(path.join(source, name), path.join(target, name));
fs.cpSync(path.join(source, 'vendor'), path.join(target, 'vendor'), {recursive: true, errorOnExist: false});
console.log('Packaged public review:', review.classes.length, 'classes,', Object.keys(review.items).length, 'items, and', review.questions.length, 'questions.');

