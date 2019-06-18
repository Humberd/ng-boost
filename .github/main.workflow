workflow "New workflow" {
  on = "push"
  resolves = [
    "Install",
    "Test",
  ]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "ci"
}

action "Build" {
  needs = "Install"
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = ["run", "build-lib:ci"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
}

action "Test" {
  uses = "./.github/node-chrome"
  needs = ["Build"]
  runs = "sh -c"
  args = "npm run test-lib:ci"
}
