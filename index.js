const VALID_COMMANDS = ['jira', 'create-pr'];

const commandName = process.argv[2];

if (VALID_COMMANDS.indexOf(commandName) > -1) {
  const command = require(`./commands/${commandName}`);
  command();
} else {
  process.stdout.write(`Invalid command: ${commandName}\n`);
}
