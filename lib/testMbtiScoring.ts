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
  // TEST 5:
  // Дутуу хариулт -> complete false байх ёстой.
  // -----------------------------------------

  const incompleteAnswers = createAnswersForType("INTJ");
  delete incompleteAnswers[1];

  const incompleteResult = scoreMbti(mbtiQuestions, incompleteAnswers);

  if (incompleteResult.complete !== false) {
    errors.push("Incomplete answers should produce complete=false");
  }

  if (!incompleteResult.missingQuestionIds.includes(1)) {
    errors.push("Missing question id 1 was not detected");
  }

  // -----------------------------------------
  // TEST 6:
  // Core tie + borderline strong answer
  // тухайн axis-ийг шийдэх ёстой.
  // -----------------------------------------

  for (const axis of ["EI", "SN", "TF", "JP"] as const) {
    const answers = createAnswersForType("ESTJ");

    const coreQuestions = mbtiQuestions.filter(
      (q) => q.axis === axis && q.role === "core",
    );

    const borderlineQuestion = mbtiQuestions.find(
      (q) => q.axis === axis && q.role === "borderline",
    );

    // Core-ийг бүгд neutral болгоно -> coreScore = 0
    for (const q of coreQuestions) {
      answers[q.id] = 0;
    }

    if (borderlineQuestion) {
      // first-letter тал руу хүчтэй хариулна
      answers[borderlineQuestion.id] = (3 * borderlineQuestion.direction) as
        | -3
        | 3;
    }

    const result = scoreMbti(mbtiQuestions, answers);
    const axisResult = result.axes[axis];

    if (!axisResult.resolvedByBorderline) {
      errors.push(`${axis}: borderline did not resolve core tie`);
    }

    if (axisResult.status !== "borderline_resolved") {
      errors.push(`${axis}: expected borderline_resolved`);
    }
  }

  // -----------------------------------------
  // TEST 7:
  // Core tie + borderline neutral -> unresolved.
  // -----------------------------------------

  const tieAnswers = createAnswersForType("ESTJ");

  for (const q of mbtiQuestions.filter((q) => q.axis === "EI")) {
    tieAnswers[q.id] = 0;
  }

  const tieResult = scoreMbti(mbtiQuestions, tieAnswers);

  if (tieResult.axes.EI.letter !== null) {
    errors.push("EI tie with neutral borderline should remain unresolved");
  }

  if (tieResult.type !== null) {
    errors.push("Unresolved EI axis should prevent final MBTI type");
  }

  // -----------------------------------------
  // TEST 8:
  // Extreme first/second preference percentage.
  // -----------------------------------------

  const extremeAnswers = createAnswersForType("ESTJ");
  const extremeResult = scoreMbti(mbtiQuestions, extremeAnswers);

  for (const axis of ["EI", "SN", "TF", "JP"] as const) {
    if (extremeResult.axes[axis].percent !== 100) {
      errors.push(
        `${axis}: extreme preference should be 100%, received ${extremeResult.axes[axis].percent}%`,
      );
    }
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
