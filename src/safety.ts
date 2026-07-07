import type { ShrimpSafetyResult } from "./types";

const exitBlackShrimpKeywords = [
  "温柔一点",
  "别这样",
  "我不想要黑虾",
  "切回白虾",
  "退出黑虾",
  "我现在受不了",
  "别这样说",
  "我不想要这个模式",
  "退出",
  "切回小虾",
  "你太凶了"
];

const crisisKeywords = [
  "自杀",
  "不想活",
  "活不下去",
  "想死",
  "去死",
  "结束生命",
  "伤害自己",
  "自残",
  "割腕",
  "吞药",
  "跳楼",
  "杀了",
  "弄死",
  "报复",
  "伤害别人",
  "崩溃",
  "撑不住",
  "受不了了",
  "绝望",
  "惊恐",
  "恐慌",
  "喘不过气",
  "创伤",
  "ptsd",
  "PTSD"
];

export const WHITE_SHRIMP_EXIT_FALLBACK_MESSAGE = "好。黑虾退下。现在换白虾陪你慢慢说。";
export const WHITE_SHRIMP_CRISIS_FALLBACK_MESSAGE = "停。现在不审了。你已经过载了。换白虾接住你。";

export function checkShrimpSafety(input: string): ShrimpSafetyResult {
  if (containsAny(input, exitBlackShrimpKeywords)) {
    return {
      shouldFallbackToWhiteShrimp: true,
      reason: WHITE_SHRIMP_EXIT_FALLBACK_MESSAGE
    };
  }

  if (containsAny(input, crisisKeywords)) {
    return {
      shouldFallbackToWhiteShrimp: true,
      reason: WHITE_SHRIMP_CRISIS_FALLBACK_MESSAGE
    };
  }

  return {
    shouldFallbackToWhiteShrimp: false
  };
}

function containsAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}
