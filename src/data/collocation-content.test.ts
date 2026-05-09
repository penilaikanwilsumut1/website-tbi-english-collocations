import { describe, expect, it } from "vitest";
import {
  collocationEntries,
  contentStats,
  learningPackages,
  testPackages,
  type OptionKey,
} from "./collocation-content";

describe("TBI English Collocations content", () => {
  it("keeps the reviewed MVP content shape", () => {
    expect(contentStats.totalEntries).toBe(600);
    expect(contentStats.totalPackages).toBe(60);
    expect(contentStats.totalQuestions).toBe(600);
    expect(contentStats.patternCounts.adjective_preposition).toBeGreaterThanOrEqual(120);
    expect(contentStats.patternCounts.verb_preposition).toBeGreaterThanOrEqual(140);
    expect(contentStats.patternCounts.noun_preposition).toBeGreaterThanOrEqual(65);
    expect(contentStats.patternCounts.prepositional_phrase).toBeGreaterThanOrEqual(25);
    expect(contentStats.patternCounts.phrasal_verb).toBe(16);
    expect(contentStats.patternCounts.lexical_collocation).toBe(210);
  });

  it("keeps ids, phrases, examples, and evidence fields complete", () => {
    expect(new Set(collocationEntries.map((entry) => entry.id)).size).toBe(600);
    expect(new Set(collocationEntries.map((entry) => entry.fullPhrase)).size).toBe(600);

    for (const entry of collocationEntries) {
      expect(entry.headword).toBeTruthy();
      expect(entry.partner).toBeTruthy();
      expect(entry.fullPhrase).toContain(entry.partner);
      expect(entry.exampleSentence.toLowerCase()).toContain(entry.headword.toLowerCase());
      expect(entry.exampleTranslation).toBeTruthy();
      expect(entry.indonesianMeaning).toBeTruthy();
      expect(entry.usageNote).toContain(entry.fullPhrase);
      expect(entry.commonMistake).toContain(entry.partner);
      expect(entry.claimAllowed).toBe(false);
      expect(entry.sourceName).toBe("Persiapantubel tutor review");
      expect(entry.sourceNote).not.toMatch(/appeared in|pernah keluar/i);
      expect(entry.status).toBe("published");
    }
  });

  it("builds complete neutral packages", () => {
    expect(learningPackages).toHaveLength(60);
    expect(testPackages).toHaveLength(60);
    expect(learningPackages.map((item) => item.order)).toEqual(
      Array.from({ length: 60 }, (_, index) => index + 1),
    );
    expect(learningPackages.flatMap((item) => item.entries)).toHaveLength(600);

    for (const item of learningPackages) {
      expect(item.title).toMatch(/^Collocation Practice \d{2}$/);
      expect(item.entries).toHaveLength(10);
      expect(item.questions).toHaveLength(10);
      expect(item.title).not.toMatch(/\b(of|to|on|in|with|for|from)\b/i);
    }
  });

  it("keeps A-D questions unambiguous and balanced", () => {
    const answerCounts: Record<OptionKey, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    for (const question of testPackages.flatMap((item) => item.questions)) {
      expect(question.options.map((option) => option.key)).toEqual(["A", "B", "C", "D"]);
      expect(new Set(question.options.map((option) => option.text)).size).toBe(4);
      expect(question.options.some((option) => option.key === question.correctKey)).toBe(true);
      expect(question.prompt).toContain("___");
      expect(question.explanation).toContain("Jawaban yang tepat");
      answerCounts[question.correctKey] += 1;
    }

    const counts = Object.values(answerCounts);
    expect(counts.reduce((total, value) => total + value, 0)).toBe(600);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
});
