import Twitter from 'twitter-lite';
require('dotenv').config()
const axios = require('axios');
const csv = require('csvtojson')
const _ = require('lodash')

const MPP_LIST_URL = process.env.MPP_LIST_URL;
const RIDING_KEY = 'Riding name'

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

async function findTwitterHandle(mpp) {
    


    // app.get('users/search')
    // .then(result => {
    //       console.log(result)
    //   }).catch((err) => {
    //       console.log(err)
    //   });
    // console.log(rateLimits)
    // console.log(search)

    // console.log(mpp)

}

async function main() {
    const mpp_csv = await getMppCSV();
    const mpp_json = await stringToJSON(mpp_csv);
    const mpps_by_riding = sortByRiding(mpp_json);
    // console.log(mpps_by_riding)
    const twitterHandle = findTwitterHandle(mpps_by_riding.['Thunder Bay—Atikokan'])
}

main();