#!/usr/bin/env node
const program = require('commander');

const search = require('./functions/search');
const list = require('./functions/list');

program
    .command('search')
    .arguments('[name]')
    .description('Search for a Pokémon')
    .action(function (name: string) {
        search(name);
    });

program
    .command('list')
    .arguments('[generation]')
    .description('List Pokémon by a Generation/Region')
    .action(function (name: string) {
        list(name);
    });

program.parse(process.argv);
