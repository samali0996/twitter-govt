import Twitter from 'twitter-lite';
require('dotenv').config()
const axios = require('axios');
const csv = require('csvtojson')
const _ = require('lodash')
var fs = require('fs');


const MPP_LIST_URL = process.env.MPP_LIST_URL;
const RIDING_KEY = 'Riding name'
const FIRST_NAME_KEY = 'First name'
const LAST_NAME_KEY = 'Last name'

const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET
})

async function getMppCSV() {
    const response = await axios.get(MPP_LIST_URL)
    return response.data;
}

async function stringToJSON(string) {
    const mpp_json = await csv().fromString(string);
    return mpp_json
}

function sortByRiding(mpp_json) {
    const mpps = {}
    for (let i = 0; i < mpp_json.length; i++) {
        const mpp = mpp_json[i];
        const riding = mpp[RIDING_KEY]
        if (_.isNil(mpps[riding])){
            mpps[riding] = mpp
        }
    }
    return mpps
}

async function findTwitterHandle(mpp, excludeRiding = false) {

    let q = ''

    if (excludeRiding) {
        q = `${mpp[FIRST_NAME_KEY].split(' ')[0]} ${mpp[LAST_NAME_KEY]}`
    } else {
        q = `${mpp[FIRST_NAME_KEY].split(' ')[0]} ${mpp[LAST_NAME_KEY]} ${mpp[RIDING_KEY]}`
    }

    try {
    const response = await client.get('users/search', {
        q,
        count: 1
    });

    if ( _.isNil(response) || _.isNil(response[0]) || _.isNil(response[0].screen_name) ) {
        return null;
    }

    return response[0].screen_name
    } catch(e) {
        console.log(e);
        return null;
    }
    // console.log(rateLimits)
    // console.log(search)



}

async function main() {
    const mpp_csv = await getMppCSV();
    const mpp_json = await stringToJSON(mpp_csv);
    const mpps_by_riding = sortByRiding(mpp_json);
    // have two iterations, one with the first last riding, and also store the values not found
    const sample_mpp = mpps_by_riding['Don Valley West']

    const twitterHandles = []
    for (const [key, value] of Object.entries(mpps_by_riding)) {
        let twitterHandle = await findTwitterHandle(value)
        if (twitterHandle === null) {
            twitterHandle = await findTwitterHandle(value, true)
        }
        // const twitterHandle = null;
        const object = {
            firstName:  value[FIRST_NAME_KEY],
            lastName: value[LAST_NAME_KEY],
            riding: value[RIDING_KEY],
            twitterHandle
        }
        // const twitterHandle = await findTwitterHandle(sample_mpp)
        // const object = {
        //     firstName:  sample_mpp[FIRST_NAME_KEY],
        //     lastName: sample_mpp[LAST_NAME_KEY],
        //     riding: sample_mpp[RIDING_KEY],
        //     twitterHandle
        // }
        // console.log(object)
        twitterHandles.push(object)
        // break;
    }
    console.log(twitterHandles)

    // var file = fs.createWriteStream('array.txt');
    // file.on('error', function(err) { /* error handling */ });
    // twitterHandles.forEach(function(v) { file.write(v.firstName + ',' + v.lastName + ',' + v.twitterHandle + '\n'); });
    // file.end()



    // console.log()
    // console.log(mpps_by_riding['Toronto—St. Paul\'s'])
    // const twitterHandle = await findTwitterHandle(mpps_by_riding['Toronto—St. Paul\'s'])
    // console.log(twitterHandle)
    // console.log(mpps_by_riding)
    // console.log(mpps_by_riding.['Etobicoke North'])
    // const twitterHandle = findTwitterHandle(mpps_by_riding.['Etobicoke North'])

}

main();