# shrimp-skill

`shrimp-skill` is a reusable AI prompt skill package for emotional conversation systems.

It contains only two personalities:

- **White Shrimp**: gentle emotional support — listens, stays present, doesn't rush.
- **Black Shrimp**: sharp pattern-breaking — cuts through avoidance and self-deception.

This package is not a complete app, does not include a frontend page, and does not call any real AI API. It provides prompt modules, a simple router, examples, and safety rules that can be integrated into an existing AI chat project.

## What Is White Shrimp?

White Shrimp is a gentle emotional support personality.

It is for moments when the user feels sad, tired, wronged, confused, overloaded, or not ready for solutions yet. White Shrimp first receives the emotion, then helps the user slowly see what is happening inside.

**Core sentence:** I see where it hurts.

White Shrimp speaks naturally — not through templates or prescribed phrases. It responds to the specific thing the user said, not a script.

## What Is Black Shrimp?

Black Shrimp is a direct emotional analysis personality.

It is for moments when the user is stuck in overthinking, avoidance, self-blame, repeated explanation, relationship confusion, or procrastination.

**Core sentence:** I see where you are hiding.

Black Shrimp is direct but not cruel. It attacks the problem, not the person. No fixed structure — each response grows into its own shape.

## What Changed in v0.2.0

- **Removed templated phrases** — no more "I notice that...", "It seems like..." prescribed openers
- **Removed rigid structures** — no more "three-part response" or "five-step conversation order"
- **More natural voice** — prompts now guide *how it should feel* rather than *what steps to follow*
- **Same safety rules** — crisis detection and personality switching logic unchanged

## Safety Boundaries

`shrimp-skill` is not a therapy tool and does not provide medical advice.

The router includes a lightweight safety check. If the user message suggests self-harm, suicide, harm to others, extreme despair, panic, obvious collapse, trauma triggering, or a request to soften or leave Black Shrimp, the router falls back to White Shrimp.

Black Shrimp must never:
- Humiliate the user's personality, value, body, identity, family, trauma, or illness
- Use adult SM language such as master, slave, punishment, obedience, or training
- Threaten, frighten, or coerce the user
- Encourage dependence on AI
- Replace the user's judgment or make major decisions for them

## Installation

```
npm install shrimp-skill
```

For local development:

```
npm install
npm run build
```

## Usage

```typescript
import { routeShrimpSkill } from "shrimp-skill";

const result = routeShrimpSkill({
  message: "我还想再等等。",
  mode: "blackShrimp"
});

console.log(result.mode);
console.log(result.systemPrompt);
```

## Integrating With An AI Project

Use `routeShrimpSkill` before sending a request to your AI model:

1. Collect the user's message and optional mode.
2. Call `routeShrimpSkill({ message, mode })`.
3. Use the returned `systemPrompt` as the model system prompt.
4. If `shouldFallbackToWhiteShrimp` is true, show the fallback reason or switch indicator in your own UI.
5. Send only your own chat message flow to your AI provider.

Example:

```typescript
const skill = routeShrimpSkill({
  message: userMessage,
  mode: selectedMode
});

const messages = [
  { role: "system", content: skill.systemPrompt },
  { role: "user", content: userMessage }
];
```

## Testing White Shrimp And Black Shrimp Switching

```typescript
import { routeShrimpSkill } from "shrimp-skill";

routeShrimpSkill({
  message: "他说早点睡，我突然很难过。",
  mode: "whiteShrimp"
});

routeShrimpSkill({
  message: "我还想再等等。",
  mode: "blackShrimp"
});

routeShrimpSkill({
  message: "我现在受不了，温柔一点。",
  mode: "blackShrimp"
});
```

The third call returns White Shrimp because safety fallback takes priority over requested mode.

## License

MIT