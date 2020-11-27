process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios')

const cookie =
    "express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWW1Ka1ltRm1PR1JrWkRkaU1EQXhPRE01TURrM05pSXNJbVZ0WVdsc0lqb2lkR1ZxYzJ3MGRFQjBaWE4wTG1OdmJTSXNJbWxoZENJNk1UWXdOakUwTmprNU1YMC51aFJuY2lIQmIwTE5vVEpOaVh2TzdWMlllM09TSUF5b25KQVZSdU1iWjkwIn0"

//тест на последовательную запись ивентов в БД (по очереди версий)
const doRequest = async () => {
    const { data } = await axios.post(
        `https://ticketing.dev/api/tickets`,
        { title: 'ticket', price: 5 },
        {
            headers: { cookie },
        }
    );

    await axios.put(
        `https://ticketing.dev/api/tickets/${data.id}`,
        { title: 'ticket', price: 10 },
        {
            headers: { cookie },
        }
    );

    axios.put(
        `https://ticketing.dev/api/tickets/${data.id}`,
        { title: 'ticket', price: 15 },
        {
            headers: { cookie },
        }
    );

    console.log('Request complete');
};

(async () => {
    for (let i = 0; i < 400; i++) {
         doRequest();
    }
})();
