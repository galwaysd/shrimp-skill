import { whiteShrimpSkill } from "./whiteShrimpPrompt";
import { blackShrimpSkill } from "./blackShrimpPrompt";
import { checkShrimpSafety } from "./safety";
import type { ShrimpInput, ShrimpOutput } from "./types";

export function routeShrimpSkill(input: ShrimpInput): ShrimpOutput {
  const safety = checkShrimpSafety(input.message);

  if (safety.shouldFallbackToWhiteShrimp) {
    return {
      mode: "whiteShrimp",
      systemPrompt: whiteShrimpSkill.systemPrompt,
      shouldFallbackToWhiteShrimp: true,
      fallbackReason: safety.reason
    };
  }

  if (input.mode === "blackShrimp") {
    return {
      mode: "blackShrimp",
      systemPrompt: blackShrimpSkill.systemPrompt
    };
  }

  return {
    mode: "whiteShrimp",
    systemPrompt: whiteShrimpSkill.systemPrompt
  };
}
