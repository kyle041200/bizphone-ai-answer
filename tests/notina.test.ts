import { describe, expect, test } from "bun:test";
import { notinaOffering } from "../src/lib/notina-offering";

describe("Notina Starter pricing", () => {
  test("recurring subscription is $10 per month", () => expect(notinaOffering.monthlyPrice).toBe(10));
  test("one-time setup is $50 per client", () => expect(notinaOffering.setupFee).toBe(50));
  test("signup includes setup and first month for $60", () => expect(notinaOffering.signupTotal).toBe(60));
});