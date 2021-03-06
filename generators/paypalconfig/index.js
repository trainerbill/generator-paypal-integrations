'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const pkg = require('../../package.json');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.option('store-all', {
            type: Boolean,
            default: false,
            desc: "Stores all prompts for testing only",
        });

        this.option('force-webhook', {
            type: Boolean,
            default: false,
            desc: "Forces a webhook route",
        });
    }

    prompting() {
        const prompts = [{
            type: 'input',
            name: 'clientid',
            message: 'PayPal REST Client ID',
            store: true,
        },
        {
            type: this.options.storeAll ? 'input' : 'password',
            name: 'clientsecret',
            message: 'PayPal REST Client Secret',
            store: this.options.storeAll,
        },
        {
            type: 'list',
            choices: ["sandbox", "production"],
            name: 'environment',
            message: 'PayPal Environment',
            default: "sandbox",
            store: true,
        },
        {
            type: 'confirm',
            name: 'webhooks',
            message: 'Enable Webhooks?',
            default: false,
            store: true,
            when: !this.options.forceWebhook
        },
        {
            type: 'input',
            name: 'webhookroute',
            message: 'Webhook Route',
            default: "/paypal/webhooks/listen",
            store: true,
            when: (answers) => answers.webhooks || this.options.forceWebhook,
        }];

        return this.prompt(prompts).then(props => {
            this.props = props;
        });
    }

    writing() {

        this.fs.extendJSON(this.destinationPath(".env.development.json"), {
            "PAYPAL_MODE": this.props.environment,
            "PAYPAL_CLIENT_ID": this.props.clientid,
            "PAYPAL_CLIENT_SECRET": this.props.clientsecret,
            "PAYPAL_WEBHOOK_ROUTE": this.props.webhookroute,
        });
    }
};
