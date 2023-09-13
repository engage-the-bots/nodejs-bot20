const { App, AwsLambdaReceiver } = require('@slack/bolt');

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver,
});

app.event('app_mention', async ({ event, say }) => {
    console.log('on event -- app_mention');
    console.log(`with message [${JSON.stringify(event)}]`);
    await say(`Hey there <@${event.user}>!`);
});

// Listens to incoming messages that contain "hello"
app.message('help', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log('on message -- help')
    console.log(`with message [${JSON.stringify(message)}]`);
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Sure! Here are some example mentions I respond to:\n>@me help\n>@me hello\n>@me goodbye"
                }
            }
        ]
    });
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log('on goodbye');
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});

// Listens for an action from a button click
app.action('button_click', async ({ body, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});


app.event('app_home_opened', async ({ event, say }) => {
    console.log('on event -- app_home_opened');
    console.log(`with event [${JSON.stringify(event)}]`);
    await say(`Hello, <@${event.user}>! Try typing 'help' to see what I can do.`);
});

// Listens to incoming messages that contain "goodbye"
app.message('goodbye', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log('on goodbye');
    console.log(`with message [${JSON.stringify(message)}]`);
    await say(`See ya later, <@${message.user}> :wave:`);
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    console.log('on lambda handler');
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}
