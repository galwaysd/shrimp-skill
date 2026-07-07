# Integration Guide

`shrimp-skill` provides prompt skills and routing. It does not call an AI API directly.

## Basic Flow

1. Receive the user message.
2. Read the selected mode from your product state.
3. Call `routeShrimpSkill`.
4. Use the returned `systemPrompt` as your model system prompt.
5. Send the user's message through your existing AI provider.

```ts
import { routeShrimpSkill } from "shrimp-skill";

const skill = routeShrimpSkill({
  message: userMessage,
  mode: selectedMode
});

const messages = [
  { role: "system", content: skill.systemPrompt },
  { role: "user", content: userMessage }
];
```

## Mode Selection

Use only these modes:

```ts
type ShrimpMode = "whiteShrimp" | "blackShrimp";
```

Do not add extra personalities inside this package. If your host app has other modes, keep them outside `shrimp-skill`.

## Safety Priority

Safety fallback takes priority over requested mode.

If a user asks for Black Shrimp but the message contains a crisis or exit signal, the router returns White Shrimp:

```ts
const result = routeShrimpSkill({
  message: "我现在受不了，温柔一点。",
  mode: "blackShrimp"
});

console.log(result.mode); // "whiteShrimp"
console.log(result.shouldFallbackToWhiteShrimp); // true
console.log(result.fallbackReason);
```

## Integrating With Existing Xiao Xia Projects

In an existing Xiao Xia chat project, keep the UI and API code in the host project. Use this package only to select the system prompt:

- White Shrimp is the default support mode.
- Black Shrimp should be user-selected.
- Any safety fallback should switch back to White Shrimp.
- The host project remains responsible for memory, chat history, model calls, and display.
