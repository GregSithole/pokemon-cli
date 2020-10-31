import { AxiosError, AxiosResponse } from 'axios';

const inquirer = require('inquirer');
const ora = require('ora');
const axios = require('axios');
const Table = require('cli-table');
const chalk = require('chalk');
const _ = require('lodash');
const cliFormat = require('cli-format');

let pokemonGenerations: string[] = [];

function runSearch(answers: any) {
    const searchLoading = ora().start(
        `Beginning to search for Pokémon Generation...`
    );
    const index = _.findIndex(pokemonGenerations, { name: answers.generation });
    axios
        .get(`https://pokeapi.co/api/v2/generation/${index + 1}`)
        .then(function (response: AxiosResponse) {
            searchLoading.succeed(
                `Successfully found Pokémon Generation: ${answers.name}`
            );

            const result = displayGenerationInformation(response.data);
            console.log(result.toString());
        })
        .catch(function (error: AxiosError) {
            searchLoading.fail(`We could not find the Pokémon`);
            console.log(error);
        });
}

function displayGenerationInformation(result: any) {
    const displayedTable = new Table();
    displayedTable.push(
        {
            [`${chalk.green.bold('Generation')}`]: _.upperFirst(result.name),
        },
        {
            [`${chalk.green.bold('Region')}`]: _.upperFirst(
                result.main_region.name
            ),
        },
        {
            [`${chalk.green.bold('List of Pokémon')}`]: cliFormat.wrap(
                _.join(
                    _.map(result.pokemon_species, (pokemon: any) => {
                        return _.capitalize(pokemon.name);
                    }),
                    ', '
                ),
                { width: 100 }
            ),
        }
    );

    return displayedTable;
}

function getGenerationList() {
    return axios
        .get(`https://pokeapi.co/api/v2/generation/`)
        .then(function (response: AxiosResponse) {
            return response.data.results;
        })
        .catch(function (error: AxiosError) {
            console.log(error);
        });
}

module.exports = async (generation: string) => {
    if (!generation) {
        pokemonGenerations = await getGenerationList();
        const questions = [
            {
                type: 'list',
                choices: pokemonGenerations,
                name: 'generation',
                message: 'Please enter a Pokémon Name or ID:',
            },
        ];

        const prompt = inquirer.createPromptModule();

        prompt(questions).then((answers: any) => {
            runSearch(answers);
        });
    } else {
        runSearch({ generation: generation });
    }
};
