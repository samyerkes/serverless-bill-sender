'use strict';

const AWS = require('aws-sdk');
const CostExplorer = new AWS.CostExplorer({apiVersion: '2017-10-25', region: 'us-east-1'});
const SNS = new AWS.SNS({apiVersion: '2010-03-31', region: 'us-east-1'});
const SNSTopic =  process.env.SNSTOPIC;

const moment = require('moment');
const dateFormat = 'YYYY-MM-DD';
const startOfMonth = moment().startOf('month').format(dateFormat);
const today = moment().format(dateFormat);

module.exports.bill = (event, context, callback) => {

  function getCost() {
    return CostExplorer.getCostAndUsage({
      TimePeriod: { /* required */
        End: today, /* required */
        Start: startOfMonth /* required */
      },
      Granularity: 'MONTHLY',
      Metrics: [
          'AmortizedCost'
      ]
    }).promise();
  }
  
  function sendSNS(cost) {
    let amount = cost.ResultsByTime[0].Total.AmortizedCost.Amount;
    let message = `You've spent $${parseFloat(amount).toFixed(2)} so far on AWS this month.`;
    return SNS.publish({
      Message: message,
      TopicArn: SNSTopic
    }).promise();
  }

  return getCost().then(cost => sendSNS(cost));
};
