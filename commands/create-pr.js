const sh = require('shelljs');
const bitbucketClient = require('../bitbucket-client.js');
const open = require('open');

const REVIEWERS = ['Patrick.McElhaney', 'Tony.Stevanovich', 'Joseph.Sutthoff', 'Justin.Fuller2', 'Rasika.Tandale', 'Ninad.Devadkar'];


function createPullRequestJson() {
  const remotes = getRemotes();

  return {
    'title': getSubjectFromLastCommit(),
    'description': getBodyFromLastCommit(),
    'state': 'OPEN',
    'open': true,
    'closed': false,
    'fromRef': {
      'id': getBranchName(),
      'repository': {
        'slug': remotes.origin.push.slug,
        'name': null,
        'project': {
          'key': remotes.origin.push.project
        }
      }
    },
    'toRef': {
      'id': 'refs/heads/master',
      'repository': {
        'slug': remotes.upstream.fetch.slug,
        'name': null,
        'project': {
          'key': remotes.upstream.fetch.project
        }
      }
    },
    'locked': false,
    'reviewers': getReviewers()
  };
}

function getReviewers() {
  return REVIEWERS.map(r => ({
    user: {
      name: r,
    }
  }));
}

function getSubjectFromLastCommit() {
  return sh.exec('git log --pretty="%s" -n 1', { silent: true }).trim();
}

function getBodyFromLastCommit() {
  return sh.exec('git log --pretty="%b" -n 1', { silent: true }).trim();
}


function getBranchName() {
  return sh.exec('git symbolic-ref HEAD', { silent: true }).trim();
}

function onSuccess(body) {
  open(body.links.self[0].href);
  process.exit();
}

function getRemotes() {
  const remotesData = sh.exec('git remote -v', { silent: true }).trim();
  const remotes = {  };
  remotesData.split('\n').forEach(remoteLine => {
    const [name, value] = remoteLine.split('\t');
    remotes[name] = remotes[name] || {};
    remotes[name] [value.indexOf('(fetch)') > 1 ? 'fetch' : 'push']= parseRemoteValue(value);
  });
  return remotes;
}

function parseRemoteValue(value) {
  const matches = value.match(/([\w.~-]+)\/([\w.~-]+)\.git /);
  return {
    url: value.split(' ')[0],
    slug: matches[2],
    project: matches[1],
  };
}

function onError(errors) {
  process.stdout.write(errors.toString());
  process.exit(1);
}

function execute() {
  bitbucketClient.createPullRequest(createPullRequestJson()).then(onSuccess, onError);
}

module.exports = execute;
