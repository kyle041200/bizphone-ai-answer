import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repositoryPolicy } from './policy.mjs';

test('exact repositories do not implicitly authorize an owner', () => {
  const allows = repositoryPolicy({ KGHQ_ALLOWED_REPOSITORIES: 'Kyle041200/example' });
  assert.equal(allows('kyle041200/EXAMPLE'), true);
  assert.equal(allows('kyle041200/another'), false);
  assert.equal(allows('other/example'), false);
});
test('owner access requires explicit opt-in and matches whole owner names', () => {
  const allows = repositoryPolicy({ KGHQ_ALLOWED_OWNERS: 'kyle041200', KGHQ_ALLOWED_REPOSITORIES: 'GuidoPenta/TrackZilla' });
  assert.equal(allows('https://github.com/Kyle041200/new-project.git'), true);
  assert.equal(allows('GuidoPenta/TrackZilla'), true);
  assert.equal(allows('kyle041200-other/project'), false);
  assert.equal(allows('other/kyle041200'), false);
  assert.throws(() => allows('https://token@github.com/kyle041200/project'));
});
test('empty or malformed policy fails closed', () => {
  assert.throws(() => repositoryPolicy({}));
  for (const owner of ['*', 'kyle041200/*', '../owner', 'https://github.com/owner']) {
    assert.throws(() => repositoryPolicy({ KGHQ_ALLOWED_OWNERS: owner }));
  }
});
