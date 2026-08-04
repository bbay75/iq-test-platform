export function getTraitIconCandidates(strength: string): string[] {
  const map: Record<string, string[]> = {
    "Алсын хараатай": ["eye", "compass"],
    "Логик сэтгэлгээтэй": ["brain", "gear"],
    "Бие даасан": ["shield", "flag"],

    "Задлан шинжээч": ["gear", "brain"],
    Сониуч: ["lightbulb", "eye"],
    "Өөр өнцөгтэй": ["eye", "compass"],
    "Өөр өнцөг хардаг": ["eye", "compass"],

    Шийдэмгий: ["flag", "target"],
    Зорилготой: ["target", "flag"],
    "Стратеги сэтгэлгээтэй": ["compass", "brain"],

    "Эмх цэгцтэй": ["check-circle", "gear"],
    Хариуцлагатай: ["shield", "check-circle"],
    "Үр дүнд төвлөрдөг": ["target", "check-circle"],

    Мэдрэмжтэй: ["heart", "sparkle"],
    "Гүн мэдрэмжтэй": ["heart", "eye"],
    "Зөөлөн сэтгэлтэй": ["hand-heart", "heart"],
    Халамжтай: ["hand-heart", "heart"],
    Бүтээлч: ["palette", "lightbulb"],

    "Гоо зүйтэй": ["palette", "sparkle"],
    "Чөлөөт сэтгэлгээтэй": ["rocket", "flower-lotus"],

    "Зөн совинтой": ["eye", "sparkle"],
    "Утга учир эрэлхийлдэг": ["compass", "eye"],

    "Урам зориг өгдөг": ["sparkle", "sun"],
    "Урам өгдөг": ["sparkle", "lightbulb"],
    "Хүмүүсийг ойлгодог": ["users", "heart"],

    Найдвартай: ["shield", "check-circle"],
    Тууштай: ["target", "shield"],
    Зарчимтай: ["check-circle", "shield"],
    "Итгэл даадаг": ["check-circle", "shield"],

    Нийтэч: ["users", "hand-waving"],
    "Зохион байгуулагч": ["check-circle", "gear"],
    "Зохион байгуулдаг": ["check-circle", "gear"],

    "Эрч хүчтэй": ["lightning", "rocket"],
    Нээлттэй: ["flower-lotus", "users"],

    "Хурдан сэтгэдэг": ["lightning", "brain"],
    Санаачлагч: ["rocket", "lightbulb"],

    "Ажил хэрэгч": ["gear", "check-circle"],
    Шуурхай: ["lightning", "flag"],
    "Эрсдэлд тайван": ["shield", "compass"],

    Зоримог: ["flag", "rocket"],
    "Нөхцөлд дасан зохицдог": ["rocket", "gear"],

    Эерэг: ["smiley", "sparkle"],
    "Амьд мэдрэмжтэй": ["confetti", "sparkle"],
  };

  const candidates = map[strength];

  if (!candidates) {
    throw new Error(`Missing icon mapping for strength: ${strength}`);
  }

  return candidates;
}

export function getUniqueTraitIconKeys(strengths: string[]) {
  const used = new Set<string>();

  return strengths.slice(0, 3).map((strength) => {
    const candidates = getTraitIconCandidates(strength);

    const picked = candidates.find((icon) => !used.has(icon)) ?? candidates[0];

    used.add(picked);

    return picked;
  });
}
