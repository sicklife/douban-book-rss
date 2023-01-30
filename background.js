const filter = {
    url: [
        {
            urlMatches: 'https://book.douban.com/*',
        },
    ],
};

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.text()
    // return response.json(); // parses JSON response into native JavaScript objects
}


chrome.webNavigation.onCompleted.addListener(() => {
    console.info("你好豆瓣书评~");
}, filter);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){

    postData('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d31e5a41-45bd-4ae6-910e-6c0f46905f6e',
        { "msgtype": "text", "text": {"content": message.text} })
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
    sendResponse("收到！");
})