module.exports = createStatementData;

function createStatementData(invoice, plays) {
        let statementData = {};
        statementData.customer = invoice.customer;
        statementData.performances = invoice.performances.map(enrichPerformance);
        statementData.totalVolumeCredits = totalVolumeCredits(statementData);
        statementData.totalAmount = totalAmount(statementData);
        return statementData;

        function enrichPerformance(perf) {
            let result = Object.assign({}, perf);
            result.play = playFor(result);
            result.amount = amountFor(result);
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

        function amountFor(perf) {
            let result = 0;

            switch (perf.play.type) {
                case 'tragedy':
                    result = 40000;
                    if (perf.audience > 30) {
                        result += 1000 * (perf.audience - 30);
                    }
                    break;
                case 'comedy':
                    result = 30000;
                    if (perf.audience > 20) {
                        result += 10000 + 500 * (perf.audience - 20);
                    }
                    result += 300 * perf.audience;
                    break;
                default:
                    throw new Error(`unknow type: ${perf.play.type}`);
            }

            return result;
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
