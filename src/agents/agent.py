"""虾仔（Shrimp）Agent - 双人格情感对话系统

基于 shrimp-skill 包（github:galwaysd/shrimp-skill）的 Python 实现。
"""

import os
import json
import logging
from typing import Annotated, Optional

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState
from langgraph.graph.message import add_messages
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage
from langchain.tools import tool
from coze_coding_utils.runtime_ctx.context import default_headers

from storage.memory.memory_saver import get_memory_saver
from shrimp_skill.router import route_shrimp, get_combined_system_prompt
from shrimp_skill.types import ShrimpMode

logger = logging.getLogger(__name__)

LLM_CONFIG = "config/agent_llm_config.json"

# 默认保留最近 20 轮对话 (40 条消息)
MAX_MESSAGES = 40

# 当前人格模式（用于会话中保持状态）
# 可选值: "whiteShrimp", "blackShrimp"
_current_mode: str = ShrimpMode.WHITE


def _windowed_messages(old, new):
    """滑动窗口: 只保留最近 MAX_MESSAGES 条消息"""
    return add_messages(old, new)[-MAX_MESSAGES:]  # type: ignore


class AgentState(MessagesState):
    messages: Annotated[list[AnyMessage], _windowed_messages]


@tool
def switch_personality(personality: str) -> str:
    """切换虾仔的人格模式。仅在用户明确要求切换时使用。

    Args:
        personality: 人格名称，可选值为 "whiteShrimp"（白虾，温柔模式）或 "blackShrimp"（黑虾，犀利模式）
    """
    global _current_mode
    if personality == "blackShrimp":
        _current_mode = ShrimpMode.BLACK
        return "已切换到黑虾模式。"
    else:
        _current_mode = ShrimpMode.WHITE
        return "已切换到白虾模式。"


def build_agent(ctx=None):
    global _current_mode
    _current_mode = ShrimpMode.WHITE  # 每次构建重置为默认

    workspace_path = os.getenv("COZE_WORKSPACE_PATH", "/workspace/projects")
    config_path = os.path.join(workspace_path, LLM_CONFIG)

    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)

    api_key = os.getenv("COZE_WORKLOAD_IDENTITY_API_KEY")
    base_url = os.getenv("COZE_INTEGRATION_MODEL_BASE_URL")

    llm = ChatOpenAI(
        model=cfg["config"].get("model"),
        api_key=api_key,
        base_url=base_url,
        temperature=cfg["config"].get("temperature", 0.7),
        streaming=True,
        timeout=cfg["config"].get("timeout", 600),
        extra_body={
            "thinking": {
                "type": cfg["config"].get("thinking", "disabled")
            }
        },
        default_headers=default_headers(ctx) if ctx else {},
    )

    # 使用组合系统提示词，包含双重人格切换规则
    system_prompt = get_combined_system_prompt()

    return create_agent(
        model=llm,
        system_prompt=system_prompt,
        tools=[switch_personality],
        checkpointer=get_memory_saver(),
        state_schema=AgentState,
    )