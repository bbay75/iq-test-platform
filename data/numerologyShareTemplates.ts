export type NumerologyShareTemplate = {
  bg: string;
  accent: string;
  accentSoft: string;
};

export const numerologyShareTemplates: Record<number, NumerologyShareTemplate> =
  {
    1: {
      bg: "/images/numerology/share/1.jpg",
      accent: "#f6b84a",
      accentSoft: "#ffd98a",
    },

    2: {
      bg: "/images/numerology/share/2.jpg",
      accent: "#7fc8ff",
      accentSoft: "#c6e7ff",
    },

    3: {
      bg: "/images/numerology/share/3.jpg",
      accent: "#ff6f91",
      accentSoft: "#ffb3c6",
    },

    4: {
      bg: "/images/numerology/share/4.jpg",
      accent: "#a979ff",
      accentSoft: "#d0b7ff",
    },

    5: {
      bg: "/images/numerology/share/5.jpg",
      accent: "#52d7e8",
      accentSoft: "#a8f1f8",
    },

    6: {
      bg: "/images/numerology/share/6.jpg",
      accent: "#ffad78",
      accentSoft: "#ffd0ad",
    },

    7: {
      bg: "/images/numerology/share/7.jpg",
      accent: "#a67cff",
      accentSoft: "#d4c0ff",
    },

    8: {
      bg: "/images/numerology/share/8.jpg",
      accent: "#f6b73c",
      accentSoft: "#ffe09a",
    },

    9: {
      bg: "/images/numerology/share/9.jpg",
      accent: "#d77cff",
      accentSoft: "#efc0ff",
    },

    11: {
      bg: "/images/numerology/share/11.jpg",
      accent: "#b388ff",
      accentSoft: "#dfcaff",
    },

    22: {
      bg: "/images/numerology/share/22.jpg",
      accent: "#c084fc",
      accentSoft: "#e4c6ff",
    },

    33: {
      bg: "/images/numerology/share/33.jpg",
      accent: "#ff9eb5",
      accentSoft: "#ffd0db",
    },
  };

export function getNumerologyShareTemplate(
  lifePath: number,
): NumerologyShareTemplate {
  return numerologyShareTemplates[lifePath] ?? numerologyShareTemplates[1];
}
