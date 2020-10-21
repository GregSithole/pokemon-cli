#!/usr/bin/env node
const program = require('commander');

const search = require('./functions/search');

program
    .command('search')
    .arguments('[name]')
    .description('Search for a Pokémon')
    .action(function (name: string) {
        search(name);
    });

program.parse(process.argv);
