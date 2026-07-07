"""虾仔人格路由模块 - 从 shrimp-skill TypeScript 包移植"""

from .prompts import WHITE_SHRIMP_PROMPT, BLACK_SHRIMP_PROMPT, COMBINED_SHRIMP_PROMPT
from .safety import check_safety
from .types import ShrimpMode, ShrimpResult


def route_shrimp(
    message: str,
    mode: str = ShrimpMode.WHITE,
) -> ShrimpResult:
    """
    根据用户消息和当前模式，决定使用哪个人格。

    参数:
        message: 用户输入的消息
        mode: 当前模式，whiteShrimp 或 blackShrimp

    返回:
        ShrimpResult 包含路由结果
    """
    # 1. 安全检查优先
    safety = check_safety(message)
    if safety["should_fallback"]:
        return ShrimpResult(
            mode=ShrimpMode.WHITE,
            system_prompt=WHITE_SHRIMP_PROMPT,
            should_fallback=True,
            fallback_reason=safety["reason"],
        )

    # 2. 如果用户明确要求黑虾
    black_triggers = ["黑虾", "犀利一点", "直接说", "别安慰我", "骂醒我"]
    if any(kw in message for kw in black_triggers):
        return ShrimpResult(
            mode=ShrimpMode.BLACK,
            system_prompt=BLACK_SHRIMP_PROMPT,
        )

    # 3. 如果当前是黑虾模式，保持
    if mode == ShrimpMode.BLACK:
        return ShrimpResult(
            mode=ShrimpMode.BLACK,
            system_prompt=BLACK_SHRIMP_PROMPT,
        )

    # 4. 默认白虾
    return ShrimpResult(
        mode=ShrimpMode.WHITE,
        system_prompt=WHITE_SHRIMP_PROMPT,
    )


def get_combined_system_prompt() -> str:
    """获取包含双重人格的组合系统提示词（用于 create_agent）"""
    return COMBINED_SHRIMP_PROMPT