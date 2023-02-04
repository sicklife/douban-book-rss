function getSomething() {
    var r = 0;
    return new Promise(function(resolve) {
        setTimeout(function() {
            r = 2;
            resolve(r);
        }, 10);
    });
}

async function compute() {
    var x = await getSomething();
    alert(x * 2);
}
compute();

async function final_get(){
    let count = await chrome.storage.local.get(["book_review_count"]);
    let book_count = count.book_review_count
    console.log("get~")
    console.log(count)
    if(book_count === undefined){
        console.log("尚未开始计数");
        let p = chrome.storage.local.set({ book_review_count: 8 })
        await p
        console.log("储存计数结束");
    }else{
        console.log("书评数量为",book_count)
    }
    console.log("finished~")
}
final_get().then(r => {console.log(r)});

