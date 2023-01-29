const filter = {
    url: [
        {
            urlMatches: 'https://book.douban.com/*',
        },
    ],
};

chrome.webNavigation.onCompleted.addListener(() => {
    console.info("你好豆瓣书评~");
}, filter);