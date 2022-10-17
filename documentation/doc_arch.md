# Doc Outline

# Structure
## Side Navigation 
Each one of the following links will take you to the corresponding section of the documentation. It should be a separate page (except for the API reference)
```
Intro
Getting Started
- Token Gating 
- SSX on the Server
- ...other guides
Modules
- Kepler
- Rebase
- Adding Custom Modules
- ...other modules
API Reference
- config
- connect
- sign
- ...other publicly exposed functions
```

## Intro
High level overview of the ssx-sdk. Small code example with link to getting started, modules, and API reference.

## Getting Started
Example project. Perhaps signing in, getting a credential, accessing a user's orbit, storing some data and fetching it.

## Modules
Introduction to the modules available in the ssx-sdk. High level overview of each module with a link
### Module Content
Each module will have a description of the modules purpose, code example(s) using the module and a link to the module's documentation if it exists elsewhere (like rebase docs, or kepler docs)

## API Reference
This is formatted auto-generated docs from the jsdoc in the sdk. The publicly exposed functions that a user will be using should be listed here. Clicking a function here should scroll down to the function description on the api ref page. This should have all the possible parameters, input/return types, and descriptions of what the function does. If there is config, we should describe what each config option does for this function. (in jsdoc)

# Gitbook Configuration
- [configuration docs](https://docs.gitbook.com/integrations/git-sync/content-configuration)
## Connection
- Gitbook syncs with `./docs`
    - these include the static stuff: intro, guides, etc.
- API Reference is generated to `./docs/api.md`
- Gitbook pushes a pr whenever changes are made on the app
- Gitbook updates whenever a change happens in docs on `main`
## Workflows
- API documentation needs to be generated as part of the build process
- Gitbook keeps up with main. We should probably version the docs
- PRs made by Gitbook need to be merged into main
