type DisplayData = {
  title: string;
  mainValue: string;
  shortSummary: string;
  tags: string[];
};

export function getDisplayData(result: any): DisplayData {
  const data = result?.result_json;

  switch (result.test_type) {
    // 🧠 IQ TEST
    case "iq":
      const iq = data?.iq ?? 0;

      let level = "Average";
      let summary = "You have balanced intelligence.";
      let tags = ["Logic", "Thinking", "Focus"];

      if (iq < 90) {
        level = "Below Average";
        summary = "You have potential to improve your reasoning skills.";
        tags = ["Learning", "Growth", "Practice"];
      } else if (iq > 120) {
        level = "High Intelligence";
        summary = "You have strong analytical and logical thinking.";
        tags = ["Genius", "Logic", "Sharp Mind"];
      }

      return {
        title: "IQ Result",
        mainValue: `${iq}`,
        shortSummary: summary,
        tags,
      };

    // 💛 LOVE TEST
    case "love":
      const score = data?.score ?? 0;

      return {
        title: "Love Compatibility",
        mainValue: `${score}%`,
        shortSummary:
          score > 70
            ? "Strong connection and emotional compatibility"
            : "Needs effort and better understanding",
        tags: ["Love", "Relationship", "Emotion"],
      };

    // 🧠 MBTI
    case "mbti":
      const type = data?.type ?? "INTJ";

      return {
        title: "Personality Type",
        mainValue: type,
        shortSummary: data?.summary ?? "Unique personality profile",
        tags: ["Personality", "Mind", "Behavior"],
      };

    // 🔮 NUMEROLOGY
    case "numerology":
      return {
        title: data?.combined?.title ?? "Life Path",
        mainValue: data?.combined?.core ?? "Energy",
        shortSummary:
          data?.combined?.summary ?? "Your energy and destiny are aligned.",
        tags: ["Energy", "Destiny", "Life Path"],
      };

    // ✋ PALM
    case "palm":
      return {
        title: "Palm Reading",
        mainValue: "Your Destiny",
        shortSummary: data?.summary ?? "Your life path shows unique patterns.",
        tags: ["Destiny", "Future", "Character"],
      };

    default:
      return {
        title: "Your Result",
        mainValue: "Result",
        shortSummary: "AI generated insight",
        tags: ["AI", "Insight"],
      };
  }
}
