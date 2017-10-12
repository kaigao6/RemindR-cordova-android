/****************************************************************
File: main.js
Author: Kai Gao
Description: This is two screen Android Cordova App that user can add new local notfication, display all the pending notifications and delete the existing local notificaitons

comments, js logic
1. complete pageChanged method
-use push.js as engin to load different pages when tapping on page tab links
-user has clicked a link in the tab menu and new page loaded
-check to see which page and then call the appropriate function
-set current time plus 1 minute on second page
2. complete showList method
- display the list of the pending notificaitons
- get ids of all the notifications and then get each of the notifcations
-now we can access the individual properties like notification.text
-build a list item for each notification
//add a listener to the delete icon to be able to delete the notification
3. competee saveNew method
-get values from the form fields and assign them to the coresponding variables
-use schedule method to create a new local notification using the above variabels as the propertie values 



Version: 0.0.1
Updated: March 8, 2017
*****************************************************************/
var app = {
    localNote: null,
    init: function () {

        //        if('deviceready' in document){
        //            document.addEventListener('deviceready', app.onDeviceReady);
        //        } else{  
        //            document.addEventListener('DOMContentLoaded', app.onDeviceReady);
        //        }

        try {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false); //bind method purpose??
            app.onDeviceReady();
            //            app.showList();

        } catch (e) {
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
            console.log('failed to find deviceready');
        }
    },
    onDeviceReady: function () {


        //        alert("??");
        //set up event listeners and default var able values
        window.addEventListener('push', app.pageChanged);
        //cordova.plugins.notification.local
        //        app.localNote = cordova.plugins.notification.local;
        app.localNote = cordova.plugins.notification.local;
        app.localNote.on("click", function (notification) {
            app.localNote.cancel(notification.id, function () {
                //do something after the notice has been removed from the phone memory
            });
            app.showList();
 
        });
        //show the list when loading
        app.showList();
    },
    pageChanged: function () {
        console.log("I am a marker");
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        //determine the page, which page I am on. ev is the push event
        let contentDiv = document.querySelector(".content");
        let id = contentDiv.id; // contentDiv.getAttribute("id);
        //        let createButton = document.getElementById("#btnAdd");
        //pages need to be unique
        switch (id) {
        case "page-notify":
            app.showList();
            break;
        case "page-add":
            //            let unixTime = Date.now() + 1.5 * 60 * 1000; // add 1.5 minute, unixTime is in milliseconds
            //            let time = timeConverter(unixTime); // convert unix time to normal time format
            //            //console.log(time);
            //            app.timeInInterface = document.getElementById("time");
            //            app.timeInInterface.value = time;

            let createButton = document.getElementById("btnAdd");
            //add click listener to the Create button 
            createButton.addEventListener("click", app.saveNew);

            let tempTime = new Date();
            tempTime.setMinutes(tempTime.getMinutes() + 1);
            let timeInInterface = document.getElementById("time");
            timeInInterface.value = tempTime.toString();

            break;
        default:
            app.showList();
        }
    },
    showList: function () {
        //        let list = document.querySelector('list-notify');
        let list = document.getElementById("list-notify");
        list.innerHTML = "";
        app.localNote.getAllIds(function (ids) {
            ids.forEach(function (id) {
                app.localNote.get(id, function (notification) {

                    console.log(id);
                    console.log(notification.id);
                    console.log(notification.title);
                    console.log(notification.text);
                    console.log(notification.at);
                    console.log(notification.icon);
                    //console.log(app.timeInInterface.value);

                    //build a list item for one notificaiton
                    let li = document.createElement("li");
                    li.classList.add("table-view-cell");
                    li.classList.add("media");
                    let span = document.createElement("span");
                    span.classList.add("media-object");
                    span.classList.add("pull-left");
                    span.classList.add("icon");
                    span.classList.add("icon-trash");

                    //                    span.setAttribute("notification-id", notification.id);
                    span.setAttribute("notification-id", id);

                    let div = document.createElement("div");
                    div.classList.add("media-body");
                    let p = document.createElement("p");

                    let timeInMilliseconds = notification.at * 1000;
                    let dateObj = new Date(timeInMilliseconds);
                    p.innerHTML = notification.title + " @ " + dateObj.toLocaleString();
                    div.appendChild(p);
                    li.appendChild(span);
                    li.appendChild(div);

                    list.appendChild(li);

                    //                    //delete
                    span.addEventListener("click", function (ev) {
                        let deleteIcon = ev.currentTarget;
                        
                        let idForDelete = deleteIcon.getAttribute("notification-id");
                        app.localNote.cancel(idForDelete, function () {
                            //do something after the notice has been removed from the phone memory
                        });
                        deleteIcon.parentElement.parentElement.removeChild(deleteIcon.parentElement);

                    });


                });
            });
        });

//                let deleteIcons = document.querySelectorAll(".icon-trash");
//                deleteIcons.forEach(function(deleteIcon){
//                    deleteIcon.addEventListener("click", bob);
//                });
//
//                function bob(ev){
//                        console.log("enter click !");
//                        let deleteButton = ev.currentTarget;
//                        deleteButton.removeEventListener("click", bob)
//                        let idForDelete = deleteButton.getAttribute("notification-id");
//                        app.localNote.cancel(idForDelete, function(){
//                            deleteButton.parentElement.parentElement.removeChild(deleteButton.parentElement);
//                        });
//                    };


    },
    
    

    saveNew: function (ev) {
        ev.preventDefault();
        let titleValue = document.getElementById("title").value;
        let msg = document.getElementById("msg").value;
        let timeString = document.getElementById("time").value;
        let myDate = new Date(timeString);
        console.log("visible here?");
        //        console.log(app.timeInInterface.value);
        //create a new notification with the details from the form
        app.localNote.schedule({
            id: Date.now(),
            title: titleValue,
            text: msg,
            at: myDate,
            icon: "ic_stat_add_alert.png"
                //            icon: "ic_stat_new_releases.png"
                //            icon: "logo.png"
                //icon: "./img/logo.png"
                //                 icon: "http://sciactive.com/pnotify/includes/github-icon.png"
        });

        app.showList();




    }
};
app.init();

//function timeConverter(UNIX_timestamp) {
//    var a = new Date(UNIX_timestamp);
//    //    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//    var year = a.getFullYear();
//    //  var month = months[a.getMonth()];
//    var month = a.getMonth() + 1;
//    var date = a.getDate();
//    var hour = a.getHours();
//    var min = a.getMinutes();
//    var sec = a.getSeconds();
//    //    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
//    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
//    return time;
//}