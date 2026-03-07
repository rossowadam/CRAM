# Branch Naming/Strategy Convention
This project uses a simple, consistent branching format to make branch names and intentions easy to understand on first glance.

## Branch Naming

### Format:

`type`/`issue number`-`short description`

Branch names must be lower-case and not include any spaces. 

`type` is always followed by a forward slash.

A forward slash `/` must always be followed by the corresponding issue number that this branch is addressing.

All other conjunctions must be separated by a dash `-`.

---

## Types

`feature`: This branch finalizes a feature once all corresponding subtasks are completed.

`subtask`: This branch implements a subtask of a feature.

`bugfix`: This branch fixes existing bugs and does not introduce new features.

`refactor`: This branch improves or reorganizes code without changing functionality.

`chore`: This branch deals with any kind of maintenance tasks that don't add features or fix bugs.

---
## Examples
`subtask`/`41`-`landing-page-theming`

`bugfix`/`60`-`auth-email`

`refactor`/`55`-`simplify-database-queries`

--- 

## Branching Strategy

### Subtask Workflow
`development` -> `subtask` -> merge into `development`
* Subtask branches are short-lived and focused on one specific task.
* Each subtask is merged back into `development` when complete.

### Cleanup Feature Branch (Optional)
Once all subtasks for a feature are complete:
`development` -> `feature` -> merge back into `development`
* This is a temporary branch used only for finalzing a feature.
* Subtasks are not merged into this branch, they should remain in development.
* After this branch is complete, `feature` is merged back into `development`.

### Merging to Main
* When the `development` branch is stable and all planned features are complete, `development` is merged into `main`.

