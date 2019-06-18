workflow "New workflow" {
  on = "push"
  resolves = ["Install"]
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
