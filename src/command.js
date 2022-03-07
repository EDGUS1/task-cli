const { program } = require('commander');
const { prompt } = require('inquirer');

program.version('1.0').description('Task Cli');

program.command('save').action(async () => {
  const respuesta = await prompt([
    {
      type: 'input',
      message: 'Titulo',
      name: 'title',
    },
    {
      type: 'input',
      message: 'Descripción',
      name: 'desc',
    },
    {
      type: 'input',
      message: 'Link',
      name: 'link',
    },
  ]);
  console.log(respuesta);
});

program.parse(process.argv);
