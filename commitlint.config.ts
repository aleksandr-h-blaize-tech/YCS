import type { UserConfig } from "@commitlint/types";
const Configuration: UserConfig = {
    /*
     * Resolves and loads `@commitlint/config-conventional` from `node_modules`.
     * Referenced packages should be installed.
     */
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                // Changes that affect the build system or external dependencies (solc, npm).
                "build",
                // Other changes that do not change source and test files.
                "chore",
                /*
                 * Changes to the configuration files and scripts responsible for CI (Continuous Integrations),
                 * i.e. those that affect other developers in the repository (test settings, commit hooks,
                 * GitHub workflows and the like).
                 */
                "ci",
                // Only documentation files have been changed.
                "docs",
                // A new functionality.
                "feat",
                // Bug fixes.
                "fix",
                // A code change that improves performance (cost per gas, in the case of Solidity).
                "perf",
                // A code change which does not fix a bug or add functionality.
                "refactor",
                // Undo a previous commit.
                "revert",
                // Changes which do not affect code (spaces, formatting, etc.).
                "style",
                // Add missing tests or fix existing tests.
                "test",
                // A merger of branches in version control (git).
                "merge"
            ]
        ]
    }
};

module.exports = Configuration;
