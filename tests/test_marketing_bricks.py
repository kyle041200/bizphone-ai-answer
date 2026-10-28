"""Booklet-matched Brick costs for the eight existing Marketing deliverables."""
import re
import unittest
from pathlib import Path


class MarketingBrickCosts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).parents[1] / "src/routes/marketing.tsx").read_text()
        block = source.split("const popular = [", 1)[1].split("] as const;", 1)[0]
        cls.costs = dict(re.findall(r'title: "([^"]+)".*?bricks: "([^"]+)"', block))

    def test_landing_page(self):
        self.assertEqual(self.costs["Landing Page"], "350")

    def test_downloadable_lead_magnet(self):
        self.assertEqual(self.costs["Lead Magnet"], "250")

    def test_written_and_setup_email_sequence(self):
        self.assertEqual(self.costs["Email Nurture Sequence"], "350")

    def test_signature_social_pack(self):
        self.assertEqual(self.costs["Social Content Pack"], "250")

    def test_ai_article_human_edited(self):
        self.assertEqual(self.costs["SEO Article"], "100")

    def test_closest_profile_setup_match(self):
        self.assertEqual(self.costs["Google Business Profile"], "250")

    def test_brand_refresh(self):
        self.assertEqual(self.costs["Brand Refresh"], "950")

    def test_signature_website(self):
        self.assertEqual(self.costs["Website"], "1,200")

    def test_no_new_deliverables(self):
        self.assertEqual(len(self.costs), 8)


if __name__ == "__main__":
    unittest.main()