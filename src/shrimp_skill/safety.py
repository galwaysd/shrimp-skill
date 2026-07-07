"""安全检查模块 - 从 shrimp-skill TypeScript 包移植"""

EXIT_FALLBACK_MESSAGE = "好。黑虾退下。现在换白虾陪你慢慢说。"
CRISIS_FALLBACK_MESSAGE = "停。现在不审了。你已经过载了。换白虾接住你。"

# 退出黑虾的关键词
EXIT_KEYWORDS = [
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
    "你太凶了",
]

# 危机关键词
CRISIS_KEYWORDS = [
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
    "PTSD",
]


def _contains_any(text: str, keywords: list[str]) -> bool:
    """检查文本是否包含任意关键词"""
    return any(keyword in text for keyword in keywords)


def check_safety(message: str) -> dict:
    """
    安全检查
    返回: {"should_fallback": bool, "reason": str | None}
    """
    if _contains_any(message, EXIT_KEYWORDS):
        return {"should_fallback": True, "reason": EXIT_FALLBACK_MESSAGE}

    if _contains_any(message, CRISIS_KEYWORDS):
        return {"should_fallback": True, "reason": CRISIS_FALLBACK_MESSAGE}

    return {"should_fallback": False, "reason": None}