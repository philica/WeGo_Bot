require('dotenv').config()

const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const mongoose = require('mongoose')
const { enter, leave } = Stage
const connectDB = require('./db')
const express = require('express')

const app = express()
app.get('/', (req, res) => {
    res.send("This is WeGo bot")
    console.log('I am up and running')
})

app.listen(3000, () => {
    console.log('I am up and running')

})
//Utility functions
const { validateFullName } = require('./Utilities/validateName')
const { validatePhoneNumber } = require('./Utilities/validatePhone')
const { validateEmail } = require('./Utilities/validateEmail')
const { isUserRegistered } = require('./Utilities/isUserRegistered')
const { findUserIdByChatId } = require('./Utilities/findUserIdByChatId');

//model
const User = require('./Models/user.model')
const Trip = require('./Models/trip.model')
const Booking = require('./Models/booking.model');
// create database connection
connectDB();

const bot = new Telegraf('6725874509:AAFynN4aThY2ivH0XaBqGjQ2TyLRNWmXwUE')
bot.use(session())


console.log('Bot has been started ...')

//registering scenes
const registerationScene = new WizardScene(
    'registerationScene',
    (ctx) => {
        ctx.reply("👋 Welcome to WeGo! To register, I'll need some information. Let's get started!")
        ctx.reply(`What's your full name
\nplease enter in this format: Abebe Kebede Birhanu`)

        ctx.wizard.state.user = {};
        ctx.wizard.state.user.chatId = ctx.chat.id
        return ctx.wizard.next()
    },
    (ctx) => {

        console.log(ctx)
        if (ctx.updateSubTypes == 'text') {

            if (ctx.message.text.toLowerCase() == '/cancel') {
                ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                return ctx.scene.leave();
            }
            const fullName = ctx.message.text;
            if (!validateFullName(fullName)) {
                ctx.reply('Please enter your full name in the format: \n\nFirstname Middlename Lastname');
                return
            }
            ctx.wizard.state.user.name = ctx.message.text

            bot.telegram.sendMessage(ctx.chat.id, `Great ${fullName}! Next,select your gender? 🧑♂️👩♀️`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👦 Male', callback_data: 'Male' }],
                        [{ text: '👧 Female', callback_data: 'Female' }],

                    ]
                }
            })



            return ctx.wizard.next()
        }
        else {
            ctx.reply('Please enter your full name in the format: \n\nFirstname Middlename Lastname 👍');
            return
        }
    },
    (ctx) => {
        if (ctx.updateType != 'callback_query') {
            if (ctx.update.message.text) {
                if (ctx.update.message.text == '/cancel') {
                    //leave scene
                    ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                    return ctx.scene.leave();
                }
            }
            ctx.reply('Please enter the correct Information 👍');
            bot.telegram.sendMessage(ctx.chat.id, `Great ${ctx.wizard.state.user.name}! Next,select your gender? 🧑♂️👩♀️`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👦 Male', callback_data: 'Male' }],
                        [{ text: '👧 Female', callback_data: 'Female' }],

                    ]
                }
            })

            return
        }
        else {
            ctx.answerCbQuery()
            ctx.wizard.state.user.gender = ctx.update.callback_query.data
            ctx.reply(`Thanks! What is your phone number? 📱 
          \nplease enter in this format: 0912365478`)
            return ctx.wizard.next()
        }


    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() == '/cancel') {
            ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
            return ctx.scene.leave();
        }
        const phone = ctx.message.text
        if (!validatePhoneNumber(phone)) {
            ctx.reply('Please enter your phone number in this format: 👍 \n\n Ex 0912345678');
            return
        }
        ctx.wizard.state.user.phoneNumber = ctx.message.text
        ctx.reply(`Excellent! What is your email address? 📧`)
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() == '/cancel') {
            ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
            return ctx.scene.leave();
        }
        const email = ctx.message.text
        if (!validateEmail(email)) {
            ctx.reply('Please enter your email address in the correct format 👍')
            return
        }
        ctx.wizard.state.user.email = ctx.message.text
        ctx.reply(` Awesome! What is your student ID number? 🆔
\nplease enter in this format: ugr/xxxxx/xx`)
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() == '/cancel') {
            ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
            return ctx.scene.leave();
        }
        ctx.wizard.state.user.studentIDNumber = ctx.message.text.toLowerCase()
        bot.telegram.sendMessage(ctx.chat.id, 'What year are you in? 📚', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '1st year', callback_data: '1st year' }],
                    [{ text: '2nd year', callback_data: '2nd year' }],
                    [{ text: '3rd year', callback_data: '3rd year' }],
                    [{ text: '4th year', callback_data: '4th year' }],
                    [{ text: '5th year', callback_data: '5th year' }],
                ]
            }
        })
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.updateType != 'callback_query') {
            if (ctx.update.message.text) {
                if (ctx.update.message.text == '/cancel') {
                    //leave scene
                    ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                    return ctx.scene.leave();
                }
            }

            ctx.reply('Please enter the correct Information 👍');
            bot.telegram.sendMessage(ctx.chat.id, 'What year are you in? 📚', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '1st year', callback_data: '1st year' }],
                        [{ text: '2nd year', callback_data: '2nd year' }],
                        [{ text: '3rd year', callback_data: '3rd year' }],
                        [{ text: '4th year', callback_data: '4th year' }],
                        [{ text: '5th year', callback_data: '5th year' }],
                    ]
                }
            })

            return
        }
        else {
            ctx.answerCbQuery()
            ctx.wizard.state.user.yearOfStudy = ctx.update.callback_query.data
            ctx.reply('Finally,Upload photo of your student ID card. 📄')
            return ctx.wizard.next()
        }
    },
    (ctx) => {

        if (ctx.updateSubTypes[0] != 'photo') {
            if (ctx.update.message.text) {
                if (ctx.update.message.text == '/cancel') {
                    //leave scene
                    ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                    return ctx.scene.leave();
                }
            }
            ctx.reply('Please upload your student ID card in picture format👍');
            return
        }
        const studentIDImage = ctx.update.message.photo[0].file_id
        ctx.wizard.state.user.studentIDImage = studentIDImage
        const userData = ctx.wizard.state.user
        const message = `Great job , now please confirm your information 👍

        Full Name: ${userData.name},
        Gender: ${userData.gender},
        Phone Number: ${userData.phoneNumber},
        Email: ${userData.email},
        Student ID Number: ${userData.studentIDNumber},
        Year of Study: ${userData.yearOfStudy},

        `
        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Cancel', callback_data: 'cancel' },
                        { text: 'Confirm', callback_data: 'confirm' },

                    ],
                ]
            }
        })
        return ctx.wizard.next()
    },
    (ctx) => {

        if (ctx.updateType != 'callback_query') {
            if (ctx.update.message.text) {
                if (ctx.update.message.text == '/cancel') {
                    //leave scene
                    ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                    return ctx.scene.leave();
                }
            }

            ctx.reply('Please enter the correct Information 👍');
            bot.telegram.sendMessage(ctx.chat.id, message, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Cancel', callback_data: 'cancel' },
                            { text: 'Confirm', callback_data: 'confirm' },

                        ],
                    ]
                }
            })

            return
        }

        else if (ctx.update.callback_query.data == 'confirm') {
            ctx.answerCbQuery()

            const userData = ctx.wizard.state.user
            // send user data to database
            const newUser = new User(userData)
            newUser.save()
                .then(savedUser => {
                    console.log('User saved to database:', savedUser);
                    ctx.reply(`Thank you! You're now registered for WeGo services. Welcome aboard! 🎉`);
                })
                .catch(error => {
                    console.error('Error saving user:', error);
                    console.log('user', userData);
                    ctx.reply('Oops! There was an error processing your registration.');
                });
            return ctx.scene.leave()
        }

        else {
            ctx.reply('Process terminated \n\nplease use the /start command to start using our service\n\n Join our telegram channel @WeGo_Ride ');
            return ctx.scene.leave();
        }

    }
)

//booking scene
const bookingScene = new WizardScene(
    'bookingScene',
    (ctx) => {
        ctx.reply('Welcome to WeGo , to book your ride please fill the following informations')
        ctx.reply(`How many people will be attending 
        - Type '1' if it's only you
        - Type '2' if it's you and one another friend and etc...
        `)

        ctx.wizard.state.booking = {};
        ctx.wizard.state.booking.chatId = ctx.chat.id
        return ctx.wizard.next()
    },
    (ctx) => {

        if (ctx.message.text.toLowerCase() == '/cancel') {
            ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
            return ctx.scene.leave();
        }

        const passengerCount = ctx.message.text
        ctx.wizard.state.booking.passengerCount = passengerCount

        bot.telegram.sendMessage(ctx.chat.id, `Great, Now please select from the following available trips`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'View Available Trips', callback_data: 'view' }],

                ]
            }
        })

        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.answerCbQuery()

        // return a keyboard 
        Trip.find({})
            .then((trips) => {
                const tripList = trips.map((trip) => {
                    return (
                        {
                            tripId: trip._id,
                            destination: trip.destination,
                            date: trip.date,
                            departureTime: trip.departureTime,
                            vehicleType: trip.vehicleType,
                            price: trip.price

                        })
                })

                ctx.wizard.state.booking.tripList = tripList

                console.log(tripList)

                tripList.forEach((trip) => {

                    const message = `Trip
                    
                    Destination : ${trip.destination}
                    Date : ${trip.date}
                    Time : ${trip.departureTime}
                    Vehicle Type: ${trip.vehicleType}
                    Price : ${trip.price}
                    `
                    bot.telegram.sendMessage(ctx.chat.id, message, {
                        reply_markup: {
                            inline_keyboard: [
                                [

                                    { text: 'Book Trip', callback_data: `${trip.tripId}` },

                                ],
                            ]
                        }
                    })
                })
            })



        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.updateType != 'callback_query') {
            if (ctx.update.message.text) {
                if (ctx.update.message.text == '/cancel') {
                    //leave scene
                    ctx.reply('Process terminated \n\nplease use the /start command to start using our service ');
                    return ctx.scene.leave();
                }
            }

            const tripList = ctx.wizard.state.booking.tripList
            ctx.reply('Please select the correct Information 👍');
            tripList.forEach((trip) => {

                const message = `Trip
                    
                    Destination : ${trip.destination}
                    Date : ${trip.date}
                    Time : ${trip.departureTime}
                    Vehicle Type: ${trip.vehicleType}
                    Price : ${trip.price}
                    `
                bot.telegram.sendMessage(ctx.chat.id, message, {
                    reply_markup: {
                        inline_keyboard: [
                            [

                                { text: 'Book Trip', callback_data: `${trip.tripId}` },

                            ],
                        ]
                    }
                })
            })

            return
        }
        else {
            ctx.answerCbQuery()
            //save trip 
            const tripId = ctx.update.callback_query.data
            const chatId = ctx.wizard.state.booking.chatId
            const passengerCount = ctx.wizard.state.booking.passengerCount
            let userId
            findUserIdByChatId(chatId)
                .then((result) => {

                    // if the user exists
                    userId = result; // Set the userId variable to the returned value
                    // Use the user ID as needed
                    const newBooking = new Booking({
                        userId: userId,
                        tripId: tripId,
                        passengerCount: passengerCount,
                    })

                    // Save the booking document to the database
                    newBooking.save()
                        .then((booking) => {
                            console.log('Booking saved:', booking);
                            // Handle successful booking creation
                            ctx.reply('you have succesfully booked your ride , you will receive a confirmation shortly\n thanks for using our service' )
                        })
                        .catch((error) => {
                            console.error('Error saving booking:', error);
                            // Handle error during booking creation
                        });


                })
                .catch((error) => {
                    console.error('Error finding user ID:', error);
                    // Handle the error
                });



            return ctx.scene.leave();
        }
    }
)

//Scene


const stage = new Stage()
stage.register(registerationScene)
stage.register(bookingScene)

bot.use(stage.middleware())

//register command
bot.command('register', (ctx) => {
    //check if the user is already registered
    const chatId = ctx.chat.id
    if (isUserRegistered(chatId)) {
        ctx.reply('You are already registered 😊\n\n please use the /start command to start using our service\n')
        return
    }

    ctx.scene.enter('registerationScene')
})

bot.command('bookride', (ctx) => {
    // ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
    ctx.scene.enter('bookingScene')
})

bot.command('history', (ctx) => {
    ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.command('help', (ctx) => {
    ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.command('support', (ctx) => {
    ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.start((ctx) => {
    const welcomeMessage = `Hello! 👋 Welcome to WeGo Bot! Here's what you can do with me:

Commands and Descriptions:

🚀 /start - Begin our journey together! 
🚕 /bookride - Initiate the process to book a ride. 
📜 /history - Check your booking history. 
ℹ️ /help - Find information about my features. 
🆘 /support - Connect to the support team for assistance. 
📋 /register - Register to access exclusive features. 
❌ /cancel - Cancel currently occuring event`
    ctx.reply(welcomeMessage);
})
console.log('Bot has been started ...')

bot.on("message", (ctx) => {
    const welcomeMessage = `Hello! 👋 Welcome to WeGo Bot! Here's what you can do with me:

Commands and Descriptions:

🚀 /start - Begin our journey together! 
🚕 /bookride - Initiate the process to book a ride. 
📜 /history - Check your booking history. 
ℹ️ /help - Find information about my features. 
🆘 /support - Connect to the support team for assistance. 
📋 /register - Register to access exclusive features. 
❌ /cancel - Cancel currently occuring event
`;

    ctx.reply(welcomeMessage);
})

bot.launch();


module.exports = bot;
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
