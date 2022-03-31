const moment = require('moment')

//Formatting the message to an object
function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
}
module.exports = formatMessage;