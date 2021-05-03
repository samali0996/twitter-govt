import Twitter from 'twitter-lite';
const csv = require('csvtojson')
require('dotenv').config()

const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET
})

async function createList() {
    try {
        const response = await client.post('lists/create', {
            name: 'ontario_legislature'
        });
        }
        catch(e) {
            console.log(e)
        }
}

async function addMembers(screen_names) {

    try {
        const response = await client.post('lists/members/create_all', {
            list_id: '1388600167558008833',
            screen_name: `${screen_names}`
        });
        }
        catch(e) {
            console.log(e)
        }
}

async function listLists() {
    try {
        const response = await client.get('lists/show', {
            list_id: '1388600167558008833'
        });
        console.log(response)
        }
        catch(e) {
            console.log(e)
        }
}



async function main() {
    await listLists();
    // return;
// call liist names twice, once with first 100, second with next 100
    const jsonArray = await csv().fromFile('mpphandles.csv')
    let count = 0;
    let parameter = ''
    let listToSend = []
    // console.log(jsonArray.length)
    for (const element in jsonArray) {
        listToSend.push(jsonArray[element].twitter)
        count++
        if (count === 100) {
            await addMembers(listToSend.toString()) 
            // console.log(listToSend.toString())
            listToSend = []
            count = 0;

        }
    }
    // console.log(listToSend.toString())
    await addMembers(listToSend.toString()) 
}

// main()
const a = ""
if (a) {
    console.log('hello')
}