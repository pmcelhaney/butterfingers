let keytar;
try {
  keytar = require('keytar'); // eslint-disable-line import/no-unresolved
} catch (ex) {
  keytar = null;
}
const request = require('request');
const readline = require('readline');

require('dotenv').config();

const JIRA_SERVER = 'jira.sungardomni.com';
const user = process.env.JIRA_API_USERNAME;
const query = `status%20not%20in%20(closed%2C%20Cancelled%2C%20Open)%20and%20assignee%20%3D%20${user}%20and%20project%20%3D%20%27UA%27`;

let pass;


if (keytar) {
  pass = keytar.getPassword(JIRA_SERVER, user);
}

function getMyActiveIssues () {
  if (!pass) {
    return promptForPassword().then(getMyActiveIssues);
  }
  return new Promise((resolve, reject) => {
    const url = `https://${user}:${pass}@${JIRA_SERVER}/rest/api/2/search?jql=${query}&fields=status,description,summary`;
    request(url, (error, response, body) => {
      if (response.statusCode === 401 || response.statusCode === 403) {
        resolve(promptForPassword().then(getMyActiveIssues));
      } else if (response.statusCode === 200) {
        resolve(JSON.parse(body).issues);
      } else {
        reject(`Jira responded with HTTP status code ${response.statusCode}`);
      }
    });
  });
}

function promptForPassword () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(`Please enter password for ${user}@${JIRA_SERVER}: `, (password) => {
      rl.close();
      if (password) {
        pass = password;
        if (keytar) {
          keytar.replacePassword(JIRA_SERVER, process.env.JIRA_API_USERNAME, password);
        }
        resolve();
      } else {
        reject();
      }
    });
  });
}

module.exports = {
  getMyActiveIssues,
};
