# Commit Message Convention

This project uses a simple, consistent commit message format to make history readable and useful in the present tense.

Format:

`keyword`: short, clear description

---

## Keywords

`feat`: add a new feature or capability  
`fix`: fix a bug or incorrect behaviour  
`refactor`: change code structure without changing behaviour  
`perf`: improve performance  
`style`: formatting changes, whitespace, linting, no logic changes  
`test`: add or modify tests  
`docs`: documentation only changes  
`chore`: maintenance tasks, tooling, config, dependencies  
`build`: build system or dependency changes  
`ci`: CI/CD configuration or scripts  
`revert`: revert a previous commit

Not all of these will be used, but these capture the major types of commits.

---

## Examples

feat: add user login endpoint  
fix: prevent crash when file list is empty

Reference for Keywords: https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13

---

## Merges

`Merge Commits` will be used for pull requests to any branch besides main. `Squash-and-Merge` is to be used when merging to the main branch. This is to keep the merge history detailed in development, but keep the main branch simplified. That said, uploading meeting minutes can be done straight into the main branch, as it does not affect any functional code.
