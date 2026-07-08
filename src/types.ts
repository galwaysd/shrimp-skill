export type ShrimpMode = "whiteShrimp" | "blackShrimp";

export interface ShrimpInput {
  message: string;
  mode?: ShrimpMode;
}

export interface ShrimpOutput {
  mode: ShrimpMode;
  systemPrompt: string;
  shouldFallbackToWhiteShrimp?: boolean;
  fallbackReason?: string;
}

export interface ShrimpSafetyResult {
  shouldFallbackToWhiteShrimp: boolean;
  reason?: string;
}

export interface ShrimpSkill {
  mode: ShrimpMode;
  name: string;
  description: string;
  systemPrompt: string;
}
