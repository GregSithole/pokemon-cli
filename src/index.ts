#!/usr/bin/env node
const program = require('commander');

const search = require('./functions/search');

program
    .command('search')
    .description('Search for a Pokémon')
    .action(function () {
        search();
    });

program.parse(process.argv);
