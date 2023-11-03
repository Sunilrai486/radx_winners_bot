const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.post('/compile', (req, res) => {
    // Receive the required data from the request
    let code = req.body.code != "" ? btoa(unescape(encodeURIComponent(req.body.code || ""))) : "";
    let language = req.body.language
    let input =  req.body.input != "" ? btoa(unescape(encodeURIComponent(req.body.input || ""))) : "";
    console.log(code);
    console.log(input)
    let languageid = 0

    if(language == 'c'){
        languageid = 50
    } else if(language == 'cpp'){
        languageid = 54
    }else if(language == 'python'){
        languageid = 71
    }else if(language == 'java'){
        languageid = 91
    }

    
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '7d33c45fabmsh2dbe628ab9eb233p12cae9jsnbe190c58d967',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: languageid,
            source_code: code,
            stdin: input
        }
    };

    var responseToken = "";

    // Call the code compilation API
    axios(options)
        .then((response) => {
            console.log(response.data.token)
            responseToken = response.data.token;

            const newoptions = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/' + responseToken,
                headers: {
                    'X-RapidAPI-Key': '7d33c45fabmsh2dbe628ab9eb233p12cae9jsnbe190c58d967',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            };
            setTimeout(() => {
                axios(newoptions)
                .then((response) => {
                    console.log(response.data);
                    res.send(response.data);
                }).catch((error) => {
                    console.log(error);
                    res.send(error);
                });
            }, 5000);


        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});