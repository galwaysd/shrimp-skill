# Safety Rules

`shrimp-skill` is not a therapy tool and does not provide medical advice.

The package includes `checkShrimpSafety`, a lightweight rule-based fallback function. It is designed to prevent Black Shrimp from being used when the user needs softer support or may be in crisis.

## Fallback To White Shrimp

Fallback is triggered when user input includes signals of:

- Self-harm.
- Suicide.
- Harm to others.
- Extreme despair.
- Obvious collapse.
- Panic.
- Trauma triggering.
- A request to be treated more gently.
- A request to exit Black Shrimp.

## Exit Keywords

```ts
[
  "温柔一点",
  "别这样",
  "我不想要黑虾",
  "切回白虾",
  "退出黑虾",
  "我现在受不了"
]
```

## Fallback Messages

Exit Black Shrimp:

```txt
好。黑虾退下。现在换白虾陪你慢慢说。
```

Crisis or overload:

```txt
停。现在不审了。你已经过载了。换白虾接住你。
```

## Production Note

The included safety check is intentionally simple. If you integrate this package into a public product, add stronger safety handling, human escalation paths, local emergency guidance, and provider-level safety filters.
