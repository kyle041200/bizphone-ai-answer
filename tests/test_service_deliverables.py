"""Service preview selections preserve the matching booklet scopes and prices."""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
CATALOG = {d['id']: d for d in json.loads((ROOT / 'src/data/deliverables.json').read_text())}
MODULE = (ROOT / 'src/lib/deliverables-catalog.ts').read_text()
EXPECTED = {
    'salesFeaturedIds': [('deliverable-155', 250, 250), ('deliverable-157', 750, 750), ('deliverable-162', 250, 250), ('deliverable-158', 1500, 1500), ('deliverable-170', 500, 500), ('deliverable-167', 350, 350), ('deliverable-169', 350, 350), ('deliverable-161', 750, 750)],
    'supportFeaturedIds': [('deliverable-083', 40, 40), ('deliverable-080', 100, 100), ('deliverable-082', 10, 10), ('deliverable-087', 25, 25), ('deliverable-090', 10, 10), ('deliverable-105', 25, 25), ('deliverable-129', 150, 300), ('deliverable-118', 550, 5000)],
}


class ServiceDeliverables(unittest.TestCase):
    pass


def scope_test(selection, index, expected):
    def test(self):
        match = re.search(r'export const ' + selection + r' = \[(.*?)\];', MODULE)
        self.assertIsNotNone(match)
        ids = re.findall(r'"([^"]+)"', match.group(1))
        self.assertEqual(len(ids), 8)
        self.assertEqual(ids[index], expected[0])
        actual = CATALOG[ids[index]]
        self.assertEqual((actual['bricksMin'], actual['bricksMax']), expected[1:])
    return test


for selection, items in EXPECTED.items():
    for index, expected in enumerate(items):
        setattr(ServiceDeliverables, 'test_' + selection + '_' + expected[0].replace('-', '_'), scope_test(selection, index, expected))


if __name__ == '__main__':
    unittest.main()