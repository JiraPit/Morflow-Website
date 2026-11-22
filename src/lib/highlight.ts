/**
 * A small syntax highlighter for the code cards on content pages. It emits
 * the same `tok-*` classes the hand-highlighted docs use (docs.css), so every
 * code sample on the site looks alike. It is a tokenizer, not a parser: good
 * enough for short, well-formed samples.
 */
export type Lang = 'python' | 'dart' | 'ts' | 'js' | 'csharp' | 'go' | 'morf' | 'shell' | 'yaml' | 'text';

const KEYWORDS: Record<Lang, string[]> = {
  python: ['import', 'from', 'as', 'def', 'class', 'return', 'for', 'in', 'if', 'else', 'elif', 'with', 'not', 'and', 'or', 'None', 'True', 'False', 'lambda', 'yield', 'while', 'try', 'except', 'pass'],
  dart: ['import', 'as', 'show', 'final', 'const', 'var', 'void', 'return', 'async', 'await', 'class', 'extends', 'for', 'in', 'if', 'else', 'new', 'null', 'true', 'false', 'late', 'static', 'this', 'super', 'required', 'try', 'catch', 'finally', 'override'],
  ts: ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'throw', 'new', 'type', 'interface', 'as', 'of', 'for', 'null', 'undefined', 'true', 'false', 'typeof', 'require'],
  js: ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'throw', 'new', 'for', 'of', 'null', 'undefined', 'true', 'false', 'typeof', 'require', 'module', 'declare'],
  csharp: ['using', 'public', 'private', 'readonly', 'const', 'static', 'class', 'void', 'var', 'new', 'return', 'if', 'else', 'async', 'await', 'try', 'catch', 'finally', 'null', 'true', 'false', 'this', 'float', 'int', 'bool', 'string', 'get', 'set', 'out', 'in'],
  go: ['package', 'import', 'func', 'return', 'if', 'else', 'for', 'range', 'var', 'const', 'type', 'struct', 'defer', 'go', 'nil', 'true', 'false', 'err', 'map', 'any', 'string', 'int', 'int32', 'int64', 'float32', 'float64', 'byte', 'bool', 'error'],
  morf: ['import', 'from', 'accept', 'emit', 'each', 'if', 'else', 'true', 'false'],
  shell: [],
  yaml: [],
  text: [],
};

const TYPES: Record<Lang, RegExp | null> = {
  python: null,
  dart: /^(?:[A-Z][A-Za-z0-9_]*|int|double|bool|num|dynamic)$/,
  ts: /^(?:[A-Z][A-Za-z0-9_]*|string|number|boolean|void)$/,
  js: null,
  csharp: /^[A-Z][A-Za-z0-9_]*$/,
  go: /^[A-Z][A-Za-z0-9_]*$/,
  morf: /^(?:Tensor|Image|Audio|Scalar|Bytes|Composite|IntArg|FloatArg|StrArg|BoolArg)$/,
  shell: null,
  yaml: null,
  text: null,
};

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls: string, s: string) => `<span class="tok-${cls}">${escape(s)}</span>`;

/** Highlights one line of shell: the command word, flags, comments, strings. */
function shellLine(line: string): string {
  const comment = line.match(/^(\s*)(#.*)$/);
  if (comment) return escape(comment[1]) + span('comment', comment[2]);
  let out = '';
  let first = true;
  for (const part of line.split(/(\s+)/)) {
    if (/^\s*$/.test(part)) { out += part; continue; }
    if (first && !part.startsWith('$')) { out += span('fn', part); first = false; continue; }
    first = false;
    if (/^--?[\w-]+/.test(part)) out += span('param', part);
    else if (/^["'].*["']$/.test(part)) out += span('str', part);
    else out += escape(part);
  }
  return out;
}

/** Highlights one line of YAML: keys, comments, values. */
function yamlLine(line: string): string {
  const m = line.match(/^(\s*-?\s*)([\w.\-/]+)(:)(.*)$/);
  if (m) {
    const [, lead, key, colon, rest] = m;
    const value = rest.trim();
    const shown = value === '' ? escape(rest) : escape(rest.slice(0, rest.indexOf(value))) + (/^[\d.^]/.test(value) ? span('num', value) : span('str', value));
    return escape(lead) + span('param', key) + escape(colon) + shown;
  }
  const item = line.match(/^(\s*-\s*)(.*)$/);
  if (item) return escape(item[1]) + span('str', item[2]);
  const comment = line.match(/^(\s*)(#.*)$/);
  if (comment) return escape(comment[1]) + span('comment', comment[2]);
  return escape(line);
}

export function highlight(code: string, lang: Lang): string {
  if (lang === 'text') return escape(code);
  if (lang === 'shell') return code.split('\n').map(shellLine).join('\n');
  if (lang === 'yaml') return code.split('\n').map(yamlLine).join('\n');

  const keywords = new Set(KEYWORDS[lang]);
  const types = TYPES[lang];
  const comment = lang === 'dart' || lang === 'ts' || lang === 'js' || lang === 'csharp' || lang === 'go' ? '//[^\\n]*' : '#[^\\n]*';
  const token = new RegExp(
    [
      `(${comment})`, // 1 comment
      `("""[\\s\\S]*?"""|r?'(?:\\\\.|[^'\\\\\\n])*'|r?"(?:\\\\.|[^"\\\\\\n])*")`, // 2 string
      `(\\$[A-Za-z_]\\w*)`, // 3 morf variable
      `(\\b\\d+(?:\\.\\d+)?(?:e-?\\d+)?\\b)`, // 4 number
      `([A-Za-z_]\\w*)(?=\\s*(?:<[^>()]*>)?\\()`, // 5 call
      `([A-Za-z_]\\w*)`, // 6 word
      `(>>|=>|->)`, // 7 operator
    ].join('|'),
    'g',
  );

  let out = '';
  let last = 0;
  for (const m of code.matchAll(token)) {
    out += escape(code.slice(last, m.index));
    last = m.index! + m[0].length;
    const [text, cmt, str, variable, num, call, word, op] = m;
    if (cmt) out += span('comment', text);
    else if (str) out += span('str', text);
    else if (variable) out += lang === 'morf' ? span('var', text) : escape(text);
    else if (num) out += span('num', text);
    else if (call) out += keywords.has(call) ? span('keyword', text) : types?.test(call) ? span('type', text) : span('fn', text);
    else if (word) out += keywords.has(word) ? span('keyword', text) : types?.test(word) ? span('type', text) : escape(text);
    else if (op) out += span('op', text);
    else out += escape(text);
  }
  return out + escape(code.slice(last));
}
