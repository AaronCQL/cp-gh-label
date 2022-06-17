# `cp-gh-label`

A small CLI tool to copy labels from a GitHub repository to another.

## Usage

Three arguments are required:

1. **`SRC_REPO`**: in the form `OWNER/REPO`
2. **`DEST_REPO`**: in the form `OWNER/REPO`
3. **`GITHUB_PAT`**: use a [GitHub Personal Access Token](https://github.com/settings/tokens) with the `repo` scope (this token must have read/write access to both the source and destination repositories)

```sh
# Usage:
npx cp-gh-label SRC_REPO DEST_REPO --pat=GITHUB_PAT

# Example:
npx cp-gh-label AaronCQL/cp-gh-label AaronCQL/hello --pat=ghp_XXXXX
```
