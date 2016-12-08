const jiraClient = require('./jira-client.js');
const inquirer = require('inquirer');
const open = require('open');


require('dotenv').config();

function execute() {
  jiraClient.getMyActiveIssues()
    .then(selectAnIssue)
    .then(openIssue);
}

function selectAnIssue(issues) {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'issueKey',
      message: 'Select a Jira issue. (If you don\'t see your issue, make sure it\'s assigned to you and in progress.):\n',
      choices: issues.map(issue => ({
        name: `${issue.key}: ${issue.fields.summary} (${issue.fields.status.name})`,
        value: issue.key,
      })),
    }
  ]).then(answers => answers.issueKey);
}

function openIssue(issueKey) {
  console.log(`${process.env.JIRA_BASE_URL}/browse/${issueKey}`);
  open(`${process.env.JIRA_BASE_URL}/browse/${issueKey}`);
}

module.exports = execute;
