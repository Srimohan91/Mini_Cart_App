const axios = require('axios');
const Handler = (type,url,data,callback)=>{
    axios({
        method: type,
        url: url,
        responseType: 'json'
        }).then(function (response) {
            callback(response);
        }
    );
}

export default Handler;