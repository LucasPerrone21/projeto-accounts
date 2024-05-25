const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");

console.log(chalk.green("Olá, seja bem-vindo ao Banco Accounts!"));

operations();

function operations() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "O que deseja fazer?",
                choices: [
                    "Criar conta",
                    "Consultar saldo",
                    "Depositar",
                    "Sacar",
                    "Sair",
                ],
            },
        ])
        .then((answers) => {
            const action = answers.action;
            if (action === "Criar conta") {
                createAccount();
            }
            if (action === "Consultar saldo") {
                checkBalance();
            }
            if (action === "Depositar") {
                deposit();
            }
            if (action === "Sacar") {
                withdraw();
            }
            if (action === "Sair") {
                console.log(chalk.green("Obrigado por usar o Banco Accounts!"));
                return;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function createAccount() {
    console.log(chalk.yellow("Vamos criar sua conta!"));

    inquirer
        .prompt([
            {
                name: "accountName",
                message: "Digite o nome da conta:",
            },
        ])
        .then((answer) => {
            const account = {
                accountName: answer.accountName,
                balance: 0,
            };

            if (!fs.existsSync("./accounts.json")) {
                fs.writeFileSync("./accounts.json", JSON.stringify([account]));
            } else {
                const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i].accountName === account.accountName) {
                        console.log(
                            chalk.red("Já existe uma conta com esse nome!")
                        );
                        return operations();
                    }
                }
                accounts.push(account);
                fs.writeFileSync("./accounts.json", JSON.stringify(accounts));
                console.log(chalk.green("Conta criada com sucesso!"));
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function checkBalance() {
    console.log(chalk.yellow("Vamos consultar seu saldo!"));

    inquirer
        .prompt([
            {
                name: "accountName",
                message: "Digite o nome da conta:",
            },
        ])
        .then((answer) => {
            const accountName = answer.accountName;
            const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].accountName === accountName) {
                    console.log(
                        chalk.green(`Seu saldo é R$ ${accounts[i].balance}`)
                    );
                    return operations();
                }
            }
            console.log(chalk.red("Conta não encontrada!"));
            return operations();
        })
        .catch((err) => {
            console.log(err);
        });
}

function deposit() {
    console.log(chalk.yellow("Vamos fazer um depósito!"));

    inquirer
        .prompt([
            {
                name: "accountName",
                message: "Digite o nome da conta:",
            },
            {
                name: "amount",
                message: "Digite o valor do depósito:",
            },
        ])
        .then((answer) => {
            const accountName = answer.accountName;
            const amount = parseFloat(answer.amount);
            if (isNaN(amount) || amount <= 0) {
                console.log(chalk.red("Digite um valor válido!"));
                return operations();
            }
            const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].accountName === accountName) {
                    accounts[i].balance += amount;
                    fs.writeFileSync(
                        "./accounts.json",
                        JSON.stringify(accounts)
                    );
                    console.log(chalk.green("Depósito realizado com sucesso!"));
                    return operations();
                }
            }
            console.log(chalk.red("Conta não encontrada!"));
            return operations();
        })
        .catch((err) => {
            console.log(err);
        });
}

function withdraw() {
    console.log(chalk.yellow("Vamos fazer um saque!"));
    inquirer
        .prompt([
            { name: "accountName", message: "Digite o nome da conta:" },
            { name: "amount", message: "Digite o valor do saque:" },
        ])
        .then((answer) => {
            const accountName = answer.accountName;
            const amount = parseFloat(answer.amount);
            if (isNaN(amount) || amount <= 0) {
                console.log(chalk.red("Digite um valor válido!"));
                return operations();
            }
            const accounts = JSON.parse(fs.readFileSync("./accounts.json"));
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].accountName === accountName) {
                    if (accounts[i].balance < amount) {
                        console.log(chalk.red("Saldo insuficiente!"));
                        return operations();
                    }
                    accounts[i].balance -= amount;
                    fs.writeFileSync(
                        "./accounts.json",
                        JSON.stringify(accounts)
                    );
                    console.log(chalk.green("Saque realizado com sucesso!"));
                    return operations();
                }
            }
            console.log(chalk.red("Conta não encontrada!"));
            return operations();
        })
        .catch((err) => console.log(err));
}
