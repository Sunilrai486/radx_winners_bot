const express = require('express');
const cors = require('cors');
const Axios = require('axios');
const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

app.post('/compile', (req, res) => {
    // Receive the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    if (language == 'python') {
        language = 'py'
    }

    let data = ({
        "code": code,
        "language": language,
        "input": input
    });

    let config = {
        method: "post",
        url: 'https://api.codex.jaagrav.in',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    // Call the code compilation API
    Axios(config)
        .then((response) => {
            res.send(response.data)
            console.log(response.data)
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});