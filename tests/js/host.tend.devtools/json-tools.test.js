// Pure-module tests for extensions/host.tend.devtools/lib/json-tools.js.
// Run with `bun test tests/js` from the repo root (see CONTRIBUTING.md).
import { describe, expect, test } from 'bun:test';
import { describeError, formatJson, locate, minifyJson, parseJson } from '../../../extensions/host.tend.devtools/lib/json-tools.js';

describe('error positions', () => {
  test('reports line and column of a trailing comma', () => {
    const r = parseJson('{\n  "a": 1,\n}');
    expect(r.ok).toBe(false);
    expect(r.error.line).toBe(2);
    expect(r.error.column).toBe(9);
    expect(r.error.message).toContain('Trailing comma');
  });

  test('reports a missing colon with the offending character', () => {
    const r = parseJson('{"a" 1}');
    expect(r.error.message).toContain("Expected ':'");
    expect([r.error.line, r.error.column]).toEqual([1, 6]);
  });

  test('unterminated string points at its opening quote', () => {
    const r = parseJson('["ok", "oops]');
    expect(r.error.message).toBe('Unterminated string');
    expect(r.error.column).toBe(8);
  });

  test('rejects single quotes, comments, NaN and leading zeros', () => {
    for (const bad of ["{'a':1}", '[1,]', '[NaN]', '[01]', '[1 2]', '{"a":1}}', '[1.]', '[.5]', '[-]']) {
      expect(parseJson(bad).ok).toBe(false);
    }
  });

  test('empty input and truncated input', () => {
    expect(parseJson('   ').error.message).toContain('empty');
    expect(parseJson('{"a":').error.message).toContain('end of input');
  });

  test('bad escapes and raw control characters', () => {
    expect(parseJson('"a\\qb"').error.message).toContain('escape');
    expect(parseJson('"\\u12G4"').error.message).toContain('\\u');
    expect(parseJson('"a\tb"').error.message).toContain('control');
  });

  test('deep nesting is refused instead of overflowing the stack', () => {
    const r = parseJson('['.repeat(5000) + ']'.repeat(5000));
    expect(r.ok).toBe(false);
    expect(r.error.message).toContain('too deep');
  });

  test('locate counts lines by line feed', () => {
    expect(locate('a\nbc\r\nd', 6)).toEqual({ line: 3, column: 1 });
    expect(describeError({ line: 3, column: 2, message: 'x' })).toBe('Line 3, column 2: x');
  });
});

describe('format and minify', () => {
  const src = '{"b":[1,2,{"z":true,"a":null}],"a":"x\\u00e9","e":{},"f":[]}';

  test('formats with two spaces by default', () => {
    expect(formatJson(src).text).toBe(
      '{\n  "b": [\n    1,\n    2,\n    {\n      "z": true,\n      "a": null\n    }\n  ],\n  "a": "x\\u00e9",\n  "e": {},\n  "f": []\n}',
    );
  });

  test('tab and four-space indents', () => {
    expect(formatJson('[1]', { indent: 'tab' }).text).toBe('[\n\t1\n]');
    expect(formatJson('[1]', { indent: 4 }).text).toBe('[\n    1\n]');
  });

  test('sorts keys recursively and leaves arrays in order', () => {
    expect(minifyJson(src, { sortKeys: true }).text).toBe('{"a":"x\\u00e9","b":[1,2,{"a":null,"z":true}],"e":{},"f":[]}');
  });

  test('keeps large numbers and exponents exactly as typed', () => {
    expect(minifyJson('[12345678901234567890, 1E+2, -0.50]').text).toBe('[12345678901234567890,1E+2,-0.50]');
  });

  test('minify round-trips through JSON.parse', () => {
    expect(JSON.parse(minifyJson(formatJson(src).text).text)).toEqual(JSON.parse(src));
  });

  test('a failure is returned, not thrown', () => {
    expect(formatJson('{').ok).toBe(false);
    expect(minifyJson('{').ok).toBe(false);
  });
});
