/* Slack bolt application boilerplate */
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

let keywordMemeMap = {
    'this-is-fine': { template: '/fine', resourcePathParms: 2, type: '.png', title: 'This is fine', memeString: '`this-is-fine&top&bottom`', exampleImageUrl: 'https://api.memegen.link/images/fine/top/bottom.png'},
    'panik-kalm-panik': { template: '/panik-kalm-panik', resourcePathParms: 3, type: '.png', title: 'Panik Kalm PANIK', memeString: '`panik-kalm-panik&you hear a sound downstairs&It\'s just a cat&you don\'t have a cat`', exampleImageUrl: 'https://api.memegen.link/images/panik-kalm-panik/You_hear_a_sound_downstairs/It\'s_just_a_cat/You_don\'t_have_a_cat.png'},
    'winter-is-coming': { template: '/winter', resourcePathParms: 2, type: '.png', title: 'Winter is coming', memeString: '`winter-is-coming&prepare yourself&winter is coming`', exampleImageUrl: 'https://api.memegen.link/images/winter/prepare_yourself/winter_is_coming.png'},
    'yo-dawg': { template: '/yodawg', resourcePathParms: 2, type: '.png', title: 'Yo dawg', memeString: '`yo-dawg&yo dawg&i heard you like memes`', exampleImageUrl: 'https://api.memegen.link/images/yodawg/yo_dawg/i_heard_you_like_memes.png'},
    'doge': { template: '/doge', resourcePathParms: 2, type: '.png', title: 'Such doge', memeString: '`doge&such meme&very skill`', exampleImageUrl: 'https://api.memegen.link/images/doge/such_meme/very_skill.png'},
    'feels-good': { template: '/feelsgood', resourcePathParms: 2, type: '.png', title: 'Feels good', memeString: '`feels-good&top&bottom`', exampleImageUrl: 'https://api.memegen.link/images/feelsgood/top/bottom.png'},
    'drake': { template: '/drake', resourcePathParms: 2, type: '.png', title: 'Drake', memeString: '`drake&no&yes`', exampleImageUrl: 'https://api.memegen.link/images/drake/no/yes.png'},
    'woman-cat': { template: '/woman-cat', resourcePathParms: 2, type: '.png', title: 'Woman yelling at cat', memeString: '`woman-cat&girls when they see a spider&the spider`', exampleImageUrl: 'https://api.memegen.link/images/woman-cat/girls_when_they_see_a_spider/the_spider.png'},
    'spiderman-pointing': { template: '/spiderman', resourcePathParms: 2, type: '.png', title: 'Spiderman pointing', memeString: '`spiderman-pointing&2 + 2&2 x 2`', exampleImageUrl: 'https://api.memegen.link/images/spiderman/2_+_2/2_x_2.png'},
    // https://api.memegen.link/images/patrick/why_don't_we_take_all_the_memes/and_put_them_on_memegen.png
    // https://api.memegen.link/images/right/Senior_Developer/Junior_Developer/Put_it_in_the_backlog./So_we_can_fix_it_later,_right~q/So_we_can_fix_it_later,_right~q.png
    // https://api.memegen.link/images/dbg/Clicking_the_'X'_on_a_mobile_ad/The_'X'_is_part_of_the_ad.png
    // https://api.memegen.link/images/drowning/Me_Asking_for_Help/Online_Commenter/I'm_having_that_problem_too..png
}

function messageToImageUrl(userMessage) {
    // Parse message into parts
    let userMessageParts = userMessage.split('&amp;').map(function(item) {
        item = item.trim();
        item = item.replace(/ /g, '_');
        return item;
    });
    console.log('Parsing user message into parts -> meme-template and captions')
    console.log(userMessageParts)

    let memeMap = keywordMemeMap[userMessageParts[0]];
    console.log('Using meme:');
    console.log(memeMap);
    if(memeMap && userMessageParts.length > 0 && userMessageParts.length <= memeMap.resourcePathParms + 1) {
        let imageUrl = 'https://api.memegen.link/images';
        console.log('On Image URL Base:');
        console.log(imageUrl);
        imageUrl += memeMap.template;
        console.log('On Image URL Base + template:');
        console.log(imageUrl);
        for(let i = 1; i < userMessageParts.length; i++) {
            let part = userMessageParts[i];
            imageUrl += `/${part}`;
            console.log(`On Image URL resource-path parameter[${i}]:`);
            console.log(imageUrl);
        }
        imageUrl += memeMap.type;
        console.log('On Image URL filetype:');
        console.log(imageUrl);
        return imageUrl;
    } else {
        return null;
    }
}

function imageBlocksBuilder(imageUrl) {
    return {
        blocks: [
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "Memes everywhere",
                    "emoji": true
                },
                "image_url": imageUrl,
                "alt_text": "memes-everywhere"
            }
        ],
    }
}

function buildTemplateOptionSelects() {
    let templateOptions = [];
    for (const [keyword, meme] of Object.entries(keywordMemeMap)) {
        templateOptions.push({
            text: {
                type: 'plain_text',
                text: meme.title
            },
            value: keyword
        });
    }

    return {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "Select a template"
        },
        accessory: {
            type: "static_select",
            optional: false,
            placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true
            },
            options: templateOptions
        }
    }
}

/* Slash command handler */
// Listen for a slash command invocation
app.command('/make', async ({ ack, body, client, logger }) => {
    console.log('on slash command -- make');
    console.log('with body');
    console.log(body);
    // Acknowledge the command request
    await ack();

    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
            // Pass a valid trigger_id within 3 seconds of receiving it
            trigger_id: body.trigger_id,
            // View payload
            view: {
                type: 'modal',
                // View identifier
                callback_id: 'view_1',
                title: {
                    type: 'plain_text',
                    text: 'Post a meme'
                },
                close: { type: "plain_text", text: "Cancel"},
                blocks: [
                    buildTemplateOptionSelects(),
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Next:'
                        },
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Add captions',
                            },
                            action_id: 'button_caption'
                        }
                    }
                ],
            }
        });
        console.log('on result');
        console.log(result);
        return {
            // To continue with this interaction, return false for the completion
            completed: false,
        };
    }
    catch (error) {
        logger.error(error);
    }
});

// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
app.action('button_caption', async ({ ack, body, client, logger }) => {
    // Acknowledge the button request
    await ack();

    try {
        if (body.type !== 'block_actions' || !body.view) {
            return;
        }
        // Call views.update with the built-in client
        const result = await client.views.update({
            // Pass the view_id
            view_id: body.view.id,
            // Pass the current hash to avoid race conditions
            hash: body.view.hash,
            // View payload with updated blocks
            view: {
                type: 'modal',
                // View identifier
                callback_id: 'view_1',
                title: {
                    type: 'plain_text',
                    text: 'Updated modal'
                },
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'plain_text',
                            text: 'You updated the modal!'
                        }
                    },
                    {
                        type: 'image',
                        image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
                        alt_text: 'Yay! The modal was updated'
                    }
                ]
            }
        });
        logger.info(result);
    }
    catch (error) {
        logger.error(error);
    }
});

/* Mention handler */
app.event('app_mention', async ({ event, say , client}) => {
    console.log('on event -- app_mention');
    console.log(`with event [${JSON.stringify(event)}]`);

    // remove mention from message
    let message = event.text.replace(/<@.*>/, '').trim();
    let imageUrl = messageToImageUrl(message);

    if(imageUrl) {
        console.log('on imageUrl')
        console.log(imageUrl)
        await say(imageBlocksBuilder(imageUrl));
    } else {
        await client.chat.postEphemeral({
            token: process.env.SLACK_BOT_TOKEN,
            channel: event.channel,
            user: event.user,
            text: "There was a problem fulfilling your request. Try direct messaging 'help' to see what I can do."
        });
    }
});

/* Direct message handlers */
// A user clicked into your App Home (aka App DM)
app.event('app_home_opened', async ({ event, say }) => {
    console.log('on event -- app_home_opened');
    console.log(`with event [${JSON.stringify(event)}]`);
    await say(`Hello, <@${event.user}>! Try typing 'help' to see what I can do.`);
});

// Listens to incoming messages that contain "hello"
app.message('help', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    console.log('on message -- help')
    console.log(`with message [${JSON.stringify(message)}]`);

    let helpMessage= {
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Sure! Here are some mems I can make if you mention me with one of the the meme strings:\n\nExample:\n>@Engage Bot N this-is-fine& &this is fine"
                }
            },
            {
                "type": "divider"
            }
        ]
    }
    for (const [keyword, meme] of Object.entries(keywordMemeMap)) {
        let memeSections = {
            type: "section",
            text: {
                "type": "mrkdwn",
                "text": `*${meme.title}*\nmeme string: @me ${meme.memeString}\n`
            },
            "accessory": {
                "type": "image",
                "image_url": `${meme.exampleImageUrl}`,
                "alt_text": "alt text for image"
            }
        };
        console.log('on memeSections');
        console.log(memeSections);
        helpMessage.blocks.push(memeSections);
    }
    console.log('on helpMessage');
    console.log(helpMessage);
    await say(helpMessage);
});

// Listens to incoming messages that contain "hello"
app.message('test', async ({ message, say }) => {
    // remove mention from message
    message = message.text.replace(/<@.*>/, '').trim();
    let imageUrl = messageToImageUrl(message);

    if(imageUrl) {
        console.log('on imageUrl')
        console.log(imageUrl)
        await say(imageBlocksBuilder(imageUrl));
    } else {
        await say({
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "There was a problem with the format of your meme string. Try direct typing 'help' to see what formats are avalable."
                    }
                }
            ]
        })
    }
});


// Boilerplate - Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
    console.log('on lambda handler');
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}
