"""Exact booklet catalog coverage and Brick amounts, including scope-priced ranges."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
CATALOG = json.loads((ROOT / "src/data/deliverables.json").read_text())
EXPECTED = json.loads((ROOT / "tests/booklet_brick_costs.json").read_text())


class DeliverablesLibrary(unittest.TestCase):
    def test_all_booklet_deliverables_are_included(self):
        self.assertEqual(len(CATALOG), 174)
        self.assertEqual({d["id"] for d in CATALOG}, {d["id"] for d in EXPECTED})

    def test_every_deliverable_has_a_distinct_photo(self):
        self.assertEqual(len({d["image"] for d in CATALOG}), 174)
        for d in CATALOG:
            with self.subTest(deliverable=d["title"]):
                self.assertTrue((ROOT / "src/assets/library" / (d["image"] + ".jpg")).is_file())

    def test_booklet_category_coverage(self):
        self.assertEqual({c: sum(d["category"] == c for d in CATALOG) for c in ["Marketing", "Business Support", "Sales"]}, {"Marketing": 77, "Business Support": 77, "Sales": 20})

    def test_all_twelve_variable_price_ranges_are_preserved(self):
        self.assertEqual(sum(d["bricksMin"] != d["bricksMax"] for d in CATALOG), 12)


def cost_test(expected):
    def test(self):
        actual = next(d for d in CATALOG if d["id"] == expected["id"])
        self.assertEqual(actual["bricksMin"], expected["min"])
        self.assertEqual(actual["bricksMax"], expected["max"])
    return test


for item in EXPECTED:
    setattr(DeliverablesLibrary, "test_booklet_bricks_" + item["id"].replace("-", "_"), cost_test(item))

if __name__ == "__main__":
    unittest.main()