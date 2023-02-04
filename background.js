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

async function process_msg(msg_text){
    let book_review_p = await chrome.storage.local.get(["book_review"])
    let stored_book_review = book_review_p.book_review || []
    let book_review_count_p = await chrome.storage.local.get(["book_review_count"])
    let stored_book_review_count = book_review_count_p.book_review_count || 0
    let review_msg = msg_text.trim();
    let review_msg_list = review_msg.split("\n");
    console.log("review_msg_list 长度", review_msg_list.length)
    let review_msg_num = review_msg_list.length / 2
    let new_review_lit = [];
    for (let i = 0; i < review_msg_num; i++) {
        let title = review_msg_list[2*i];
        let href = review_msg_list[2*i + 1]
        // console.log(title, href)
        if(stored_book_review.includes(title) && stored_book_review.includes(href)){
        }else{
            stored_book_review_count += 1
            stored_book_review.push(title)
            stored_book_review.push(href)
            new_review_lit.push(stored_book_review_count + ":" + title)
            new_review_lit.push(href)
        }
    }
    stored_book_review = stored_book_review.slice(-20);
    let store_p = chrome.storage.local.set(
        {
            book_review: stored_book_review,
            book_review_count: stored_book_review_count
        });
    await store_p
    console.log("save finished~")
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
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
    console.log("Receive msg from content.js\n", message.text.slice(0, 50), "\n....")
    process_msg(message.text).then((value)=>{
        console.log("process msg in async function finished.", value)
    })
    sendResponse("收到！");
})