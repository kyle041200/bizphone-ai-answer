import { describe, expect, test } from "bun:test";
import { articles, filterArticles } from "../src/lib/articles";

describe("Article category rules from the supplied references", () => {
  test("All and Entrepreneurship include all nine articles", () => {
    expect(filterArticles("All", "")).toHaveLength(9);
    expect(filterArticles("Entrepreneurship", "")).toHaveLength(9);
  });
  test("Leadership includes only the strategic planning article", () => {
    expect(filterArticles("Leadership", "").map(article => article.slug)).toEqual(["strategic-planning-before-scaling"]);
  });
  test("Mindset includes the four tagged articles", () => {
    expect(filterArticles("Mindset", "").map(article => article.slug)).toEqual(["strategic-planning-before-scaling", "digital-marketing-tactics-small-business", "evolution-of-growth-services", "outsourcing-helps-entrepreneurs"]);
  });
  test("Sales includes the marketing conversions article", () => {
    expect(filterArticles("Sales", "").map(article => article.slug)).toEqual(["digital-marketing-tactics-small-business"]);
  });
  test("Technology includes the virtual assistant article", () => {
    expect(filterArticles("Technology", "").map(article => article.slug)).toEqual(["future-of-virtual-assistant-services"]);
  });
  test("Search intersects with the selected category", () => {
    expect(filterArticles("Technology", "AI")).toHaveLength(1);
    expect(filterArticles("Leadership", "AI")).toHaveLength(0);
    expect(filterArticles("All", "appointment setting").map(article => article.slug)).toEqual(["appointment-setting-guide"]);
    expect(new Set(articles.map(article => article.slug)).size).toBe(9);
  });
});