/**
 * @name soft-block-user
 * @version 0.0.1
 * @description a small better discord plugin which just inject some js to discord which scans all messages checks the author and if string matches list message gets "deleted"
 * @author Oskar#2843
 *   
 */

let softBlockedUserNicknames = ["fabus"]

 module.exports = class oskar {
    
    load() {
        // BdApi.alert(`SoftBlockedUser plugin enabled. Blocked users are: ----> ${softBlockedUserNicknames.join(", ")} <----`)
    }
    start() {
        setInterval(function () { //set the code to repeat without pausing discord itself.
            let chatMessagesAuthors = [...document.querySelectorAll("main li h2 span span")]
            chatMessagesAuthors.forEach(messageAuthorElement => {
                // using .some due to the feact it breaks as soonfirst true is returned .forEach isnt able to break (actuale is if u wrap in in try catch)
                // https://stackoverflow.com/a/2641374/14077167
                softBlockedUserNicknames.some(userNickname => {
                    let nick_found = messageAuthorElement.innerText.includes(userNickname)
                    if(nick_found){
                        let root = messageAuthorElement.parentElement.parentElement.parentElement
                        root.querySelector("div").innerText = `--> ${messageAuthorElement.innerText} was soft blocked -> ("${userNickname}" matched "${messageAuthorElement.innerText}")`
                        root.querySelector("img").remove()
                        root.querySelector("h2").remove()
                    }
                    return nick_found
                })
            })
        }, 1000);


    }
    stop() {

    }
    getSettingsPanel () {

        let rootElm = document.createElement("div")
        rootElm.classList = "card bg-dark text-light"

        // add bootstrap
        let link = document.createElement("link")
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" 
        link.rel="stylesheet"
        rootElm.appendChild(link)

        //custom style
        let style = document.createElement("style")
        style.innerHTML = ".list-group-item{background:#36393f;color:#ffffff}.input-group-text{background:#36393f;color:#ffffff}.form-control{background-color:#36393f;color:#ffffff}.form-control:focus{background-color:#46494f;color:#ffffff}"
        rootElm.appendChild(style)

        let oskar =  document.createElement("div")
        oskar.innerHTML ='<h5 class="card-title">Already blocked user</h5>'
        oskar.classList = "card-body"

        let listWrapper =  document.createElement("div")
        listWrapper.id = "listWrapper"
        listWrapper.appendChild(renderSoftUserList())
        oskar.appendChild(listWrapper)

        let form = document.createElement("div")
        form.innerHTML = '<div class="input-group mt-3"><span class="input-group-text" id="basic-addon1">Username</span><input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"><button class="btn btn-outline-primary" type="button" id="button-addon2">Add</button></div>'
        form.querySelector("button").addEventListener("click", function (event){
            let user = event.srcElement.parentElement.querySelector("input").value
            softBlockedUserNicknames.push(user)
            document.getElementById("softBannedList").remove()
            document.getElementById("listWrapper").appendChild(renderSoftUserList())
        })
        oskar.appendChild(form)

        rootElm.appendChild(oskar)
        return rootElm
    }

    

}

function renderSoftUserList (){
    let ul = document.createElement("ul")
    ul.id = "softBannedList"
    ul.classList = "list-group list-group-flush text-light"
    softBlockedUserNicknames.forEach(nick => {
        let li = document.createElement("li")
        li.innerText = nick
        li.classList.add("list-group-item")
        ul.appendChild(li)
    })

    return ul
}