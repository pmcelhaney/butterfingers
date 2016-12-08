const VALID_COMMANDS = ['jira'];

const commandName = process.argv[2];

if (VALID_COMMANDS.indexOf(commandName) > -1) {
  const command = require(`./${commandName}`);
  command();
} else {
  console.log(`Invalid command: ${commandName}`);
}
