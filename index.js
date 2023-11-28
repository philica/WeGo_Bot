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

app.listen(3000,()=>{
    console.log('I am up and running')

})
//Utility functions
const { validateFullName } = require('./Utilities/validateName')
const { validatePhoneNumber } = require('./Utilities/validatePhone')
const { validateEmail } = require('./Utilities/validateEmail')

//model
const User = require('./Models/user.model')

// create database connection
connectDB();

const bot = new Telegraf('6556040954:AAGp40Ab72lF_RFaisUOepCFSpMFBU04yC8')
bot.use(session())


console.log('Bot has been started ...')

//registering scenes
const registerionScene = new WizardScene(
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
        if(ctx.message.text.toLowerCase() == '/cancel'){
          ctx.reply('Process terminated \n\nplease use the /start command to start using our service ') ;
          return ctx.scene.leave();
        }
        const fullName = ctx.message.text;
        if (!validateFullName(fullName)){
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
    },
    (ctx) => {
        
          if(ctx.updateType != 'callback_query'){
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
          ctx.answerCbQuery()
          ctx.wizard.state.user.gender = ctx.update.callback_query.data
          ctx.reply(`Thanks! What is your phone number? 📱 
          \nplease enter in this format: 0912365478`)
          return ctx.wizard.next()
        
        
    },
    (ctx) => {
        if(ctx.message.text.toLowerCase() == '/cancel'){
          ctx.reply('Process terminated \n\nplease use the /start command to start using our service ') ;
          return ctx.scene.leave();
        }
        const phone = ctx.message.text
        if(!validatePhoneNumber(phone)){
            ctx.reply('Please enter your phone number in this format: 👍 \n\n Ex 0912345678');
            return 
        }
        ctx.wizard.state.user.phoneNumber = ctx.message.text
        ctx.reply(`Excellent! What is your email address? 📧`)
        return ctx.wizard.next()
    },
    (ctx) => {
      if(ctx.message.text.toLowerCase() == '/cancel'){
        ctx.reply('Process terminated \n\nplease use the /start command to start using our service ') ;
        return ctx.scene.leave();
      }
        const email = ctx.message.text
        if(!validateEmail(email)){
            ctx.reply('Please enter your email address in the correct format 👍')
            return
        }
        ctx.wizard.state.user.email = ctx.message.text
        ctx.reply(` Awesome! What is your student ID number? 🆔
\nplease enter in this format: ugr/xxxxx/xx`)
        return ctx.wizard.next()
    },
    (ctx) => {
       if(ctx.message.text.toLowerCase() == '/cancel'){
         ctx.reply('Process terminated \n\nplease use the /start command to start using our service ') ;
         return ctx.scene.leave();
       }
        ctx.wizard.state.user.studentIDNumber = ctx.message.text
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
     
        if(ctx.updateType != 'callback_query'){
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
        ctx.answerCbQuery()
        ctx.wizard.state.user.yearOfStudy = ctx.update.callback_query.data
        ctx.reply('Now , upload your profile picture. 📸')
        return ctx.wizard.next()
    },
    (ctx) => {
      
        if(ctx.updateSubTypes[0] != 'photo'){
            ctx.reply('Please upload your profile picture in picture format👍');
            return
        }
        const profilePicture = ctx.update.message.photo[0].file_id
        ctx.wizard.state.user.profilePictureURL = profilePicture
        ctx.reply('Finally,Upload photo of your student ID card. 📄')
        return ctx.wizard.next()
    },
    (ctx) => {
      
        if(ctx.updateSubTypes[0] != 'photo'){
            ctx.reply('Please upload your student ID card in picture format👍');
            return
        }

        const studentIDImage = ctx.update.message.photo[0].file_id
        ctx.wizard.state.user.studentIDImage = studentIDImage
        // ctx.reply(`Thank you! You're now registered for WeGo services. Welcome aboard! 🎉`)
        const userData = ctx.wizard.state.user

        //send user data to database
        const newUser = new User(userData)
        newUser.save()
        .then(savedUser => {
            console.log('User saved to database:', savedUser);
            ctx.reply(`Thank you! You're now registered for WeGo services. Welcome aboard! 🎉`);
        })
        .catch(error => {
            console.error('Error saving user:', error);
            ctx.reply('Oops! There was an error processing your registration.');
        });

        console.log(userData)
        return ctx.scene.leave()
    }
)



const stage = new Stage()
stage.register(registerionScene)

bot.use(stage.middleware())

//register command
bot.command('register', (ctx) => {
    ctx.scene.enter('registerationScene')
})

bot.command('bookride',(ctx) => {
  ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.command( 'history', (ctx) => {
  ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.command( 'help', (ctx) => {
  ctx.reply('This feature is coming soon \n\n Thank you for using our service 🙏')
})

bot.command( 'support', (ctx) => {
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
📋 /register - Register to access exclusive features. `;

    ctx.reply(welcomeMessage);
  })

bot.launch();


module.exports = bot;
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
