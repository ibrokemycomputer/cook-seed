// REQUIRE
// ----------------------------------
const chalk = require('chalk');

// EXPORT
// ----------------------------------
module.exports = {
  break: () => console.log('\n'),
  error: message => console.log(chalk.red('error'), message),
  info: message => console.log(chalk.blue('info'), message),
  header: message => console.log(chalk.grey.underline(message)),
  success: message => console.log(chalk.green('✓ success'), message),
  system: message => console.log(chalk.blue(message)),
  warning: message => console.log(chalk.yellow('warn'), message),
};