module.exports = createStatementData;

function createStatementData(invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    statementData.totalAmount = totalAmount(statementData);
    return statementData;

    function enrichPerformance(perf) {
        const calculator = new PerformanceCalculator(perf, playFor(perf));
        let result = Object.assign({}, perf);
        result.play = playFor(result);
        result.amount = calculator.amount;
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        // add volume credits
        result += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 5);

        return result;
    }
}

class PerformanceCalculator {
    constructor(perf, play) {
        this.performance = perf;
        this.play = play;
    }

    get amount() {
        let result = 0;

        switch (this.play.type) {
            case 'tragedy':
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknow type: ${this.play.type}`);
        }
        return result;
    }
}
