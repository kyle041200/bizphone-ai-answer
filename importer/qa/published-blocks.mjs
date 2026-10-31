import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { parse, validateBlock, serialize } from '../engine/blocks.mjs';
const input = await fs.readFile(process.argv[2], 'utf8');
const blocks = parse(input);
let count = 0;
const walk = values => {
  for (const block of values) {
    assert.ok(block.name.startsWith('core/'), block.name);
    assert.notEqual(block.name, 'core/html');
    assert.ok(block.isValid, `${block.name}: ${JSON.stringify(validateBlock(block)[1])}`);
    count++;
    walk(block.innerBlocks || []);
  }
};
walk(blocks);
assert.ok(count >= 10, 'Expected meaningful nested native blocks');
const reopened = parse(serialize(blocks));
walk(reopened);
console.log(JSON.stringify({ passed: true, originalBlocks: count / 2, checks: ['native core blocks', 'canonical validation', 'serialize and reopen'] }));
