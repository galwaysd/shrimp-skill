from typing import Optional


class ShrimpMode:
    WHITE = "whiteShrimp"
    BLACK = "blackShrimp"


class ShrimpResult:
    """路由结果"""
    def __init__(
        self,
        mode: str,
        system_prompt: str,
        should_fallback: bool = False,
        fallback_reason: Optional[str] = None,
    ):
        self.mode = mode
        self.system_prompt = system_prompt
        self.should_fallback = should_fallback
        self.fallback_reason = fallback_reason