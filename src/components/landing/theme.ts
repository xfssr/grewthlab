import type { Tone } from "@/core/site.types";

export function toneOverlay(tone: Tone): string {
  switch (tone) {
    case "gold":
      return "from-[#c9984a]/90 via-[#6b4b24]/40 to-[#1e1a1a]/80";
    case "charcoal":
      return "from-[#393944]/90 via-[#1f1f25]/50 to-[#101013]/85";
    case "bronze":
      return "from-[#8f572b]/85 via-[#5a3a27]/50 to-[#1a1717]/80";
    case "stone":
      return "from-[#8b897f]/85 via-[#6a6760]/50 to-[#222320]/80";
    default:
      return "from-[#6c6c6c]/80 via-[#4a4a4a]/40 to-[#121212]/80";
  }
}
