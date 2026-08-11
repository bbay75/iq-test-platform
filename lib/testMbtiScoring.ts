import { mbtiQuestions } from "@/data/mbtiQuestions";

import { scoreMbti, type MbtiAnswers, type MbtiAxis } from "@/lib/mbtiScoring";

const ALL_TYPES = [
  "ESTJ",
  "ESTP",
  "ESFJ",
  "ESFP",

  "ENTJ",
  "ENTP",
  "ENFJ",
  "ENFP",

  "ISTJ",
  "ISTP",
  "ISFJ",
  "ISFP",

  "INTJ",
  "INTP",
  "INFJ",
  "INFP",
] as const;

const FIRST_LETTERS: Record<MbtiAxis, string> = {
  EI: "E",
  SN: "S",
  TF: "T",
  JP: "J",
};

function createAnswersForType(type: string): MbtiAnswers {
  const answers: MbtiAnswers = {};

  for (const question of mbtiQuestions) {
    const axisIndex =
      question.axis === "EI"
        ? 0
        : question.axis === "SN"
          ? 1
          : question.axis === "TF"
            ? 2
            : 3;

    const desiredLetter = type[axisIndex];

    const wantsFirstSide = desiredLetter === FIRST_LETTERS[question.axis];

    /**
     * score = answer × direction
     *
     * First side хүсвэл positive score
     * Second side хүсвэл negative score
     */
    const targetSign = wantsFirstSide ? 1 : -1;

    const answer = targetSign * question.direction * 3;

    answers[question.id] = answer as -3 | 3;
  }

  return answers;
}

export function runMbtiScoringTests() {
  const errors: string[] = [];

  console.log("==============================");
  console.log("MBTI SCORING TEST START");
  console.log("==============================");

  // -----------------------------------------
  // TEST 1:
  // 16 төрөл бүгд хүрч болох ёстой.
  // -----------------------------------------

  for (const expectedType of ALL_TYPES) {
    const answers = createAnswersForType(expectedType);

    const result = scoreMbti(mbtiQuestions, answers);

    if (result.type !== expectedType) {
      errors.push(
        `${expectedType}: expected ${expectedType}, received ${result.type}`,
      );

      console.error(`❌ ${expectedType}`, result);
    } else {
      console.log(`✅ ${expectedType}`);
    }
  }

  // -----------------------------------------
  // TEST 2:
  // Бүх Neutral -> type гарч болохгүй.
  // -----------------------------------------

  const neutralAnswers: MbtiAnswers = {};

  for (const question of mbtiQuestions) {
    neutralAnswers[question.id] = 0;
  }

  const neutralResult = scoreMbti(mbtiQuestions, neutralAnswers);

  if (neutralResult.type !== null) {
    errors.push(`All-neutral answers produced ${neutralResult.type}`);

    console.error("❌ Neutral test", neutralResult);
  } else {
    console.log("✅ All-neutral produces no fake type");
  }

  // -----------------------------------------
  // TEST 3:
  // Neutral үед 4 axis бүгд unresolved.
  // -----------------------------------------

  if (neutralResult.unresolvedAxes.length !== 4) {
    errors.push(
      `Neutral test should have 4 unresolved axes, found ${neutralResult.unresolvedAxes.length}`,
    );
  }

  // -----------------------------------------
  // TEST 4:
  // Mirror symmetry
  //
  // ESTJ answers-ийн бүх score polarity-г
  // эсрэг болговол INFP гарах ёстой.
  // -----------------------------------------

  const estjAnswers = createAnswersForType("ESTJ");

  const mirroredAnswers: MbtiAnswers = {};

  for (const question of mbtiQuestions) {
    const value = estjAnswers[question.id];

    if (value !== undefined) {
      mirroredAnswers[question.id] = -value as -3 | -2 | -1 | 0 | 1 | 2 | 3;
    }
  }

  const mirroredResult = scoreMbti(mbtiQuestions, mirroredAnswers);

  if (mirroredResult.type !== "INFP") {
    errors.push(
      `Mirror symmetry expected INFP, received ${mirroredResult.type}`,
    );

    console.error("❌ Mirror symmetry", mirroredResult);
  } else {
    console.log("✅ Mirror symmetry: ESTJ ↔ INFP");
  }

  // -----------------------------------------
  // FINAL
  // -----------------------------------------

  console.log("==============================");

  if (errors.length === 0) {
    console.log("✅ ALL MBTI SCORING TESTS PASSED");

    console.log("✅ All 16 types are reachable");

    console.log("✅ No neutral-answer default type");

    console.log("✅ Opposite answers produce opposite type");

    return {
      passed: true,
      errors: [],
    };
  }

  console.error("❌ MBTI SCORING TEST FAILED");

  console.error(errors);

  return {
    passed: false,
    errors,
  };
}
