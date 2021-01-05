# Serverless Bill Sender

The following will make a request to get the current month's AWS bill (month to date) and send it to an AWS SNS Topic.

## Local testing

```bash
$ serverless invoke local -f bill
```

## To deploy

```bash
$ serverless deploy
```