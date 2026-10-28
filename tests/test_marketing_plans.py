"""Booklet-matched monthly plans on the Marketing page (prices and Bricks amounts)."""
import re
import unittest
from pathlib import Path


class MarketingPlanBricks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).parents[1] / "src/routes/marketing.tsx").read_text()
        block = source.split("const plans = [", 1)[1].split("\n];", 1)[0]
        plans = re.findall(r'name: "([^"]+)", price: "([^"]+)", bricks: "([^"]+)"', block)
        cls.plans = {name: (price, bricks) for name, price, bricks in plans}

    def test_lite(self):
        self.assertEqual(self.plans["Lite"], ("$250", "250"))

    def test_starter(self):
        self.assertEqual(self.plans["Starter"], ("$650", "700"))

    def test_growth(self):
        self.assertEqual(self.plans["Growth"], ("$1,250", "1,500"))

    def test_scale(self):
        self.assertEqual(self.plans["Scale"], ("$2,250", "3,000"))

    def test_no_old_token_amounts_left(self):
        self.assertNotIn('tokens: "', (Path(__file__).parents[1] / "src/routes/marketing.tsx").read_text())


if __name__ == "__main__":
    unittest.main()
