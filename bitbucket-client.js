let keytar;
try {
  keytar = require('keytar'); // eslint-disable-line import/no-unresolved
} catch (ex) {
  keytar = null;
}
const request = require('request');
const readline = require('readline');

require('dotenv').config();

const SERVER = 'services.sungard.com';
const user = process.env.JIRA_API_USERNAME;

let pass;

if (keytar) {
  pass = keytar.getPassword(SERVER, user);
}

function createPullRequest (pullRequest) {

  if (!pass) {
    return promptForPassword().then(createPullRequest);
  }
  return new Promise((resolve, reject) => {

    const url = `https://${user}:${pass}@${SERVER}/git/rest/api/1.0/projects/WRUX/repos/trust-unity/pull-requests`;

    request({
      url,
      method: 'post',
      json: true,
      body: pullRequest
    }, (error, response, body) => {
      if (error) {
        reject(error);
      }
      if (response.statusCode === 401 || response.statusCode === 403) {
        resolve(promptForPassword().then(createPullRequest));
      } else if (response.statusCode === 200) {
        resolve(JSON.parse(body).issues);
      } else {
        if (response.body && response.body.errors) {
          reject(response.body.errors.map(m => m.message));
        } else {
          reject(`Bitbucket responded with HTTP status code ${response.statusCode}`);
        }
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
    rl.question(`Please enter password for ${user}@${SERVER}: `, (password) => {
      rl.close();
      if (password) {
        pass = password;
        if (keytar) {
          keytar.replacePassword(SERVER, process.env.JIRA_API_USERNAME, password);
        }
        resolve();
      } else {
        reject();
      }
    });
  });
}

module.exports = {
  createPullRequest,
};
