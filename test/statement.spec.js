let assert = require('assert');
let statement = require('../src/statement');
let plays = {
    "hamlet": {
        "name": "Hamlet",
        "type": "tragedy"
    },
    "as-like": {
        "name": "As you like it",
        "type": "comedy"
    },
    "othello": {
        "name": "Othello",
        "type": "tragedy"
    }
};

let invoice = {
    "customer": "BigCo",
    "performances": [
        {
            "playID": "hamlet",
            "audience": 55
        },
        {
            "playID": "as-like",
            "audience": 35
        },
        {
            "playID": "othello",
            "audience": 40
        }
    ]
};

describe('statement function', function () {
    it('should create correct statement for BigCo', function () {
        let result = 'Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As you like it: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits \n';
        assert.equal(statement(invoice, plays), result);
    });
});
