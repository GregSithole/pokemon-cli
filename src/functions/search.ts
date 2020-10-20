import { AxiosError, AxiosResponse } from 'axios';

const inquirer = require('inquirer');
const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table');
const chalk = require('chalk');
const _ = require('lodash');

function runSearch(answers: any) {
    const searchLoading = ora().start(`Beginning to search for Pokémon...`);
    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${answers.name.toLowerCase()}`)
        .then(function (response: AxiosResponse) {
            searchLoading.succeed(
                `Successfully found Pokémon: ${answers.name}`
            );
            const result = displayPokemon(response.data);
            console.log(result.toString());
        })
        .catch(function (error: AxiosError) {
            searchLoading.fail(`We could not find the Pokémon`);
            console.log(error);
        });
}

function displayPokemon(result: any) {
    const displayedTable = new Table();
    displayedTable.push(
        {
            [`${chalk.green.bold('ID')}`]: result.id,
        },
        {
            [`${chalk.green.bold('Name')}`]: _.upperFirst(result.name),
        },
        {
            [`${chalk.green.bold('Type')}`]: _.join(
                _.map(result.types, (type: any) => {
                    return _.capitalize(type.type.name);
                }),
                ', '
            ),
        },
        {
            [`${chalk.green.bold('Abilities')}`]: _.join(
                _.map(result.abilities, (abilities: any) => {
                    return _.capitalize(abilities.ability.name);
                }),
                ', '
            ),
        },
        {
            [`${chalk.green.bold('Weight')}`]: result.weight / 10 + `kg`,
        }
    );

    return displayedTable;
}

module.exports = () => {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Please enter a Pokémon Name or ID:',
        },
    ];

    const prompt = inquirer.createPromptModule();

    prompt(questions).then((answers: any) => {
        runSearch(answers);
    });
};
