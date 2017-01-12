<<<<<<< 9713479616bad31e93c03ec47eed336f71490326
=======
#!/usr/bin/env node

>>>>>>> working on "create-pr" command
const VALID_COMMANDS = ['jira', 'create-pr'];

const commandName = process.argv[2];

if (VALID_COMMANDS.indexOf(commandName) > -1) {
  const command = require(`./commands/${commandName}`);
  command();
} else {
  process.stdout.write(`Invalid command: ${commandName}\n`);
}
