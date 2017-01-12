# Butterfingers

A collection of scripts that help me get more done without leaving the command line.


## Installation and Usage

npm install --save-dev git+https://Patrick.McElhaney@services.sungard.com/git/scm/wruxp/butterfingers.git#master

Add commands to package.json:

```json
"scripts": {
   "pr": "bf create-pr"
}
```

### Create a pull request

Type `npm run pr` to create a pull request.

It should create a pull request from your branch to master the target repo, add reviewers, and open
the pull request in Bitbucket, provided that:

- The target repository is linked to "upstream"
- The source repository is linked to "origin"
- The source repo has a branch matching the name of your current branch (i.e. you've pushed your changes)
