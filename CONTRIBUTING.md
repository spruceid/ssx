# Contributing.md

## Creating a pull request
Contributors to the ssx monorepo should create a pull request for each change they make. The pull request should be created against the `main` branch. The pull request should be reviewed by at least two other contributors before it is merged.

When creating a pull request, follow the github pull request template. If there is a change to an existing package's API, the pull request should include a changeset entry. If there is a new package, the pull request should include a README.md file.

### Using changesets
When releasing packages, we need to capture the changes since the last release, but the best time to capture the changes is at PR time, when they are fresh. Changesets are used to manage the versioning of packages in the SSX monorepo. Before a new release is cut, changesets are aggregated and compiled into relevant changelogs with references to the commit where the change occurred. When making changes to a package's API, contributors should add a changeset to their pull request. The changeset should describe the changes to the API, and the type of change (major, minor, or patch). 

In a PR, you can add a changeset by running `yarn changeset` in the root of the repo. This will prompt you to select the packages that have changed, the type of change (`'major' | 'minor' | 'patch'`), and the change description. It will then create a changeset file in the `.changeset` directory. You can then commit and push the changeset file to your branch.

For more information on changesets, see the changesets [intro](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) and [detailed explanation](https://github.com/changesets/changesets/blob/main/docs/detailed-explanation.md)

#### Releasing
When releasing with changesets, there are two simple commands:
- `yarn changeset version`: This will bump the versions of packages that have changesets, and create a new changeset file with the new versions. This should be run before a release is cut.
- `yarn changeset publish`: This will publish the packages to npm, and create a new git tag for the release. This should be run after a release is cut.

