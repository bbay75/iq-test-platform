export function getMbtiPercentDescription(
  firstLetter: string,
  secondLetter: string,
  firstLabel: string,
  secondLabel: string,
  firstPercent: number,
  secondPercent: number,
  lang: "mn" | "en",
) {
  const dominantFirst = firstPercent >= secondPercent;

  const dominantLetter = dominantFirst ? firstLetter : secondLetter;
  const dominantLabel = dominantFirst ? firstLabel : secondLabel;
  const oppositeLabel = dominantFirst ? secondLabel : firstLabel;

  const dominantPercent = Math.max(firstPercent, secondPercent);

  if (lang === "en") {
    let strengthText = "";

    if (dominantPercent <= 55) {
      strengthText = "the two sides are nearly balanced";
    } else if (dominantPercent <= 65) {
      strengthText = `${dominantLabel} has a slight preference`;
    } else if (dominantPercent <= 75) {
      strengthText = `${dominantLabel} is clearly preferred`;
    } else if (dominantPercent <= 85) {
      strengthText = `${dominantLabel} is strongly preferred`;
    } else {
      strengthText = `${dominantLabel} is very strongly preferred`;
    }

    return {
      dominantLetter,
      dominantLabel,
      dominantPercent,
      text:
        dominantPercent <= 55
          ? `Your ${firstLabel.toLowerCase()} and ${secondLabel.toLowerCase()} preferences are close to balanced. You may use either style depending on the situation.`
          : `For you, ${strengthText}. This does not mean your ${oppositeLabel.toLowerCase()} side is absent — you can still use that style when the situation calls for it.`,
    };
  }

  let strengthText = "";

  if (dominantPercent <= 55) {
    strengthText = "хоёр тал бараг тэнцвэртэй";
  } else if (dominantPercent <= 65) {
    strengthText = `${dominantLabel} тал бага зэрэг давамгай`;
  } else if (dominantPercent <= 75) {
    strengthText = `${dominantLabel} чиглэл тодорхой давамгай`;
  } else if (dominantPercent <= 85) {
    strengthText = `${dominantLabel} чиглэл хүчтэй давамгай`;
  } else {
    strengthText = `${dominantLabel} чиглэл маш хүчтэй давамгай`;
  }

  return {
    dominantLetter,
    dominantLabel,
    dominantPercent,
    text:
      dominantPercent <= 55
        ? `Таны ${firstLabel.toLowerCase()} болон ${secondLabel.toLowerCase()} талууд ойролцоо байна. Нөхцөл байдлаас шалтгаалан аль алиныг нь ашиглах хандлагатай.`
        : `Таны хувьд ${strengthText}. Гэхдээ ${oppositeLabel.toLowerCase()} тал бүрэн байхгүй гэсэн үг биш — шаардлагатай үед энэ хэв маягийг мөн ашиглаж чадна.`,
  };
}

export function getMbtiCombinedProfile(
  type: string,
  axes: any,
  lang: "mn" | "en",
) {
  if (!axes) {
    return null;
  }

  const axisList = [
    {
      key: "EI",
      first: "E",
      second: "I",
      firstMn: "гадаад орчин, хүмүүстэй харилцах",
      secondMn: "дотоод бодол, өөрийн орон зай",
      firstEn: "the outer world and interaction",
      secondEn: "inner reflection and personal space",
    },
    {
      key: "SN",
      first: "S",
      second: "N",
      firstMn: "бодит баримт, одоогийн нөхцөл",
      secondMn: "боломж, холбоо, ерөнхий зураг",
      firstEn: "facts and present realities",
      secondEn: "possibilities and the bigger picture",
    },
    {
      key: "TF",
      first: "T",
      second: "F",
      firstMn: "логик, бодит үндэслэл",
      secondMn: "хүний мэдрэмж, үнэ цэнэ",
      firstEn: "logic and objective reasoning",
      secondEn: "feelings and personal values",
    },
    {
      key: "JP",
      first: "J",
      second: "P",
      firstMn: "төлөвлөгөө, тодорхой бүтэц",
      secondMn: "уян хатан байдал, нөхцөлдөө зохицох",
      firstEn: "planning and structure",
      secondEn: "flexibility and adaptability",
    },
  ];

  const details = axisList.map((item) => {
    const axis = axes[item.key];

    const firstPercent = Math.round(axis?.firstPercent ?? 50);
    const secondPercent = Math.round(axis?.secondPercent ?? 50);

    const firstWins = firstPercent >= secondPercent;

    return {
      key: item.key,
      letter: firstWins ? item.first : item.second,
      percent: firstWins ? firstPercent : secondPercent,
      label:
        lang === "en"
          ? firstWins
            ? item.firstEn
            : item.secondEn
          : firstWins
            ? item.firstMn
            : item.secondMn,
      difference: Math.abs(firstPercent - secondPercent),
    };
  });

  const strongest = [...details].sort((a, b) => b.percent - a.percent)[0];

  const mostBalanced = [...details].sort(
    (a, b) => a.difference - b.difference,
  )[0];

  if (lang === "en") {
    return {
      intro: `Your ${type} result is not based only on four letters. Your percentages show how strongly each preference appears and where you are more balanced.`,
      combined: `Taken together, your answers suggest that you tend to rely more on ${details[0].label}, ${details[1].label}, ${details[2].label}, and ${details[3].label}. This combination shapes how you interact, notice information, make decisions, and respond to changing situations.`,
      strongest: `Your clearest preference is ${strongest.letter} at ${strongest.percent}%. This is likely to be one of the more noticeable parts of your everyday behavior.`,
      balanced:
        mostBalanced.percent <= 55
          ? `Your ${mostBalanced.key} dimension is almost balanced. This means you may switch between both sides depending on the situation rather than behaving in only one fixed way.`
          : `Your most balanced dimension is ${mostBalanced.key}. Compared with your other preferences, you are more flexible between both sides here.`,
    };
  }

  return {
    intro: `Таны ${type} үр дүнг зөвхөн 4 үсгээр ойлгох нь хангалтгүй. Хувийн харьцаа нь аль шинж танд илүү тод, аль хэсэг нь илүү тэнцвэртэй байгааг харуулна.`,

    combined: `Таны 4 чиглэлийг хамтад нь харахад та ${details[0].label}, ${details[1].label}, ${details[2].label}, мөн ${details[3].label}-д илүү түшиглэх хандлагатай байна. Эдгээр нь нийлээд таны хүмүүстэй харилцах, мэдээлэл хүлээн авах, шийдвэр гаргах болон нөхцөлд хандах хэв маягийг бүрдүүлдэг.`,

    strongest: `Таны хамгийн тод ялгарсан чиглэл бол ${strongest.letter} — ${strongest.percent}%. Энэ тал таны өдөр тутмын зан үйлд бусдаасаа илүү мэдэгдэх магадлалтай.`,

    balanced:
      mostBalanced.percent <= 55
        ? `Харин ${mostBalanced.key} чиглэл бараг тэнцвэртэй байна. Тиймээс энэ тал дээр та нэг хэв маягт баригдахаас илүү нөхцөлөөс шалтгаалан хоёр талыг хоёуланг нь ашиглаж чадна.`
        : `Таны хамгийн тэнцвэртэй чиглэл нь ${mostBalanced.key}. Бусад чиглэлтэй харьцуулахад энэ хэсэгт хоёр талын хооронд илүү уян хатан шилжих боломжтой.`,
  };
}

const mbtiTraitGroups = {
  socialConfidence: {
    letter: "E",
    facets: [
      "social_energy",
      "social_initiation",
      "verbal_processing",
      "social_breadth",
      "stimulation",
      "group_expression",
      "collaboration",
    ],
  },

  independentFocus: {
    letter: "I",
    facets: [
      "recovery",
      "internal_processing",
      "social_observation",
      "relationship_depth",
      "focus_environment",
      "social_recovery",
      "personal_space",
    ],
  },

  practicalThinking: {
    letter: "S",
    facets: [
      "evidence",
      "concrete_learning",
      "present_reality",
      "detail_attention",
      "proven_methods",
      "practical_application",
      "precision",
    ],
  },

  possibilityThinking: {
    letter: "N",
    facets: [
      "possibilities",
      "patterns",
      "abstraction",
      "hidden_connections",
      "future_projection",
      "novelty",
      "symbolism",
    ],
  },

  logicalDecision: {
    letter: "T",
    facets: [
      "logic",
      "consistency",
      "directness",
      "principle",
      "efficiency",
      "argument_analysis",
      "objectivity",
    ],
  },

  peopleAwareness: {
    letter: "F",
    facets: [
      "people_impact",
      "personal_context",
      "tact",
      "empathy",
      "harmony",
      "emotional_support",
      "human_values",
    ],
  },

  structuredAction: {
    letter: "J",
    facets: [
      "planning",
      "closure",
      "preparation",
      "scheduling",
      "completion",
      "routine",
      "decisiveness",
    ],
  },

  adaptability: {
    letter: "P",
    facets: [
      "openness",
      "adaptability",
      "experimentation",
      "exploration",
      "variety",
      "spontaneity",
      "flexibility",
    ],
  },
} as const;

export function getMbtiTraitScores(answers: any[]) {
  const coreAnswers = answers.filter(
    (answer) =>
      answer?.role === "core" &&
      typeof answer?.value === "number" &&
      typeof answer?.direction === "number" &&
      typeof answer?.facet === "string",
  );

  const secondLetters = new Set(["I", "N", "F", "P"]);

  return Object.entries(mbtiTraitGroups).map(([key, group]) => {
    const matched = coreAnswers.filter((answer) =>
      (group.facets as readonly string[]).includes(answer.facet),
    );

    if (!matched.length) {
      return {
        key,
        letter: group.letter,
        score: 0,
        percent: 50,
        count: 0,
      };
    }

    /*
     * answer.value * direction:
     *   + = axis-ийн эхний тал
     *   - = axis-ийн хоёр дахь тал
     *
     * Харин trait өөрөө I/N/F/P тал бол
     * тэмдгийг дахин эргүүлнэ.
     */
    const traitSign = secondLetters.has(group.letter) ? -1 : 1;

    const total = matched.reduce((sum, answer) => {
      const axisScore = answer.value * answer.direction;

      const traitScore = axisScore * traitSign;

      return sum + traitScore;
    }, 0);

    const maxScore = matched.length * 3;

    const normalized = maxScore > 0 ? total / maxScore : 0;

    /*
     * -1 = 0%
     *  0 = 50%
     * +1 = 100%
     */
    const percent = Math.round(50 + normalized * 50);

    return {
      key,
      letter: group.letter,
      score: total,
      percent: Math.max(0, Math.min(100, percent)),
      count: matched.length,
    };
  });
}

export function getPreferencePercent(letter: string, axes: any) {
  if (!axes) return 50;

  switch (letter) {
    case "E":
      return Math.round(axes.EI?.firstPercent ?? 50);
    case "I":
      return Math.round(axes.EI?.secondPercent ?? 50);

    case "S":
      return Math.round(axes.SN?.firstPercent ?? 50);
    case "N":
      return Math.round(axes.SN?.secondPercent ?? 50);

    case "T":
      return Math.round(axes.TF?.firstPercent ?? 50);
    case "F":
      return Math.round(axes.TF?.secondPercent ?? 50);

    case "J":
      return Math.round(axes.JP?.firstPercent ?? 50);
    case "P":
      return Math.round(axes.JP?.secondPercent ?? 50);

    default:
      return 50;
  }
}

export function getPreferenceLevel(percent: number, lang: "mn" | "en") {
  if (percent >= 86) {
    return lang === "en" ? "Very strong" : "Маш хүчтэй";
  }

  if (percent >= 76) {
    return lang === "en" ? "Strong" : "Хүчтэй";
  }

  if (percent >= 66) {
    return lang === "en" ? "Clear" : "Тод";
  }

  if (percent >= 56) {
    return lang === "en" ? "Slight preference" : "Бага зэрэг давамгай";
  }

  return lang === "en" ? "Nearly balanced" : "Бараг тэнцвэртэй";
}

export function getStrengthDescription(
  baseText: string,
  percent: number,
  lang: "mn" | "en",
) {
  if (percent >= 76) {
    return baseText;
  }

  if (percent >= 66) {
    return baseText;
  }

  if (percent >= 56) {
    return lang === "en"
      ? `This tendency appears in your answers, although it is not one of your strongest preferences. ${baseText}`
      : `Энэ хандлага таны хариултад ажиглагдаж байгаа ч маш хүчтэй давамгай биш. ${baseText}`;
  }

  return lang === "en"
    ? `This area is relatively balanced for you. You may show this tendency in some situations while using the opposite style in others.`
    : `Энэ чиглэл таны хувьд бараг тэнцвэртэй. Нөхцөлөөс шалтгаалан энэ хэв маяг болон эсрэг талыг хоёуланг нь ашиглах боломжтой.`;
}

export function getRiskDescription(
  baseText: string,
  percent: number,
  lang: "mn" | "en",
) {
  if (percent >= 76) {
    return baseText;
  }

  if (percent >= 66) {
    return lang === "en"
      ? `When this tendency becomes stronger, ${baseText.charAt(0).toLowerCase() + baseText.slice(1)}`
      : `Энэ хандлага хүчтэй илрэх үед ${baseText}`;
  }

  if (percent >= 56) {
    return lang === "en"
      ? `This is a mild tendency, so the following risk may appear mainly in certain situations: ${baseText}`
      : `Энэ тал бага зэрэг давамгай тул дараах эрсдэл зөвхөн зарим нөхцөлд илэрч болно: ${baseText}`;
  }

  return lang === "en"
    ? "Because this dimension is nearly balanced, this is not a strong risk for you. The opposite style may naturally balance it."
    : "Энэ чиглэл бараг тэнцвэртэй тул үүнийг таны хүчтэй эрсдэл гэж үзэхгүй. Эсрэг хэв маяг нь шаардлагатай үед тэнцвэржүүлэх боломжтой.";
}
export const mbtiTraitContent = {
  socialConfidence: {
    mn: {
      title: "Нийгмийн идэвх ба санаачилга",
      strength:
        "Хүмүүстэй хурдан холбогдож, яриа болон хамтын ажиллагааг өөрөө эхлүүлэх нь танд харьцангуй амар.",
      risk: "Идэвхтэй оролцох хүсэл хүчтэй үед бусдад бодох, өөрийн хэмнэлээр оролцох зай үлдээхээ анзаарах хэрэгтэй.",
    },
    en: {
      title: "Social confidence",
      strength:
        "You tend to connect with people readily and take initiative in interaction and collaboration.",
      risk: "When your social energy is strong, remember to leave room for others to participate at their own pace.",
    },
  },

  independentFocus: {
    mn: {
      title: "Бие даан төвлөрөх чадвар",
      strength:
        "Та өөрийн орон зайд бодлоо цэгцэлж, тасалдал багатай үед удаан төвлөрөх чадвараа сайн ашигладаг.",
      risk: "Бие даан ажиллах нь хэт давамгайлах үед хэрэгтэй санал, тусламжийг бусдаас авахгүй удах эрсдэлтэй.",
    },
    en: {
      title: "Independent focus",
      strength:
        "You tend to think clearly in your own space and can make good use of uninterrupted concentration.",
      risk: "Strong independence can sometimes make it easy to delay asking for useful input or support.",
    },
  },

  practicalThinking: {
    mn: {
      title: "Бодитой, практик сэтгэлгээ",
      strength:
        "Баримт, тодорхой мэдээлэл болон бодитоор хэрэгжих боломжийг анзаарах нь таны хүчтэй тал.",
      risk: "Практик байдлыг хэт түрүүнд тавих үед шинэ боловч хараахан батлагдаагүй боломжийг эрт орхих магадлалтай.",
    },
    en: {
      title: "Practical thinking",
      strength:
        "You tend to notice concrete information, practical limits, and what can realistically be implemented.",
      risk: "A strong practical focus can sometimes make untested possibilities look less valuable than they really are.",
    },
  },

  possibilityThinking: {
    mn: {
      title: "Шинэ боломж олж харах",
      strength:
        "Та одоогийн нөхцөлөөс цааш харж, холбоо, шинэ санаа болон ирээдүйн боломжийг анзаарах хандлагатай.",
      risk: "Олон боломж зэрэг харагдах үед бодит хэрэгжилт, жижиг деталиудыг орхигдуулахгүй байх нь чухал.",
    },
    en: {
      title: "Possibility thinking",
      strength:
        "You tend to notice connections, new ideas, and possibilities beyond the immediate situation.",
      risk: "When many possibilities appear at once, practical details and execution can require extra attention.",
    },
  },

  logicalDecision: {
    mn: {
      title: "Логик шийдвэр гаргалт",
      strength:
        "Та асуудлыг зарчим, үндэслэл, үр ашиг талаас нь салгаж хараад шийдвэр гаргахдаа сайн.",
      risk: "Логик зөв байсан ч шийдвэр бусдад хэрхэн хүрэхийг үл тоомсорловол таны санаа хэт хатуу сонсогдож болно.",
    },
    en: {
      title: "Logical decision-making",
      strength:
        "You tend to separate the issue from emotion and evaluate decisions through logic, consistency, and effectiveness.",
      risk: "Even a sound decision can land poorly if its effect on people is not considered.",
    },
  },

  peopleAwareness: {
    mn: {
      title: "Хүний мэдрэмжийг анзаарах",
      strength:
        "Шийдвэр болон харилцаанд бусдын нөхцөл, мэдрэмж, үнэ цэнийг харгалзах нь танд чухал.",
      risk: "Бусдын мэдрэмжийг хэт их бодох үед өөрийн байр сууриа тодорхой хэлэх эсвэл хэцүү шийдвэр гаргах нь удааширч болно.",
    },
    en: {
      title: "People awareness",
      strength:
        "You tend to notice personal context, feelings, and human impact when dealing with people.",
      risk: "Giving too much weight to others' feelings can sometimes make difficult decisions harder to make.",
    },
  },

  structuredAction: {
    mn: {
      title: "Төлөвлөгөө ба зохион байгуулалт",
      strength:
        "Юмыг урьдчилан зохион байгуулж, шийдвэрээ хааж, ажлаа дуусгах бүтэц танд үр дүнтэй ажилладаг.",
      risk: "Бүтэц хэт хатуу болох үед гэнэтийн шинэ мэдээлэлд чиглэлээ өөрчлөхөд төвөгтэй санагдаж болно.",
    },
    en: {
      title: "Structured action",
      strength:
        "Planning, closure, and clear structure tend to help you move work toward completion.",
      risk: "Too much structure can make unexpected changes or new information harder to accommodate.",
    },
  },

  adaptability: {
    mn: {
      title: "Уян хатан, дасан зохицох чадвар",
      strength:
        "Нөхцөл өөрчлөгдөхөд шинэ мэдээлэлд тааруулан арга барилаа хурдан өөрчлөх нь таны давуу тал.",
      risk: "Хэт нээлттэй явбал шийдвэрээ хойшлуулах, олон сонголт дунд удах эсвэл ажлыг бүрэн хаахгүй үлдээх эрсдэл гарч болно.",
    },
    en: {
      title: "Adaptability",
      strength:
        "You tend to adjust quickly when circumstances change and remain open to new information.",
      risk: "Too much flexibility can sometimes delay closure or leave too many options open.",
    },
  },
} as const;

export function getRelationshipInsight(
  letter: string,
  percent: number,
  lang: "mn" | "en",
) {
  const band =
    percent >= 86
      ? "veryStrong"
      : percent >= 76
        ? "strong"
        : percent >= 66
          ? "clear"
          : percent >= 56
            ? "slight"
            : "balanced";

  const content = {
    E: {
      mn: {
        balanced:
          "Та харилцаанд нээлттэй байж чаддаг ч өөрийн орон зайгаа хадгалах хэрэгцээ мөн байдаг.",
        slight:
          "Та хамтрагчтайгаа ярилцах, хамтдаа юм хийхийг бага зэрэг илүүд үздэг ч ганцаараа байх хэрэгцээ мөн хэвээр.",
        clear:
          "Та ойр дотно байдлыг ярилцах, хамтдаа цаг өнгөрөөх, идэвхтэй харилцах замаар мэдрэх хандлагатай.",
        strong:
          "Та харилцаанд идэвхтэй оролцож, хамтдаа туршлага бүтээх болон нээлттэй ярилцахыг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны хувьд дотно харилцаа идэвхтэй холбоо, байнгын харилцан үйлчлэл, хамтдаа өнгөрүүлэх цагтай хүчтэй холбоотой.",
      },
      en: {
        balanced:
          "You can be socially open in relationships while still needing personal space.",
        slight:
          "You slightly prefer conversation and shared activity, while still needing time to yourself.",
        clear:
          "You tend to build closeness through conversation, shared time, and active interaction.",
        strong:
          "You strongly value active connection, shared experiences, and open communication.",
        veryStrong:
          "For you, closeness is strongly tied to frequent interaction, shared activity, and active connection.",
      },
    },

    I: {
      mn: {
        balanced:
          "Та өөрийн орон зайг үнэлдэг ч дотно хүнтэйгээ нээлттэй харилцах чадвартай.",
        slight:
          "Та харилцаанд бага зэрэг илүү тайван орон зай, гүн яриаг эрхэмлэдэг.",
        clear:
          "Та итгэлцэл, хувийн орон зай, цөөн боловч гүн холбоог илүүд үзэх хандлагатай.",
        strong:
          "Та дотроо бодож боловсруулсны дараа нээлттэй болж, гүн бөгөөд тайван харилцааг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны хувьд итгэлцэл, хувийн орон зай, гүн холбоо нь дотно харилцааны хамгийн чухал хэсгүүдийн нэг.",
      },
      en: {
        balanced:
          "You value personal space while still being able to engage openly with someone close.",
        slight:
          "You slightly prefer quieter connection and deeper one-to-one interaction.",
        clear:
          "You tend to value trust, personal space, and fewer but deeper connections.",
        strong:
          "You strongly prefer depth, reflection, and space before opening up fully.",
        veryStrong:
          "Trust, privacy, and deep one-to-one connection are central to how you experience closeness.",
      },
    },

    S: {
      mn: {
        balanced:
          "Та бодит үйлдлийг үнэлдэг ч харилцааны утга, ирээдүйн боломжийг мөн харгалзаж чадна.",
        slight:
          "Та хайр халамжийг үгээр бус бодит үйлдлээр илэрхийлэхийг бага зэрэг илүүд үздэг.",
        clear:
          "Та халамжийг анхаарал, тусламж, өдөр тутмын найдвартай үйлдлээр илэрхийлэх хандлагатай.",
        strong:
          "Та харилцаанд бодит анхаарал, тогтвортой байдал, амлалтаа үйлдлээр харуулахыг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны хувьд хайр гэдэг нь голчлон бодит халамж, найдвартай байдал, өдөр тутмын үйлдлээр батлагдах зүйл.",
      },
      en: {
        balanced:
          "You value practical care while remaining open to the broader meaning of the relationship.",
        slight:
          "You slightly prefer showing care through practical action rather than words alone.",
        clear:
          "You tend to show care through attention, help, and everyday reliability.",
        strong:
          "You strongly value practical care, consistency, and showing commitment through action.",
        veryStrong:
          "For you, love is strongly tied to dependable action, practical care, and everyday reliability.",
      },
    },

    N: {
      mn: {
        balanced:
          "Та харилцааны утга, боломжийг анзаардаг ч бодит нөхцөлөө мөн сайн харгалзаж чадна.",
        slight:
          "Та харилцааны цаад утга, ирээдүйн боломжийг бага зэрэг илүү сонирхдог.",
        clear:
          "Та сэтгэлийн холбоо, хамтдаа өсөх мэдрэмж, ирээдүйн боломжийг чухалчлах хандлагатай.",
        strong:
          "Та харилцаанд гүн утга, оюуны болон сэтгэлийн холбоо, хамтын өсөлтийг хүчтэй эрэлхийлдэг.",
        veryStrong:
          "Таны хувьд дотно харилцаа нь зөвхөн хамт байх бус, утга учиртай холбоо болон хамтдаа өсөх мэдрэмжтэй салшгүй холбоотой.",
      },
      en: {
        balanced:
          "You notice meaning and possibilities while still staying grounded in practical realities.",
        slight:
          "You slightly prefer exploring meaning and future possibilities in a relationship.",
        clear:
          "You tend to value emotional connection, shared growth, and future possibilities.",
        strong:
          "You strongly seek meaning, intellectual or emotional connection, and shared growth.",
        veryStrong:
          "For you, a close relationship is deeply tied to meaning, shared vision, and growing together.",
      },
    },

    T: {
      mn: {
        balanced:
          "Та маргаан үед логик болон хүний мэдрэмжийг харьцангуй тэнцвэртэй авч үзэх боломжтой.",
        slight:
          "Маргаан үед та асуудлыг шийдэх логик гарцыг бага зэрэг түрүүлж хайх хандлагатай.",
        clear:
          "Та зөрчилдөөнийг асуудлыг салгаж харах, үндэслэлтэй шийдэх замаар зохицуулахыг илүүд үздэг.",
        strong:
          "Та маргаан үед асуудлыг хурдан, логик байдлаар шийдэхийг хүчтэй хүсдэг. Гэхдээ хамтрагч тань эхлээд сонсогдохыг хүсэж болохыг анзаарах нь чухал.",
        veryStrong:
          "Та харилцааны зөрчилд шийдэл, логик, бодит үндэслэлийг маш түрүүнд тавих хандлагатай. Сэтгэл хөдлөлийн хэрэгцээг зориуд анзаарах нь харилцааг тэнцвэржүүлнэ.",
      },
      en: {
        balanced:
          "You can usually balance logical problem-solving with emotional context.",
        slight:
          "You slightly prefer finding a logical solution first during conflict.",
        clear:
          "You tend to handle conflict by separating the issue and looking for a reasoned solution.",
        strong:
          "You strongly prefer solving conflict logically, though your partner may first need to feel heard.",
        veryStrong:
          "You place very strong emphasis on logic and solutions during conflict, so deliberately noticing emotional needs can help balance the interaction.",
      },
    },

    F: {
      mn: {
        balanced:
          "Та бусдын мэдрэмжийг харгалзахын зэрэгцээ өөрийн байр сууриа ч хамгаалж чадна.",
        slight:
          "Та хамтрагчийнхаа мэдрэмжийг бага зэрэг илүү түрүүлж анзаарах хандлагатай.",
        clear:
          "Та харилцаанд хүний мэдрэмж, нөхцөл, эв зохицлыг чухалчлах хандлагатай.",
        strong:
          "Та хамтрагчийнхаа мэдрэмж, хэрэгцээг хурдан анзаарч, эв зохицлыг хадгалахыг хүчтэй хичээдэг.",
        veryStrong:
          "Таны хувьд хамтрагчийн мэдрэмж, ойлголцол, эв зохицол маш чухал. Өөрийн хэрэгцээг хэт хойш тавихгүй байх нь тэнцвэр өгнө.",
      },
      en: {
        balanced:
          "You can consider emotional needs while still protecting your own position.",
        slight:
          "You slightly prioritize your partner's emotional experience during interaction.",
        clear:
          "You tend to place importance on feelings, context, and harmony.",
        strong:
          "You strongly notice your partner's feelings and work to preserve emotional harmony.",
        veryStrong:
          "Emotional understanding and harmony are central to you, so remembering your own needs is important for balance.",
      },
    },

    J: {
      mn: {
        balanced:
          "Та тогтвортой байдлыг хүсдэг ч нөхцөл өөрчлөгдөхөд уян хатан байж чадна.",
        slight:
          "Та харилцаанд тодорхой байдал, төлөвлөгөөг бага зэрэг илүүд үздэг.",
        clear:
          "Та амлалт, тодорхой байдал, найдвартай байдлыг чухалчлах хандлагатай.",
        strong:
          "Та харилцааны ирээдүй, амлалт, төлөвлөгөөг тодорхой байлгахыг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны хувьд тогтвортой байдал, амлалт, урьдчилан мэдэх боломж нь харилцааны үндсэн хэрэгцээнүүдийн нэг.",
      },
      en: {
        balanced:
          "You value stability while remaining fairly flexible when circumstances change.",
        slight: "You slightly prefer clarity and planning in relationships.",
        clear: "You tend to value commitment, clarity, and reliability.",
        strong:
          "You strongly prefer clear expectations, commitment, and plans for the future.",
        veryStrong:
          "Stability, commitment, and predictability are central relationship needs for you.",
      },
    },

    P: {
      mn: {
        balanced:
          "Та эрх чөлөө болон тогтвортой байдлын хооронд харьцангуй уян хатан байж чадна.",
        slight:
          "Та харилцаанд бага зэрэг илүү эрх чөлөө, уян хатан байдлыг хүсдэг.",
        clear:
          "Та харилцааг хэт хатуу дүрэмд барихгүй, нөхцөлдөө зохицох орон зайг чухалчилдаг.",
        strong:
          "Та хамтдаа шинэ зүйл турших, гэнэтийн боломжийг ашиглах, эрх чөлөөтэй байхыг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны хувьд харилцаанд сонголтын эрх чөлөө, шинэ туршлага, нөхцөлдөө шууд зохицох боломж маш чухал.",
      },
      en: {
        balanced:
          "You can usually balance freedom with a reasonable amount of stability.",
        slight: "You slightly prefer flexibility and freedom in relationships.",
        clear:
          "You tend to value room to adapt rather than strict relationship structure.",
        strong:
          "You strongly value spontaneity, new experiences, and personal freedom.",
        veryStrong:
          "Freedom, flexibility, and room for new experiences are central relationship needs for you.",
      },
    },
  } as const;

  const item = content[letter as keyof typeof content];

  if (!item) return "";

  return lang === "en" ? item.en[band] : item.mn[band];
}
export function getCareerInsight(
  letter: string,
  percent: number,
  lang: "mn" | "en",
) {
  const band =
    percent >= 86
      ? "veryStrong"
      : percent >= 76
        ? "strong"
        : percent >= 66
          ? "clear"
          : percent >= 56
            ? "slight"
            : "balanced";

  const content = {
    E: {
      mn: {
        balanced:
          "Та багтай ажиллах болон бие даан төвлөрөх хоёр хэв маягийг нөхцөлөөсөө шалтгаалан ашиглаж чадна.",
        slight:
          "Та хамтын ажиллагаа, ярилцлага, бусадтай санаа солилцох орчныг бага зэрэг илүүд үздэг.",
        clear:
          "Та хүмүүстэй идэвхтэй харилцах, хамтран ажиллах, санаагаа шууд солилцох үед эрч хүчтэй ажиллах хандлагатай.",
        strong:
          "Та багийн хөдөлгөөнтэй орчин, олон хүнтэй харилцах ажил, шууд хамтын ажиллагаанд хүчтэй байдаг.",
        veryStrong:
          "Таны ажлын эрч хүч хүмүүс, идэвхтэй харилцаа, хурдтай хамтын ажиллагаанаас маш их хамаардаг.",
      },
      en: {
        balanced:
          "You can work well both collaboratively and independently depending on the situation.",
        slight:
          "You slightly prefer collaborative environments with discussion and idea exchange.",
        clear:
          "You tend to work well through active interaction, teamwork, and direct communication.",
        strong:
          "You are strongly energized by team activity, collaboration, and people-oriented work.",
        veryStrong:
          "Your work energy is highly tied to interaction, collaboration, and fast-moving social environments.",
      },
    },

    I: {
      mn: {
        balanced:
          "Та багтай ажиллахын зэрэгцээ бие даан төвлөрөх орон зайгаа сайн ашиглаж чадна.",
        slight:
          "Та тайван орчинд өөрийн хэмнэлээр төвлөрөхийг бага зэрэг илүүд үздэг.",
        clear:
          "Та тасалдал багатай орчинд бие даан бодож, гүн төвлөрөх үед илүү үр бүтээлтэй байх хандлагатай.",
        strong:
          "Та төвлөрөл шаардсан, бие даасан, гүнзгий ажилд хүчтэй байдаг.",
        veryStrong:
          "Таны хамгийн сайн гүйцэтгэл тасалдал багатай, бие даасан, гүн төвлөрөх боломжтой орчинд гардаг.",
      },
      en: {
        balanced:
          "You can collaborate while also making good use of independent focus.",
        slight:
          "You slightly prefer quieter work and more control over your own concentration.",
        clear:
          "You tend to perform well in environments that allow independent thinking and deep focus.",
        strong:
          "You are strongly suited to concentrated, independent, depth-oriented work.",
        veryStrong:
          "Your best work is likely to emerge in environments with autonomy, low interruption, and deep focus.",
      },
    },

    S: {
      mn: {
        balanced:
          "Та бодит хэрэгжилт болон шинэ боломжийн аль алиныг харгалзаж ажиллах боломжтой.",
        slight:
          "Та тодорхой зорилго, бодит мэдээлэл, хэрэгжүүлэх алхмуудыг бага зэрэг илүүд үздэг.",
        clear:
          "Та бодит асуудал, тодорхой мэдээлэл, шууд хэрэгжих шийдэлтэй ажиллахдаа хүчтэй.",
        strong:
          "Та практик үр дүн, нарийн мэдээлэл, бодитоор хэрэгжүүлэх ажлыг хүчтэй эрхэмлэдэг.",
        veryStrong:
          "Таны ажлын гол хүч нь бодит баримт, хэрэгжилт, нарийн деталийг найдвартай ажил болгох чадварт оршдог.",
      },
      en: {
        balanced:
          "You can balance practical execution with broader possibilities.",
        slight:
          "You slightly prefer clear goals, concrete information, and actionable steps.",
        clear:
          "You tend to work well with practical problems, concrete information, and implementable solutions.",
        strong:
          "You strongly value practical results, detail, and real-world execution.",
        veryStrong:
          "Your strongest work style is highly grounded in facts, implementation, and reliable execution.",
      },
    },

    N: {
      mn: {
        balanced:
          "Та шинэ санаа болон бодит хэрэгжилтийн хооронд харьцангуй тэнцвэртэй ажиллаж чадна.",
        slight:
          "Та шинэ санаа, боломж, ерөнхий зураг руу бага зэрэг илүү татагддаг.",
        clear:
          "Та шинэ санаа гаргах, холбоо олж харах, ирээдүйн боломжийг төсөөлөх ажилд хүчтэй.",
        strong:
          "Та стратеги, инноваци, шинэ боломж, урт хугацааны чиглэл дээр хүчтэй ажиллах хандлагатай.",
        veryStrong:
          "Таны ажлын хамгийн хүчтэй тал нь бусдын хараахан анзаараагүй холбоо, шинэ боломж, ирээдүйн чиглэлийг олж харахад оршдог.",
      },
      en: {
        balanced: "You can balance new ideas with practical execution.",
        slight:
          "You slightly prefer ideas, possibilities, and the bigger picture.",
        clear:
          "You tend to work well with new ideas, patterns, and future possibilities.",
        strong:
          "You are strongly oriented toward strategy, innovation, and long-term possibilities.",
        veryStrong:
          "Your strongest work contribution is often seeing connections, opportunities, and future directions others may miss.",
      },
    },

    T: {
      mn: {
        balanced:
          "Та шийдвэр гаргахдаа логик болон хүний нөхцөлийг хоёуланг нь харгалзаж чадна.",
        slight:
          "Та ажлын шийдвэрт логик, үр ашиг, үндэслэлийг бага зэрэг илүү түрүүлж тавьдаг.",
        clear:
          "Та асуудлыг задлан шинжилж, логик үндэслэлтэй шийдвэр гаргах ажилд хүчтэй.",
        strong:
          "Та систем, үр ашиг, объектив шийдвэр, асуудал шийдвэрлэх орчинд хүчтэй ажилладаг.",
        veryStrong:
          "Таны ажлын гол давуу тал нь төвөгтэй асуудлыг сэтгэл хөдлөлөөс салгаж, логик бүтэц, үр ашигтай шийдэл болгон хувиргах чадвар.",
      },
      en: {
        balanced:
          "You can usually balance logical reasoning with human context.",
        slight:
          "You slightly prioritize logic, efficiency, and objective reasoning in work decisions.",
        clear:
          "You tend to perform well in analysis, problem-solving, and reasoned decision-making.",
        strong:
          "You are strongly suited to systems, efficiency, objective decisions, and problem-solving.",
        veryStrong:
          "A major work strength is your ability to turn complex problems into structured, logical, efficient solutions.",
      },
    },

    F: {
      mn: {
        balanced:
          "Та хүний хэрэгцээ болон бодит шийдвэрийн хооронд тэнцвэр олох боломжтой.",
        slight:
          "Та ажлын шийдвэрт хүний нөлөө, багийн уур амьсгалыг бага зэрэг илүү анзаардаг.",
        clear:
          "Та хүмүүсийн хэрэгцээ, хамтын ажиллагаа, харилцааны чанарыг анзаарах ажилд хүчтэй.",
        strong:
          "Та хүн төвтэй ажил, багийн уур амьсгал, дэмжлэг, харилцаа шаардсан орчинд хүчтэй.",
        veryStrong:
          "Таны ажлын хамгийн хүчтэй талуудын нэг нь хүмүүсийг ойлгож, итгэлцэл бий болгож, багийг хүний талаас нь хөдөлгөх чадвар.",
      },
      en: {
        balanced: "You can balance human needs with practical decision-making.",
        slight:
          "You slightly prioritize human impact and team dynamics in work decisions.",
        clear:
          "You tend to perform well in work involving people, cooperation, and relationship quality.",
        strong:
          "You are strongly suited to people-centered work, support, teamwork, and relationship-driven environments.",
        veryStrong:
          "One of your strongest work contributions is understanding people, building trust, and supporting healthy team dynamics.",
      },
    },

    J: {
      mn: {
        balanced:
          "Та бүтэцтэй ажиллах болон нөхцөлдөө өөрчлөх хоёрын хооронд уян хатан байж чадна.",
        slight:
          "Та тодорхой төлөвлөгөө, хугацаа, ажлын дарааллыг бага зэрэг илүүд үздэг.",
        clear:
          "Та зорилго, төлөвлөгөө, хугацаа тодорхой үед илүү тогтвортой ажиллах хандлагатай.",
        strong:
          "Та бүтэцтэй орчин, тодорхой үүрэг, төлөвлөгөө, ажлыг дуусгах шаардлагатай үед хүчтэй.",
        veryStrong:
          "Таны ажлын бүтээмж тодорхой бүтэц, хугацаа, хариуцлага, ажлыг бүрэн дуусгах системтэй маш хүчтэй холбоотой.",
      },
      en: {
        balanced:
          "You can work with structure while remaining reasonably adaptable.",
        slight:
          "You slightly prefer clear plans, deadlines, and work sequences.",
        clear:
          "You tend to work best when goals, plans, and deadlines are clearly defined.",
        strong:
          "You are strongly suited to structured environments with clear responsibilities and completion goals.",
        veryStrong:
          "Your productivity is highly tied to clear structure, deadlines, responsibility, and bringing work to completion.",
      },
    },

    P: {
      mn: {
        balanced:
          "Та төлөвлөгөө болон нөхцөлдөө шууд зохицох хоёр аргыг аль алиныг нь ашиглаж чадна.",
        slight:
          "Та ажлын явцад сонголтоо нээлттэй үлдээх, нөхцөлдөө өөрчлөхийг бага зэрэг илүүд үздэг.",
        clear:
          "Та хурдан өөрчлөгддөг, шинэ асуудал гардаг, арга барилаа шууд өөрчлөх шаардлагатай орчинд сайн ажиллах хандлагатай.",
        strong:
          "Та уян хатан орчин, шинэ сорилт, туршилт, богино хугацаанд шийдвэр өөрчлөх шаардлагатай ажилд хүчтэй.",
        veryStrong:
          "Таны ажлын хамгийн хүчтэй хэв маяг нь эрх чөлөөтэй, хурдтай өөрчлөгддөг, шинэ боломжийг шууд ашиглах боломжтой орчинд илэрдэг.",
      },
      en: {
        balanced:
          "You can use both planning and adaptation depending on the situation.",
        slight:
          "You slightly prefer keeping options open and adapting as work develops.",
        clear:
          "You tend to perform well in changing environments that require quick adjustment.",
        strong:
          "You are strongly suited to flexible work, new challenges, experimentation, and rapid adaptation.",
        veryStrong:
          "Your strongest work style appears in fast-changing environments where you have freedom to adapt and act on new opportunities.",
      },
    },
  } as const;

  const item = content[letter as keyof typeof content];

  if (!item) return "";

  return lang === "en" ? item.en[band] : item.mn[band];
}
export function getStressInsight(
  letter: string,
  percent: number,
  lang: "mn" | "en",
) {
  const band =
    percent >= 86
      ? "veryStrong"
      : percent >= 76
        ? "strong"
        : percent >= 66
          ? "clear"
          : percent >= 56
            ? "slight"
            : "balanced";

  const content = {
    E: {
      mn: {
        balanced:
          "Стрессийн үед та заримдаа хүмүүстэй ярилцаж тайвширдаг, заримдаа ганцаараа бодлоо цэгцлэх хэрэгцээтэй байдаг.",
        slight:
          "Стресс нэмэгдэхэд та асуудлаа ярьж, бусдаас эрч хүч авахыг бага зэрэг илүүд үзэх хандлагатай.",
        clear:
          "Дарамтын үед та бусадтай ярилцах, хөдөлгөөнтэй байх, гаднаас эрч хүч авах замаар стрессээ тайлах хандлагатай.",
        strong:
          "Стресс ихсэхэд та идэвхтэй орчин, яриа, хүмүүсийн дунд байхыг хүчтэй эрэлхийлж болно.",
        veryStrong:
          "Өндөр стрессийн үед та гаднын идэвх, хүмүүс, шууд харилцаанд хэт түшиглэх хандлагатай байж болох тул богино хугацаанд ганцаараа бодлоо цэгцлэх зай хэрэгтэй.",
      },
      en: {
        balanced:
          "Under stress, you may alternate between talking things through and needing time alone to reset.",
        slight:
          "You slightly prefer talking things through and drawing energy from others when stressed.",
        clear:
          "You tend to cope with stress through interaction, activity, and external engagement.",
        strong:
          "When pressure rises, you may strongly seek conversation, activity, and other people.",
        veryStrong:
          "Under heavy stress, you may over-rely on external activity and interaction, so brief quiet time can help you reset.",
      },
    },

    I: {
      mn: {
        balanced:
          "Стрессийн үед та ганцаараа бодлоо цэгцлэх болон итгэлтэй хүнтэйгээ ярилцах хоёр аргыг хоёуланг нь ашиглаж чадна.",
        slight:
          "Дарамтын үед та түр хугацаанд өөрийн орон зайд орохыг бага зэрэг илүүд үздэг.",
        clear:
          "Стресс нэмэгдэхэд та гаднын өдөөлтөөс холдож, ганцаараа бодлоо цэгцлэх хэрэгцээтэй болох хандлагатай.",
        strong:
          "Өндөр дарамтын үед та өөрийгөө тусгаарлаж, асуудлыг дотроо удаан боловсруулах хандлага хүчтэй байж болно.",
        veryStrong:
          "Стрессийн үед та маш их дотогшоо орж, бусдаас тасрах эрсдэлтэй. Итгэлтэй хүнтэй санаагаа хуваалцах нь хэт тусгаарлагдахаас сэргийлнэ.",
      },
      en: {
        balanced:
          "Under stress, you can use both private reflection and talking with someone you trust.",
        slight:
          "You slightly prefer withdrawing into your own space when pressure rises.",
        clear:
          "You tend to reduce outside stimulation and process stress internally.",
        strong:
          "Under high pressure, you may strongly withdraw and spend a long time processing things alone.",
        veryStrong:
          "Heavy stress may push you into deep withdrawal, so deliberately reconnecting with someone you trust can help prevent isolation.",
      },
    },

    S: {
      mn: {
        balanced:
          "Стрессийн үед та одоогийн бодит асуудал болон цаашдын боломжийг хоёуланг нь харгалзаж чадна.",
        slight:
          "Дарамтын үед та тодорхой баримт, яг одоо хийх алхам руу бага зэрэг илүү төвлөрдөг.",
        clear:
          "Стресс нэмэгдэхэд та бодит асуудал, жижиг детал, шууд шийдэх зүйл дээр төвлөрөх хандлагатай.",
        strong:
          "Өндөр дарамтын үед та деталд хэт автаж, том зургаа харахаа түр алдах магадлалтай.",
        veryStrong:
          "Стресс ихсэхэд та маш жижиг асуудал, алдаа, бодит деталиуд дээр хэт төвлөрч болзошгүй. Том зорилгоо зориуд дахин харах нь тэнцвэр өгнө.",
      },
      en: {
        balanced:
          "Under stress, you can consider both immediate facts and broader possibilities.",
        slight:
          "You slightly focus more on concrete facts and immediate next steps under pressure.",
        clear:
          "You tend to narrow your attention toward practical issues and details when stressed.",
        strong:
          "Under high pressure, you may become overly focused on details and temporarily lose sight of the bigger picture.",
        veryStrong:
          "Heavy stress may pull your attention strongly toward small problems and errors, so deliberately revisiting the larger goal can help.",
      },
    },

    N: {
      mn: {
        balanced:
          "Стрессийн үед та бодит нөхцөл болон боломжит хувилбаруудыг харьцангуй тэнцвэртэй авч үзэж чадна.",
        slight:
          "Дарамтын үед та боломжит хувилбар, цааш юу болохыг бага зэрэг илүү бодох хандлагатай.",
        clear:
          "Стресс нэмэгдэхэд та олон хувилбар, ирээдүйн боломж, холбоог зэрэг бодох хандлагатай.",
        strong:
          "Өндөр дарамтын үед хэт олон боломж, таамаг, ирээдүйн сценарид автах магадлалтай.",
        veryStrong:
          "Стресс ихсэхэд таны бодол олон боломжит хувилбар руу маш хурдан тархаж, бодит алхам хийхэд саад болж болно. Яг одоо хийх нэг алхамдаа төвлөрөх нь тустай.",
      },
      en: {
        balanced:
          "Under stress, you can balance practical reality with possible future outcomes.",
        slight:
          "You slightly focus more on possibilities and what might happen next when pressured.",
        clear:
          "You tend to generate multiple possibilities and future scenarios under stress.",
        strong:
          "Under high pressure, you may become caught in too many possibilities and hypothetical outcomes.",
        veryStrong:
          "Heavy stress may scatter your attention across many possible scenarios, so returning to one concrete next step can be grounding.",
      },
    },

    T: {
      mn: {
        balanced:
          "Стрессийн үед та логик шийдэл болон хүний мэдрэмжийг хоёуланг нь харгалзах боломжтой.",
        slight:
          "Дарамтын үед та асуудлыг логикоор шийдэхийг бага зэрэг түрүүлж оролддог.",
        clear:
          "Стресс нэмэгдэхэд та сэтгэл хөдлөлөөс зай барьж, асуудлыг шийдэл болон логик талаас нь харах хандлагатай.",
        strong:
          "Өндөр дарамтын үед та хэт шулуун, хатуу, зөвхөн үр дүнд төвлөрсөн мэт харагдаж болно.",
        veryStrong:
          "Стресс ихсэхэд та хүний мэдрэмжийг бараг орхиж, зөвхөн логик болон шийдэлд төвлөрөх эрсдэлтэй. Хариу өгөхийн өмнө бусдын байр суурийг зориуд шалгах нь тэнцвэр өгнө.",
      },
      en: {
        balanced:
          "Under stress, you can usually consider both logical solutions and emotional context.",
        slight:
          "You slightly prioritize logical problem-solving when pressure rises.",
        clear:
          "You tend to distance yourself from emotion and focus on solutions under stress.",
        strong:
          "Under high pressure, you may come across as overly direct, detached, or outcome-focused.",
        veryStrong:
          "Heavy stress may push you to ignore emotional context almost entirely, so deliberately checking the human impact can help balance your response.",
      },
    },

    F: {
      mn: {
        balanced:
          "Стрессийн үед та бусдын мэдрэмж болон өөрийн байр суурийн хооронд тэнцвэр олох боломжтой.",
        slight:
          "Дарамтын үед та бусдын мэдрэмж, хариу үйлдлийг бага зэрэг илүү анзаарах хандлагатай.",
        clear:
          "Стресс нэмэгдэхэд та бусдын сэтгэл хөдлөл, харилцааны уур амьсгалыг өөр дээрээ их авч бодох хандлагатай.",
        strong:
          "Өндөр дарамтын үед бусдыг гомдоохгүй байх гэж өөрийн хэрэгцээг хойш тавих эрсдэлтэй.",
        veryStrong:
          "Стресс ихсэхэд та бусдын мэдрэмжийг хэт үүрч, өөрийгөө буруутгах эсвэл өөрийн хэрэгцээг орхих эрсдэлтэй. Өөрийн хил хязгаарыг зориуд санах нь чухал.",
      },
      en: {
        balanced:
          "Under stress, you can usually balance others' feelings with your own position.",
        slight:
          "You slightly notice other people's reactions and emotions more when pressured.",
        clear:
          "You tend to absorb emotional atmosphere and other people's feelings under stress.",
        strong:
          "Under high pressure, you may put your own needs aside to avoid hurting or disappointing others.",
        veryStrong:
          "Heavy stress may lead you to carry too much emotional responsibility, so deliberately protecting your own boundaries becomes important.",
      },
    },

    J: {
      mn: {
        balanced:
          "Стрессийн үед та бүтэц гаргах болон нөхцөлдөө өөрчлөх хоёр аргыг хоёуланг нь ашиглаж чадна.",
        slight:
          "Дарамтын үед та төлөвлөгөө, дараалал, тодорхой байдлыг бага зэрэг илүү хүсдэг.",
        clear:
          "Стресс нэмэгдэхэд та нөхцөлөө хянахын тулд төлөвлөгөө, жагсаалт, тодорхой шийдвэр рүү татагдах хандлагатай.",
        strong:
          "Өндөр дарамтын үед бүхнийг хянах, хурдан шийдэх, төлөвлөгөөнөөс хазайхыг тэвчихгүй болох эрсдэлтэй.",
        veryStrong:
          "Стресс ихсэхэд та маш хатуу бүтэц, хяналт шаарддаг болж, гэнэтийн өөрчлөлтийг хүлээн авахад хүндрэлтэй байж болно. Зарим зүйл тодорхойгүй хэвээр байж болохыг зөвшөөрөх нь тустай.",
      },
      en: {
        balanced:
          "Under stress, you can use both structure and adaptation depending on the situation.",
        slight:
          "You slightly prefer plans, order, and clarity when pressure rises.",
        clear:
          "You tend to create structure, lists, and clear decisions to regain control under stress.",
        strong:
          "Under high pressure, you may become controlling, impatient with uncertainty, or overly rigid about plans.",
        veryStrong:
          "Heavy stress may create a strong need for control and certainty, so allowing some uncertainty can help reduce rigidity.",
      },
    },

    P: {
      mn: {
        balanced:
          "Стрессийн үед та төлөвлөгөө гаргах болон нөхцөлдөө зохицох хоёр аргыг аль алиныг нь ашиглаж чадна.",
        slight:
          "Дарамтын үед та сонголтоо нээлттэй үлдээж, нөхцөлдөө зохицохыг бага зэрэг илүүд үздэг.",
        clear:
          "Стресс нэмэгдэхэд та нэг шийдвэрт баригдахаас илүү олон сонголт нээлттэй үлдээх хандлагатай.",
        strong:
          "Өндөр дарамтын үед шийдвэрээ хойшлуулах, ажлаас ажил руу шилжих, дуусгалгүй орхих эрсдэл нэмэгдэж болно.",
        veryStrong:
          "Стресс ихсэхэд та хэт олон сонголт нээлттэй үлдээж, юунаас эхлэхээ алдах эрсдэлтэй. Нэг жижиг ажлыг сонгон бүрэн дуусгах нь хяналтаа сэргээхэд тусална.",
      },
      en: {
        balanced: "Under stress, you can use both planning and adaptation.",
        slight:
          "You slightly prefer keeping options open and adjusting as situations develop.",
        clear:
          "You tend to keep multiple options open rather than committing quickly under stress.",
        strong:
          "Under high pressure, you may delay decisions, switch between tasks, or leave things unfinished.",
        veryStrong:
          "Heavy stress may leave too many options open and make it hard to start, so choosing one small task and completing it can restore a sense of control.",
      },
    },
  } as const;

  const item = content[letter as keyof typeof content];

  if (!item) return "";

  return lang === "en" ? item.en[band] : item.mn[band];
}
export function getGrowthInsight(
  letter: string,
  percent: number,
  lang: "mn" | "en",
) {
  const band =
    percent >= 86
      ? "veryStrong"
      : percent >= 76
        ? "strong"
        : percent >= 66
          ? "clear"
          : percent >= 56
            ? "slight"
            : "balanced";

  const content = {
    E: {
      mn: {
        balanced:
          "Энэ чиглэл аль хэдийн тэнцвэртэй тул нөхцөлдөө тохируулан бусадтай харилцах болон ганцаараа төвлөрөх хоёр чадвараа үргэлжлүүлэн ашиглаарай.",
        slight:
          "Яриа, идэвхтэй харилцааны хажуугаар шийдвэрийн өмнө өөртөө бодох багахан хугацаа өгөх нь танд илүү тэнцвэр өгнө.",
        clear:
          "Бусадтай санаа солилцох хүчээ хадгалахын зэрэгцээ зарим асуудлыг эхлээд ганцаараа бодож боловсруулах дадал хөгжүүлэх нь тустай.",
        strong:
          "Идэвхтэй орчин таны хүч боловч байнга гаднын өдөөлтөд түшиглэхгүйгээр чимээгүй төвлөрөх цагийг зориуд бий болго.",
        veryStrong:
          "Хүмүүс, хөдөлгөөн, харилцаанаас түр салж өөрийн бодол, зорилгоо дотроо боловсруулах тогтмол орон зай бий болгох нь хамгийн хэрэгтэй тэнцвэр болно.",
      },
      en: {
        balanced:
          "This dimension is already fairly balanced, so keep using both social engagement and private focus as the situation requires.",
        slight:
          "Alongside active interaction, giving yourself a little time to think before responding can improve balance.",
        clear:
          "Keep your strength in interaction while deliberately developing more private reflection before important decisions.",
        strong:
          "Social activity is a strength, but creating regular quiet focus time can keep you from relying too heavily on external stimulation.",
        veryStrong:
          "Building consistent space for private reflection and independent focus is likely to be your most useful balancing habit.",
      },
    },

    I: {
      mn: {
        balanced:
          "Та өөрийн орон зай болон бусадтай холбогдох хоёр хэрэгцээг харьцангуй тэнцвэртэй ашиглаж чадна.",
        slight:
          "Бүхнийг дотроо удаан боловсруулахын оронд зарим санаагаа эртхэн бусадтай хуваалцаж турших нь тустай.",
        clear:
          "Бие даан төвлөрөх хүчээ хадгалахын зэрэгцээ санаа, асуудлаа итгэлтэй хүмүүстэй илүү эрт хуваалцах дадал хөгжүүл.",
        strong:
          "Хэт удаан ганцаараа боловсруулахын оронд хэрэгтэй үед санал, тусламж хүсэхийг зориуд дадал болго.",
        veryStrong:
          "Өөрийн дотоод орон зай хүчтэй тул бусдаас тасрахгүй байхыг ухамсартайгаар анхаарч, чухал санаа болон асуудлаа итгэлтэй хүмүүстэй тогтмол хуваалц.",
      },
      en: {
        balanced:
          "You can already balance private space with connection reasonably well.",
        slight:
          "Sharing some ideas earlier instead of processing everything alone may be useful.",
        clear:
          "Keep your independent focus while practicing earlier communication with people you trust.",
        strong:
          "Make asking for input or support a deliberate habit rather than processing everything alone.",
        veryStrong:
          "Because your inner focus is very strong, maintaining regular trusted connection can prevent unnecessary isolation.",
      },
    },

    S: {
      mn: {
        balanced:
          "Та бодит хэрэгжилт болон шинэ боломжийн хооронд харьцангуй сайн тэнцвэр барьж чадна.",
        slight:
          "Шууд хэрэгжих зүйлээс гадна “өөр ямар боломж байж болох вэ?” гэж өөрөөсөө асууж хэвших нь тустай.",
        clear:
          "Баримт, бодит байдлыг сайн ашигладаг хүчээ хадгалаад урт хугацааны боломж, ерөнхий зургийг зориуд харж сур.",
        strong:
          "Детал болон батлагдсан арга дээр төвлөрөхөөсөө өмнө шинэ хувилбар, өөр арга замд богино хугацаа зориулах дадал хөгжүүл.",
        veryStrong:
          "Практик чанар маш хүчтэй тул шинэ, хараахан батлагдаагүй санааг эрт хаахгүй байхыг зориуд дадал болго. Зарим боломж эхэндээ тодорхой харагддаггүй.",
      },
      en: {
        balanced:
          "You already balance practical execution with possibilities fairly well.",
        slight:
          "It may help to ask what other possibilities exist beyond the most obvious practical option.",
        clear:
          "Keep your grounding in facts while deliberately considering longer-term possibilities and the bigger picture.",
        strong:
          "Before settling on proven methods, give alternative approaches and new possibilities deliberate attention.",
        veryStrong:
          "Because your practical focus is very strong, avoid dismissing new or unproven ideas too early.",
      },
    },

    N: {
      mn: {
        balanced:
          "Та шинэ санаа болон бодит хэрэгжилтийн хооронд харьцангуй тэнцвэртэй байна.",
        slight:
          "Шинэ санаа бүр дээр нэг бодит дараагийн алхам тодорхойлох нь хэрэгжилтийг нэмэгдүүлнэ.",
        clear:
          "Боломж олж харах хүчээ хадгалж, санаа бүрийг бодит алхам, хугацаа, хэмжиж болох үр дүнтэй холбож хэвш.",
        strong:
          "Олон санаа дундаас цөөн хэдийг сонгон бүрэн хэрэгжүүлэх дадал таны өсөлтөд хамгийн их нөлөөлнө.",
        veryStrong:
          "Таны санаа, боломж харах чадвар маш хүчтэй тул шинэ зүйл нэмж эхлэхээс илүү сонгосон нэг санаагаа бодит үр дүн хүртэл хүргэх сахилга хамгийн хэрэгтэй.",
      },
      en: {
        balanced:
          "You already balance new ideas with practical execution reasonably well.",
        slight:
          "Defining one concrete next step for each important idea can improve follow-through.",
        clear:
          "Keep your strength in possibilities while connecting ideas to concrete actions, timelines, and measurable outcomes.",
        strong:
          "Your biggest growth opportunity is choosing fewer ideas and carrying them through to completion.",
        veryStrong:
          "Because idea generation is very strong, disciplined execution on a small number of priorities is likely to create the most growth.",
      },
    },

    T: {
      mn: {
        balanced:
          "Та логик болон хүний нөхцөлийг харьцангуй тэнцвэртэй авч үзэх чадвартай.",
        slight:
          "Шийдвэр зөв эсэхээс гадна бусдад хэрхэн нөлөөлөхийг нэг алхам нэмээд бодох нь тустай.",
        clear:
          "Логик шийдвэрийнхээ хажуугаар хүний мэдрэмж, нөхцөл, харилцааны нөлөөг зориуд шалгаж хэвш.",
        strong:
          "Зөв шийдэл олохоос өмнө хүний байр суурийг сонсох, ойлгосноо баталгаажуулах дадал хөгжүүл.",
        veryStrong:
          "Логик маш хүчтэй тул бүх асуудлыг зөв/буруу, үр ашигтай/үр ашиггүйгээр хэмжихээс өмнө хүний хэрэгцээ, үнэ цэнийг зориуд авч үзэх нь чухал тэнцвэр болно.",
      },
      en: {
        balanced:
          "You can already balance logic with human context reasonably well.",
        slight:
          "Consider not only whether a decision is correct, but also how it affects people.",
        clear:
          "Alongside logical reasoning, deliberately check emotional and interpersonal impact.",
        strong:
          "Practice listening and confirming understanding before moving directly to the solution.",
        veryStrong:
          "Because logic is very strong, deliberately considering human needs and values before optimizing for correctness can create better balance.",
      },
    },

    F: {
      mn: {
        balanced:
          "Та хүний мэдрэмж болон бодит шийдвэрийн хооронд харьцангуй сайн тэнцвэр олж чадна.",
        slight:
          "Бусдын мэдрэмжийг анзаарахын зэрэгцээ өөрийн байр сууриа тодорхой хэлж хэвших нь тустай.",
        clear:
          "Эв зохицлыг хадгалахдаа өөрийн хэрэгцээ, хил хязгаар, бодит баримтыг орхихгүй байх дадал хөгжүүл.",
        strong:
          "Бусдыг гомдоохоос айж чухал шийдвэрийг хойшлуулахгүйгээр хүнд боловч тодорхой яриа хийх чадвараа хөгжүүл.",
        veryStrong:
          "Хүний мэдрэмжийг маш хүчтэй анзаардаг тул өөрийн хэрэгцээ, хил хязгаарыг хамгаалахыг ухамсартай дадал болгох нь хамгийн хэрэгтэй өсөлт болно.",
      },
      en: {
        balanced:
          "You already balance emotional context with practical decisions reasonably well.",
        slight:
          "Keep noticing others' feelings while practicing clearer expression of your own position.",
        clear:
          "Protect your own needs, boundaries, and facts while maintaining harmony.",
        strong:
          "Develop comfort with difficult but necessary conversations rather than delaying them to avoid discomfort.",
        veryStrong:
          "Because your awareness of others is very strong, deliberately protecting your own needs and boundaries is likely to be your most useful growth area.",
      },
    },

    J: {
      mn: {
        balanced:
          "Та бүтэц болон уян хатан байдлын хооронд нөхцөлдөө тохируулан шилжиж чадна.",
        slight:
          "Төлөвлөгөөндөө багахан нөөц зай үлдээх нь гэнэтийн өөрчлөлтийг илүү амархан хүлээн авахад тусална.",
        clear:
          "Төлөвлөгөө гаргах хүчээ хадгалж, шинэ мэдээлэл гарвал чиглэлээ өөрчлөх боломжийг зориуд нээлттэй үлдээ.",
        strong:
          "Бүхнийг урьдчилан хаахын оронд зарим шийдвэрийг тодорхой хугацаанд нээлттэй үлдээх дадал хөгжүүл.",
        veryStrong:
          "Бүтэц, хяналт маш хүчтэй тул тодорхойгүй байдалд бага хэмжээгээр дасах, төгс төлөвлөгөөгүйгээр эхлэх чадвар таны өсөлтөд чухал.",
      },
      en: {
        balanced:
          "You can already move between structure and flexibility as needed.",
        slight:
          "Leaving a little extra room in plans can make unexpected changes easier to handle.",
        clear:
          "Keep your planning strength while deliberately leaving room to adjust when new information appears.",
        strong:
          "Practice leaving some decisions open temporarily instead of closing everything immediately.",
        veryStrong:
          "Because structure and control are very strong preferences, building tolerance for uncertainty and imperfect plans can create important growth.",
      },
    },

    P: {
      mn: {
        balanced:
          "Та уян хатан байдал болон бүтэц хоёрын хооронд харьцангуй тэнцвэртэй шилжиж чадна.",
        slight:
          "Сонголтоо нээлттэй байлгахын зэрэгцээ чухал ажлуудад тодорхой дуусгах хугацаа тавих нь тустай.",
        clear:
          "Уян хатан байдлаа хадгалж, эхэлсэн ажлынхаа цөөн хэдийг заавал бүрэн дуусгах систем бий болго.",
        strong:
          "Шинэ боломж бүр рүү шилжихийн оронд хамгийн чухал ажлаа сонгон тодорхой хугацаанд тууштай үргэлжлүүлэх дадал хөгжүүл.",
        veryStrong:
          "Уян хатан байдал маш хүчтэй тул сонголтоо хязгаарлах, нэг зүйлд амлалт өгөх, эхэлсэн ажлаа бүрэн хаах систем таны өсөлтийн хамгийн чухал хэсэг болно.",
      },
      en: {
        balanced:
          "You can already balance flexibility with structure reasonably well.",
        slight:
          "Keep your options open while giving important work clear completion dates.",
        clear:
          "Maintain your adaptability while creating a system that ensures a few important tasks are fully completed.",
        strong:
          "Instead of moving toward every new possibility, practice staying with your highest priority for a defined period.",
        veryStrong:
          "Because flexibility is very strong, limiting options, committing to one priority, and closing unfinished work are likely to create the most growth.",
      },
    },
  } as const;

  const item = content[letter as keyof typeof content];

  if (!item) return "";

  return lang === "en" ? item.en[band] : item.mn[band];
}
export const mbtiTraitByLetter = {
  E: "socialConfidence",
  I: "independentFocus",
  S: "practicalThinking",
  N: "possibilityThinking",
  T: "logicalDecision",
  F: "peopleAwareness",
  J: "structuredAction",
  P: "adaptability",
} as const;
export function getMbtiDominantTraits(
  type: string,
  axes: any,
  traitScores: any[],
  lang: "mn" | "en",
) {
  const typeLetters = String(type ?? "")
    .toUpperCase()
    .split("")
    .filter((letter) =>
      ["E", "I", "S", "N", "T", "F", "J", "P"].includes(letter),
    );

  return typeLetters
    .map((letter) => {
      const key = mbtiTraitByLetter[letter as keyof typeof mbtiTraitByLetter];

      if (!key) return null;

      const traitScore = traitScores.find((trait) => trait.key === key);

      const content = mbtiTraitContent[key];

      const localized = lang === "en" ? content.en : content.mn;

      const preferencePercent = getPreferencePercent(letter, axes);

      return {
        key,
        letter,
        title: localized.title,
        strength: localized.strength,
        risk: localized.risk,
        traitPercent: traitScore?.percent ?? 50,
        preferencePercent,
        level: getPreferenceLevel(preferencePercent, lang),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.preferencePercent - a.preferencePercent);
}
export function getMbtiReportInsights(
  dominantTraits: any[],
  lang: "mn" | "en",
) {
  const strengths = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    title: trait.title,
    description: getStrengthDescription(
      trait.strength,
      trait.preferencePercent,
      lang,
    ),
    level: trait.level,
    percent: trait.preferencePercent,
  }));

  const risks = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    title: trait.title,
    description: getRiskDescription(trait.risk, trait.preferencePercent, lang),
    level: trait.level,
    percent: trait.preferencePercent,
  }));

  const relationships = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    percent: trait.preferencePercent,
    level: trait.level,
    description: getRelationshipInsight(
      trait.letter,
      trait.preferencePercent,
      lang,
    ),
  }));

  const career = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    percent: trait.preferencePercent,
    level: trait.level,
    description: getCareerInsight(trait.letter, trait.preferencePercent, lang),
  }));

  const stress = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    percent: trait.preferencePercent,
    level: trait.level,
    description: getStressInsight(trait.letter, trait.preferencePercent, lang),
  }));

  const growth = dominantTraits.map((trait) => ({
    key: trait.key,
    letter: trait.letter,
    percent: trait.preferencePercent,
    level: trait.level,
    description: getGrowthInsight(trait.letter, trait.preferencePercent, lang),
  }));

  return {
    strengths,
    risks,
    relationships,
    career,
    stress,
    growth,
  };
}
