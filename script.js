/*const uuidAPIKey = require('uuid-apikey');
 
console.log(uuidAPIKey.create());*/


// UUID GENERATOR
const { v4: uuidv4 } = require('uuid');
const uuidAPIKey = require('uuid-apikey');
console.log(uuidAPIKey.toAPIKey('6716cd8c-d41b-4262-8731-8855dd04b7b0'));

/*
// FOR DISCORD ID LOOKUP
const fetch = require('node-fetch')

// You might want to store this in an environment variable or something
const token = 'Nzk2NTM2ODQzNzU1NTg1NTg4.X_ZWvg.xFl517iHfS9BElW2jVcv4aedYY4'
let id = 301769061652627457;
const fetchUser = async id => {
    try {
        let id = 301769061652627457;
        const response = await fetch(`https://discord.com/api/v8/users/${id}`, {
            headers: {
              Authorization: `Bot ${token}`
            }
          })
          if (!response.ok) throw new Error(`Error status code: ${response.status}`)
          console.log(JSON.parse(await response.json()))
          return JSON.parse(await response.json())
    } catch {
        console.error('error')
    }
}

fetchUser()
*/