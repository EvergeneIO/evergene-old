const fetch = require('node-fetch');

let data = {
    id: "1710781300100956170",
    member: [
        {
            total: 2,
            online: 5
        }
    ]
}


fetch('http://localhost:3001/api/partner', { method: 'PUT', header: { Authorization: 'KH3QP2JQTQ68X1-SB4LTGV3J' }, body: JSON.stringify(data) })
    .then(res => res.json())
    .then(json => console.log(json));