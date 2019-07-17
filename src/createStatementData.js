module.exports = createStatementData;

function createStatementData(invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    statementData.totalAmount = totalAmount(statementData);
    return statementData;

    function enrichPerformance(perf) {
        const calculator = createPerformanceCalculator(perf, playFor(perf));
        let result = Object.assign({}, perf);
        result.play = playFor(result);
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
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

    function createPerformanceCalculator(perf, play) {
        switch (play.type) {
            case 'tragedy':
                return new TragedyCalculator(perf, play);
            case 'comedy':
                return new ComedyCalculator(perf, play);
            default:
                throw new Error(`unknow type: ${play.type}`);
        }
    }
}

class PerformanceCalculator {
    constructor(perf, play) {
        this.performance = perf;
        this.play = play;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}
