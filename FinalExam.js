/**
 *   @author Lee Marshall (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');
const NAME = 0, GOOD = 1, BAD = 2, HOURS = 3, RATE = 4;
let continueResponse;
let operators = [], daily = [];




function main() {
    loadOperatorData();
    console.log(operators);
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    console.log(`\x1Bc`);
    while (continueResponse === 0) {
        let action = -1;
        switch (chooseAction(action)) {
            case 1: setOperator();
                break;
            case 2: viewDaily();
                break;
            case 3: viewTotal();
                break;
            case 4: addOperator();
                break;
            case 5: continueResponse = 1;
                break;
        }
    }console.log(operators);
    mergeData();
    console.log(operators);

    //writeOperatorData();



}
main();

function chooseAction(action) {
    while (action !== 1 && action !== 2 && action !== 3 && action !== 4 && action !== 5){
        action = Number(PROMPT.question(
            `\n\tWhat would you like to do?
            1) Enter daily statistics  
            2) view daily operator statistics
            3) View job total statistics
            4) Add new operator
            5) Quit
            Please enter value: `));
    }
    return action;
}

function mergeData() {
    const MAX = 4;
    for (let i = 0; i < daily; i++){
        for (let j = 1; j < MAX; j++){
            operators[i][j] = operators[i][j] + daily[i][j]
        }
    }
}

function addOperator(){

    let l = daily.length;
    daily[l] = [];
    while (!daily[l][NAME] || !/^[a-zA-Z -]{1,30}$/.test(daily[l][NAME])) {
        daily[l][NAME] = PROMPT.question(`Please enter new operators name: `);
        if (!/^[a-zA-Z -]{1,30}$/.test(daily[l][NAME])) {
            console.log(`${daily[l][NAME]} is invalid. Please try again.`);
        }
    }
    let name = daily[l][NAME];
    enterDaily(l, name);
    pushData(l);
}

function setOperator() {
    let oper;
    const MIN = 1;
    let l = daily.length;
    daily.push([]);
    console.log(`\x1Bc`);
    console.log();
    for (let i = 0; i < operators.length; i++){
        console.log(` ${i + 1}) ${operators[i][NAME]}`)
    }
    while (! oper || oper < MIN || oper > operators.length || !/[0-9]/.test(oper)){
        oper = Number(PROMPT.question(`\n Select operator: `));
        if (! oper || oper < MIN || oper > operators.length || !/[0-9]/.test(oper)){
            console.log(` not a valid option, please try again.`);
        }
    }
    oper--;
    let name = operators[oper][NAME];
    daily[l][NAME] = name;
    enterDaily(l, name);

}

function enterDaily(l, name) {
    const MIN = 0, PTMAX = 400, HRMAX = 14;
    while (! daily[l][GOOD] || daily[l][GOOD] < MIN + 1|| daily[l][GOOD] > PTMAX || !/[0-9]/.test(daily[l][GOOD])) {
        daily[l][GOOD] = Number(PROMPT.question(`\n Enter number of good parts ${name} made: `));
        if (! daily[l][GOOD] || daily[l][GOOD] < MIN + 1 || daily[l][GOOD] > PTMAX || !/[0-9]/.test(daily[l][GOOD])){
            console.log(`incorrect value, please try again`);
        }
    }

    while (daily[l][BAD] === undefined || daily[l][BAD] < MIN || daily[l][BAD] > PTMAX || !/[0-9]/.test(daily[l][BAD])) {
        daily[l][BAD] = Number(PROMPT.question(`\n Enter number of bad parts ${name} had: `));
        if (daily[l][BAD] === undefined || daily[l][BAD] < MIN || daily[l][BAD] > PTMAX || !/[0-9]/.test(daily[l][BAD])){
            console.log(`incorrect value, please try again`);
        }
    }

    while (! daily[l][HOURS] || daily[l][HOURS] < MIN || daily[l][HOURS] > HRMAX || !/[0-9]/.test(daily[l][HOURS])) {
        daily[l][HOURS] = Number(PROMPT.question(`\n Enter number hours ${name} worked: `));
        if (! daily[l][HOURS] || daily[l][HOURS] < MIN || daily[l][HOURS] > HRMAX || !/[0-9]/.test(daily[l][HOURS])){
            console.log(`incorrect value, please try again`);
        }
    }

    console.log(daily);



}

function pushData(l) {
    operators.push(daily[l]);
}

function viewDaily() {
    if (daily.length === 0){
        console.log(`\x1Bc`);
        console.log(`There are no daily stats to view, enter operator data to view statistics.`)
    }else {
        console.log(`\x1Bc`);
        process.stdout.write(`Operator \tNum good \tNum scrap \tHours worked\tPart/Hour\tScrap % \n========        ========        =========       ============    =========       =======`);
        for (let i = 0; i < daily.length; i++) {
            let partPerHour = daily[i][GOOD] / daily[i][HOURS];
            let scrapRate = ((daily[i][BAD] / (daily[i][GOOD] + daily[i][BAD])) * 100).toFixed(1);
            process.stdout.write(` \n${i + 1}) ${daily[i][NAME]}\t\t${daily[i][GOOD]}\t\t${daily[i][BAD]}\t\t${daily[i][HOURS]}\t\t${partPerHour}\t\t${scrapRate}`);
        }
    }
}

function viewTotal() {
    console.log(`\x1Bc`);
    console.log(operators);
    process.stdout.write(`Num good \tNum scrap \tHours worked\tPart/Hour\tScrap %\t\tCost/Parts\tOperator \n========        =========       ============    =========       =======         =========       ==========`);
    for (let i = 0; i < operators.length; i++) {
        let partPerHour = (operators[i][GOOD] / operators[i][HOURS]).toFixed(1);
        let scrapRate = ((operators[i][BAD] / (operators[i][GOOD] + operators[i][BAD])) * 100).toFixed(1);
        let costPerPart = (operators[i][RATE] / partPerHour).toFixed(2);
        process.stdout.write(` \n  ${operators[i][GOOD]}\t\t  ${operators[i][BAD]}\t\t  ${operators[i][HOURS]}\t\t  ${partPerHour}\t\t ${scrapRate}\t\t  ${costPerPart}\t\t${operators[i][NAME]}`);
    }
}

function loadOperatorData() {
    let operatorFile = IO.readFileSync(`data/operator_data.csv`, 'utf8');
    let lines = operatorFile.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        operators.push(lines[i].toString().split(/,/)); // Makes array MD by pushing data between commas
    }
    for (let i = 0; i < operators.length; i++){
        for (let j = 1;j < operators[i].length; j++){
            operators[i][j] = Number(operators[i][j]);
        }
    }
}

function writeOperatorData() {
    const COLUMNS = 5;
    for (let i = 0; i < operators.length; i++) {
        if (operators[i]) {
            for (let j = 0; j < COLUMNS; j++) {
                if (j < COLUMNS - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${operators[i][j]},`);
                } else if (i < clientsWeekly.length - 1) {
                    IO.appendFileSync(`data/dataX.csv`, `${operators[i][j]}\n`);
                } else {
                    IO.appendFileSync(`data/dataX.csv`, `${operators[i][j]}`);
                }
            }
        }
    }
    IO.unlinkSync(`data/operator_data.csv`);//deletes file
    IO.renameSync(`data/dataX.csv`, `data/operator_data.csv`);//renames new file with old name
}

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nAre you sure you want to quit? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 0;
    }
}