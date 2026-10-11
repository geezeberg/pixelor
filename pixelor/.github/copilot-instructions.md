## AI Agent Efficiency and Cost Management

GitHub AI Credits are a limited development resource. Agents MUST minimize unnecessary model usage without compromising correctness.

- Prefer small, clearly scoped tasks over large autonomous implementation sessions.
- Follow GitHub Spec Kit specifications and implementation plans. Do not expand feature scope without explicit authorization.
- Use only the repository context, files, and tools necessary for the current task.
- Prefer deterministic tools, TypeScript compilation, and targeted tests over repeated AI-based verification.
- Do not repeatedly investigate decisions already documented in the constitution, specifications, or implementation plans.
- Avoid unnecessary subagent delegation, parallel agent execution, or repetitive reviews.
- When a task is complete and its acceptance criteria are met, stop.
- When blocked, report the specific blocker rather than repeatedly attempting speculative fixes.
- Recommend escalating to a more capable reasoning model only when task complexity or demonstrated failures justify the additional cost.
- Prefer concise implementation summaries describing changes, tests, and outstanding issues.

The user controls actual model selection and spending limits. These instructions do not authorize agents to increase budgets or select more expensive models automatically.

Prioritize total cost to achieve a correct implementation, not simply the cheapest individual model call.