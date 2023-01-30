console.log("来自chrome 插件的日志。")

// let elements = document.getElementsByClassName("main review-item");
// let msg = "";
// for (let e = 0; e < elements.length; e++) {
//     msg += elements[e].innerText + "\n";
// }
// console.log(msg);

let review_titles = document.getElementsByTagName("h2")
let book_imgs = document.getElementsByClassName("subject-img")
let msg = ""

for (let i = 0; i < review_titles.length; i++) {
    msg += "【" + book_imgs[i].children[0].alt + "】";
    msg += review_titles[i].innerText + "\n";
    msg += review_titles[i].children[0].href + "\n";
}
console.log(msg)

chrome.runtime.sendMessage({text: msg}, function (response){
    console.log("Response", response);
    window.setTimeout(function (){
        window.location.reload()
    }, 1000 * 60 * 10)
})


