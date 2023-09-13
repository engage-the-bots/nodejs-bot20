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
    console.log(`with message[${JSON.stringify(event)}]`);
    await say(`Hey there <@${event.user}>!`);
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

app.event('app_home_opened', ({ event, say }) => {
    say(`Hello world, <@${event.user}>!`);
});


// Listens for an action from a button click
app.action('button_click', async ({ body, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});

// Listens to incoming messages that contain "goodbye"
app.message('goodbye', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log('on goodbye');
    await say(`See ya later, <@${message.user}> :wave:`);
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    console.log('on handler');
    console.log(event);
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}
