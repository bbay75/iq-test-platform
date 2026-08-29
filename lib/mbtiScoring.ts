export const MBTI_AXES = ["EI", "SN", "TF", "JP"] as const;

export type MbtiAxis = (typeof MBTI_AXES)[number];

export type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiDirection = 1 | -1;

export type MbtiAnswerValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type MbtiQuestionRole = "core" | "borderline";

export type MbtiScoringQuestion = {
  id: number;
  axis: MbtiAxis;
  direction: MbtiDirection;
  role: MbtiQuestionRole;
};

export type MbtiAnswers = Record<number, MbtiAnswerValue | undefined>;

export type MbtiAxisStatus =
  | "resolved"
  | "borderline_resolved"
  | "tie"
  | "incomplete";

export type MbtiAxisResult = {
  axis: MbtiAxis;

  firstLetter: MbtiLetter;
  secondLetter: MbtiLetter;

  /**
   * Ялагч үсэг.
   * Шийдэгдээгүй үед null.
   */
  letter: MbtiLetter | null;

  /**
   * Core 11 асуултын нийлбэр.
   */
  coreScore: number;

  /**
   * Core асуултуудаас авах боломжтой
   * хамгийн их absolute score.
   *
   * 11 × 3 = 33
   */
  coreMaxScore: number;

  /**
   * Core score яг 0 үед ашигласан borderline item-ийн score.
   * Ердийн үед 0.
   */
  borderlineScore: number;

  /**
   * Жишээ:
   * E 32%
   * I 68%
   */
  firstPercent: number;
  secondPercent: number;

  /**
   * Гарсан үсгийн хувь.
   *
   * I гарсан + I 68% бол 68.
   */
  percent: number;

  /**
   * Төвөөс хэр хүчтэй хазайсныг 0–100.
   *
   * 0 = яг 50/50
   * 100 = maximum preference
   */
  strengthPercent: number;

  answeredCore: number;
  neutralCore: number;

  /**
   * Core score яг 0 үед borderline item шийдсэн эсэх.
   */
  resolvedByBorderline: boolean;

  status: MbtiAxisStatus;
};

export type MbtiScoreResult = {
  /**
   * Жишээ:
   * INTJ
   *
   * Бүх 4 axis шийдэгдээгүй бол null.
   */
  type: string | null;

  axes: Record<MbtiAxis, MbtiAxisResult>;

  /**
   * 48 асуултад бүгдэд нь хариулсан эсэх.
   */
  complete: boolean;

  unresolvedAxes: MbtiAxis[];

  missingQuestionIds: number[];
};

const AXIS_LETTERS: Record<
  MbtiAxis,
  {
    first: MbtiLetter;
    second: MbtiLetter;
  }
> = {
  EI: {
    first: "E",
    second: "I",
  },

  SN: {
    first: "S",
    second: "N",
  },

  TF: {
    first: "T",
    second: "F",
  },

  JP: {
    first: "J",
    second: "P",
  },
};

function isMbtiAnswerValue(value: unknown): value is MbtiAnswerValue {
  return (
    value === -3 ||
    value === -2 ||
    value === -1 ||
    value === 0 ||
    value === 1 ||
    value === 2 ||
    value === 3
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function calculateCorePercent(score: number, maxScore: number) {
  if (maxScore === 0) {
    return {
      firstPercent: 50,
      secondPercent: 50,
    };
  }

  /**
   * score = 0   -> 50 / 50
   * score = max -> 100 / 0
   * score = -max -> 0 / 100
   */
  const first = 50 + (score / maxScore) * 50;

  const firstPercent = Math.round(clampPercent(first));

  return {
    firstPercent,
    secondPercent: 100 - firstPercent,
  };
}

function buildAxisResult(
  axis: MbtiAxis,
  questions: MbtiScoringQuestion[],
  answers: MbtiAnswers,
): MbtiAxisResult {
  const { first, second } = AXIS_LETTERS[axis];

  const coreQuestions = questions.filter(
    (question) => question.axis === axis && question.role === "core",
  );

  const borderlineQuestion = questions.find(
    (question) => question.axis === axis && question.role === "borderline",
  );

  let coreScore = 0;
  let answeredCore = 0;
  let neutralCore = 0;

  for (const question of coreQuestions) {
    const answer = answers[question.id];

    if (!isMbtiAnswerValue(answer)) {
      continue;
    }

    answeredCore += 1;

    if (answer === 0) {
      neutralCore += 1;
    }

    coreScore += answer * question.direction;
  }

  /**
   * Blueprint зөв үед:
   *
   * 11 core × max 3 = 33
   */
  const coreMaxScore = coreQuestions.length * 3;

  let letter: MbtiLetter | null = null;

  let status: MbtiAxisStatus = "tie";

  let borderlineScore = 0;

  let resolvedByBorderline = false;

  /**
   * Core асуултууд дутуу бол
   * type эцэслэхгүй.
   */
  if (answeredCore !== coreQuestions.length) {
    status = "incomplete";
  } else if (coreScore > 0) {
    letter = first;
    status = "resolved";
  } else if (coreScore < 0) {
    letter = second;
    status = "resolved";
  } else {
    /**
     * Core яг 0 болсон үед л
     * borderline асуултыг харна.
     */
    if (borderlineQuestion) {
      const borderlineAnswer = answers[borderlineQuestion.id];

      if (isMbtiAnswerValue(borderlineAnswer) && borderlineAnswer !== 0) {
        borderlineScore = borderlineAnswer * borderlineQuestion.direction;

        if (borderlineScore > 0) {
          letter = first;
        } else {
          letter = second;
        }

        resolvedByBorderline = true;
        status = "borderline_resolved";
      }
    }
  }

  let { firstPercent, secondPercent } = calculateCorePercent(
    coreScore,
    coreMaxScore,
  );

  /**
   * Core score яг 0 боловч
   * borderline item шийдсэн бол
   * 50/50 дээр жижигхэн бодит хөдөлгөөн өгнө.
   *
   * Borderline item max ±3,
   * нийт theoretical axis max = 36
   *
 +1 → ойролцоогоор 51%
+2 → ойролцоогоор 53%
+3 → ойролцоогоор 54%
   *
   * Ингэснээр ганц tie item
   * 60%, 70% гэх мэт хэт хүчтэй
   * preference үүсгэхгүй.
   */
  if (coreScore === 0 && resolvedByBorderline) {
    const totalPotential = coreMaxScore + 3;

    const first = 50 + (borderlineScore / totalPotential) * 50;

    firstPercent = Math.round(clampPercent(first));

    secondPercent = 100 - firstPercent;
  }

  const strengthPercent =
    coreMaxScore === 0
      ? 0
      : Math.round((Math.abs(coreScore) / coreMaxScore) * 100);

  let percent = 50;

  if (letter === first) {
    percent = firstPercent;
  }

  if (letter === second) {
    percent = secondPercent;
  }

  return {
    axis,

    firstLetter: first,
    secondLetter: second,

    letter,

    coreScore,
    coreMaxScore,

    borderlineScore,

    firstPercent,
    secondPercent,

    percent,
    strengthPercent,

    answeredCore,
    neutralCore,

    resolvedByBorderline,

    status,
  };
}

/**
 * ============================================================
 * MAIN SCORING FUNCTION
 * ============================================================
 *
 * 48 хариултаас:
 *
 * EI
 * SN
 * TF
 * JP
 *
 * дөрвөн axis-ийг бодно.
 */
export function scoreMbti(
  questions: MbtiScoringQuestion[],
  answers: MbtiAnswers,
): MbtiScoreResult {
  const missingQuestionIds: number[] = [];

  for (const question of questions) {
    const answer = answers[question.id];

    if (!isMbtiAnswerValue(answer)) {
      missingQuestionIds.push(question.id);
    }
  }

  const axes = {} as Record<MbtiAxis, MbtiAxisResult>;

  for (const axis of MBTI_AXES) {
    axes[axis] = buildAxisResult(axis, questions, answers);
  }

  const complete = missingQuestionIds.length === 0;

  const unresolvedAxes = MBTI_AXES.filter((axis) => {
    const status = axes[axis].status;

    return status !== "resolved" && status !== "borderline_resolved";
  });

  /**
   * Бүх асуулт хариулагдсан +
   * 4 axis бүгд шийдэгдсэн үед л
   * 4-letter type үүсгэнэ.
   */
  const type =
    complete && unresolvedAxes.length === 0
      ? MBTI_AXES.map((axis) => axes[axis].letter).join("")
      : null;

  return {
    type,
    axes,
    complete,
    unresolvedAxes,
    missingQuestionIds,
  };
}

/**
 * ============================================================
 * QUESTION BLUEPRINT VALIDATOR
 * ============================================================
 *
 * Development үед 48-question data (11 core + 1 borderline / axis)
 * санамсаргүй эвдэрсэн эсэхийг шалгана.
 */
export function validateMbtiBlueprint(questions: MbtiScoringQuestion[]) {
  const errors: string[] = [];

  const ids = new Set<number>();

  const stats: Record<
    MbtiAxis,
    {
      core: number;
      positiveCore: number;
      negativeCore: number;
      borderline: number;
    }
  > = {
    EI: {
      core: 0,
      positiveCore: 0,
      negativeCore: 0,
      borderline: 0,
    },

    SN: {
      core: 0,
      positiveCore: 0,
      negativeCore: 0,
      borderline: 0,
    },

    TF: {
      core: 0,
      positiveCore: 0,
      negativeCore: 0,
      borderline: 0,
    },

    JP: {
      core: 0,
      positiveCore: 0,
      negativeCore: 0,
      borderline: 0,
    },
  };

  for (const question of questions) {
    if (ids.has(question.id)) {
      errors.push(`Duplicate question id: ${question.id}`);
    }

    ids.add(question.id);

    const axisStats = stats[question.axis];

    if (question.role === "core") {
      axisStats.core += 1;

      if (question.direction === 1) {
        axisStats.positiveCore += 1;
      } else {
        axisStats.negativeCore += 1;
      }
    } else {
      axisStats.borderline += 1;
    }
  }

  if (questions.length !== 48) {
    errors.push(`Expected 48 questions, found ${questions.length}.`);
  }

  for (const axis of MBTI_AXES) {
    const stat = stats[axis];

    if (stat.core !== 11) {
      errors.push(`${axis}: expected 11 core questions, found ${stat.core}.`);
    }

    // 11 core item учраас direction яг 50/50 болох боломжгүй.
    // Тиймээс нэг тал 6, нөгөө тал 5 байхыг зөвшөөрнө.
    const directionBalanced =
      (stat.positiveCore === 6 && stat.negativeCore === 5) ||
      (stat.positiveCore === 5 && stat.negativeCore === 6);

    if (!directionBalanced) {
      errors.push(
        `${axis}: expected core direction balance 6/5 or 5/6, found ${stat.positiveCore}/${stat.negativeCore}.`,
      );
    }

    if (stat.borderline !== 1) {
      errors.push(
        `${axis}: expected 1 borderline question, found ${stat.borderline}.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats,
  };
}
