# Changelog

## v0.2.0 (2026-07-08)

### Changed
- **White Shrimp prompt**: Removed templated phrases ("我注意到...", "你像是...", "也许..." etc.) and rigid "conversation order" (5 steps). Replaced with natural speech guidance: "像一个人坐在对面，不是一段程序在输出".
- **Black Shrimp prompt**: Removed "three-part response structure" (conclusion → exposure → question). Replaced with: "不用三段式，不用固定结构——每句话长成它该长的样子".
- **Examples updated**: All examples rewritten to reflect the new natural style.
- **README updated**: Added "What Changed in v0.2.0" section.

### Removed
- `推荐用语` (recommended phrases) section from White Shrimp
- `允许的表达` (allowed expressions) section from Black Shrimp
- `对话顺序` (conversation order: allow → receive → observe → organize → offer choice)
- `回复结构（三段式）` (three-part response structure)

### Kept
- Core personality definitions (White Shrimp = gentle support, Black Shrimp = sharp analysis)
- Safety rules and fallback logic
- Personality switching rules
- Crisis detection keywords
- Router implementation (unchanged)