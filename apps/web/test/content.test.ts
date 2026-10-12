import test from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, validateAttachment, cmsClient } from '../src/lib/content';

test('project links reject executable and non-web protocols', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd']) {
    assert.throws(() => safeUrl(value));
  }
  assert.equal(safeUrl('https://kurlydeer.com'), 'https://kurlydeer.com/');
  assert.equal(safeUrl(''), '');
});
test('uploads enforce type, empty-file and size limits', () => {
  assert.throws(() => validateAttachment({ size: 10, type: 'image/svg+xml' }));
  assert.throws(() => validateAttachment({ size: 0, type: 'image/png' }));
  assert.throws(() => validateAttachment({ size: 5242881, type: 'application/pdf' }));
  assert.doesNotThrow(() => validateAttachment({ size: 5242880, type: 'application/pdf' }));
});
test('missing CMS configuration fails closed', () => {
  assert.throws(cmsClient, /not configured/);
});
