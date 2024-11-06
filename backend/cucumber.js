const test = [
  'integration-tests/features/**/*.feature',
  '--require-module ts-node/register',
  '--require integration-tests/steps/**/*.ts',
  '--require integration-tests/hooks/**/*.ts',
  '--publish-quiet',
].join(' ')

const json = [test, '--format json:integration-tests/report.json'].join(' ')

const html = [test, '--format html:integration-tests/report.html'].join(' ')

module.exports = {
  default: test,
  json,
  html,
}
