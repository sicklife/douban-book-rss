const filter = {
    url: [
        {
            urlMatches: 'https://book.douban.com/*',
        },
    ],
};
const book_review_storage_key_name = "book_review"

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

let book_review_list = [];
let counter = 0

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    console.log("Message received!", message.text)
    chrome.storage.local.get(["book_review"]).then((value)=>{
        console.log(value)
        book_review_list = value.book_review || [];
        console.log(book_review_list)
        let review_msg = message.text;
        let review_msg_list = review_msg.split("\n");
        let new_review_lit = [];
        for (let i = 0; i < review_msg_list.length; i++) {
            let line = review_msg_list[i];
            if(book_review_list.includes(line)){
            }else{
                // console.log(book_review_list.includes(line), line)
                book_review_list.push(line)
                new_review_lit.push(line)
            }
        }
        book_review_list = book_review_list.slice(-20);
        chrome.storage.local.set({book_review: book_review_list}).then(()=>{
            console.log("save finished.")
        })

        let wx_msg;
        if(new_review_lit.length>0){
            wx_msg = new_review_lit.join("\n");
            postData('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d31e5a41-45bd-4ae6-910e-6c0f46905f6e',
                // { "msgtype": "text", "text": {"content": message.text} })
                { "msgtype": "text", "text": {"content": wx_msg} })
                .then(data => {
                    console.log(data); // JSON data parsed by `data.json()` call
                    new_review_lit = []
                });
        }else {
            wx_msg = "没有新书评."
            console.log(wx_msg)
        }
    })
    sendResponse("收到！");
})