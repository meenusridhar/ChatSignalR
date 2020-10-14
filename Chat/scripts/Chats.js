// custom chat js

//console.log("");

function getParameterValues(key) {
    var pageURL = window.location.search.substring(1);
    var urlQS = pageURL.split('&');
    for (var i = 0; i < urlQS.length; i++) {
        var paramName = urlQS[i].split('=');
        if (paramName[0] == key) {
            //replace the special char like "+","&" etc from value
            var value = paramName[1].replace('%20', ' ').replace('%26', '&').replace('+', ' ');
            return value;
        }
    }
}



$(document).ready(function () {
    var pfnum = getParameterValues('pfnum');
pfnum = 8817;
   // localStorage['pfnum'] = pfnum;
    //alert(pfnum);
    var connection = $.connection("/chat","pfnum=" + pfnum,true);
    connection.logging = true;
    connection.start()
            .done(function () {
                //alert("Chat service Connected!");
                console.log("chat service connected!");
            })
            .fail(function () {
                alert("error connecting chat service.");
            });

    connection.received(function (msg) {
         //alert(msg);
       // alert(msg.type);
       

        if (msg.type == "newuser") {
            //alert(($("li#" + msg.pfnum, "#ulUsers").length));
            if ($("li#" + msg.pfnum, "#ulUsers").length) {
                $("li#" + msg.pfnum, "#ulUsers").removeClass("OfflineUsers")
                                                .addClass("OnlineUsers")
                                                .data("conid", msg.connId);
                if ($("#" + msg.pfnum, "#divChatUser").length) {
                    $("li#" + msg.pfnum, "#ulUsers").addClass("active");
                    $("#spnconid", "#divChatUser").text(msg.connId);
                    $("#hdnconid", "#divChatUser").val(msg.connId);
                }
            } else {
                var $li = $("<li>").prop("id", msg.pfnum)
                                    .prop("class", "OnlineUsers")
                                    .append(msg.username)
                                    .appendTo($("#ulUsers"));
            }
        } else if (msg.type == "connected") {
            $("#spnMySelf").text(msg.myusername);
           // console.log(msg.myusername);
            $.each(msg.onlineusers, function (i, e) {
                //alert(e.connId);
                var $li = $("<li>").prop("id", e.pfnum)
                                .append(e.username);
                if (e.IsOnline == true) {
                    //alert(e.connId);
                    $li.addClass("OnlineUsers");
                    $($li).data("conid", e.connId);
                    //newly added for showing messages which are not read on 08th Jun 2016
                    //$("li", "#ulUsers").each(function (i, e) {
                    //    if ($(e).data("conid") != undefined) {
                    //        if ($(e).data("conid") == msg.FromConnId) {
                    //            if ($("span.mybadge", e).length) {
                    //                var totNotifications = parseInt($("span.mybadge", e).text());
                    //                $("span.mybadge", e).text(totNotifications + 1);
                    //            } else {
                    //                $("<span>").addClass("mybadge").text("1").appendTo(e);

                    //            }
                    //            return false;
                    //        }
                    //    }

                    //});



                    //newly added for showing messages which are not read on 08th Jun 2016




                } else {
                    $li.addClass("OfflineUsers");
                }
                $("#ulUsers").append($li);

            });
            //alert(msg.message);
            $("#divMsgs").append(msg.message);

        } else if (msg.type == "disconnected") {
            //look thru all online list items and find the user by its connection id
            $("li.OnlineUsers", "#ulUsers").each(function (i, e) {
                //alert(e);
                //alert($(e).data("conid"));
                if ($(e).data("conid") == msg.connId) {
                    $(e).removeClass("OnlineUsers").removeClass("active").addClass("OfflineUsers");
                    return false;
                }
            });
        }
        else if (msg.type == "message") {
            
         //alert(msg.timeSent);
            //check if the connection id from where the message has came is active on the client or not.
            //if active: load the message other wise highlight the connection id.
            if ($("li.OnlineUsers.active").data("conid") == msg.FromConnId) {
                if (msg.filename) {
                   // alert("checking whether messages are transmitted");
                    //$("#divMsgs").append(msg.FromName + " : " + msg.message  + "<br/>");
                    $("#divMsgs").append($("<div>").addClass("res")
                                .append(msg.message + "<br/>")
                                .append($("<a>")
                                            .prop("href", "ghFileDownload.ashx?file=" + msg.filename)
                                            .prop("target", "_blank")
                                            .append($("<img>")
                                                            .addClass("tn")
                                                            .prop("alt", msg.filename)
                                .prop("src", "getThumbNail.ashx?file=" + msg.filename))));
                  //  $("#divMsgs").append($("<div>").addClass("res").append(msg.timeSent));

                    //$('#divMsgs').animate({
                    //    scrollTop: $('#divMsgs').get(0).scrollHeight
                    //}, 4500);
                    $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                } else {
                    var timesent = msg.timeSent;
                    var hm_time = "<span class='time'>" + timeSent.substring(timeSent.lastIndexOf(":") - 2) + "</span>";
                    var hm_date = "<span class='date'>" + timeSent.substring(0, timeSent.lastIndexOf(" ")) + "</span>";

                    $("#divMsgs").append($("<div>").addClass("res").append(msg.message + "<span class='fullTime'>" + hm_date + hm_time + "</span>"));
                  //  $("#divMsgs").append($("<div>").addClass("res").append(msg.message + "<span class='time'>" + msg.timeSent  + "</span>" ));

                    $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });

                    
                }
            } else {
                $("li", "#ulUsers").each(function (i, e) {
                    if ($(e).data("conid") != undefined) {
                        if ($(e).data("conid") == msg.FromConnId) {
                            if ($("span.mybadge", e).length) {
                                var totNotifications = parseInt($("span.mybadge", e).text());
                                $("span.mybadge", e).text(totNotifications + 1);
                            } else {
                                $("<span>").addClass("mybadge").text("1").appendTo(e);

                            }
                            return false;
                        }
                    }

                });
                //alert(msg.FromName + " : " + msg.message);
                //alert(msg.FromConnId + ":" + $("li.OnlineUsers.active").data("conid"));
            }

            
        } 
        else if (msg.type == "history") { 
           // alert(msg.type);
          //  var senderpfnum = localStorage['pfnum'];
            
            var senderpfnum = pfnum;
            //$("#divMsgs").append("<span class='loadOld'>" + ' One week Ago...' + "</span>");  

            $("#divMsgs").prepend($("<span>")
                .prop("class", "loadOld")
                .text("Click here to load old Messages...")
                .data("pfnum", msg.pfnum)
                .data("todate",msg.todate)
            );
       

            jQuery.each(msg.messages, function (i, val) {
                //alert(i);
                var UserPFNum = i.substr(0, i.indexOf('-'));   // To get user messages and display messages based on the user
                var isattachment;
                if (i.indexOf('@') != -1) {                     // If message key contains @ symbol then it has attachments 
                    isattachment = 1;
                }
                var timeSent = i.substring(i.lastIndexOf("#") + 1, i.lastIndexOf("$"));   //to get the timestamp of the message

                var hm_time = "<span class='time'>" + timeSent.substring(timeSent.lastIndexOf(":") - 2) + "</span>";
                var hm_date = "<span class='date'>" + timeSent.substring(0, timeSent.lastIndexOf(" ")) + "</span>"; 


                if (senderpfnum == UserPFNum) {
                   // alert(msg.Attachment);
                    if (isattachment==1) {
                        $("#divMsgs").append($("<div>").addClass("snd")
                            //.append(msg.message + "<br/>")
                            .append($("<a>")
                                .prop("href", "ghFileDownload.ashx?file=" + val)
                                .prop("target", "_blank")
                                .append($("<img>")
                                    .addClass("tn")
                                    .prop("alt", val)
                                    .prop("src", "getThumbNail.ashx?file=" + val))));
                        $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                    }
                    else{
                       
                        $("#divMsgs").append($("<div>").addClass("snd").append(val + "<span class='fullTime'>" + hm_date + hm_time +  "</span>"));
                        $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                       // $("#divMsgs").append($("<div>").addClass("snd").append(timeSent));
                    }
                    
                }
                else {
                    if (isattachment == 1) {
                        $("#divMsgs").append($("<div>").addClass("res")
                            //.append(msg.message + "<br/>")
                            .append($("<a>")
                                .prop("href", "ghFileDownload.ashx?file=" + val)
                                .prop("target", "_blank")
                                .append($("<img>")
                                    .addClass("tn")
                                    .prop("alt", val)
                                    .prop("src", "getThumbNail.ashx?file=" + val))));
                        $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                    }
                    else {

                        $("#divMsgs").append($("<div>").addClass("res").append(val + "<span class='fullTime'>" + hm_date + hm_time +  "</span>"));
                        $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                       // $("#divMsgs").append($("<div>").addClass("res").append(timeSent));
                    }
                }
             
               
            });
         
        }
        else if (msg.type == "ondemand") {
           
            //  var senderpfnum = localStorage['pfnum'];
            var senderpfnum = pfnum;
            
            $("#divMsgs span.loadOld").data("pfnum", msg.pfnum)
                .data("todate", msg.todate);

            jQuery.each(msg.messages, function (i, val) {
                //alert(i);
                var UserPFNum = i.substr(0, i.indexOf('-'));   // To get user messages and display messages based on the user
                var isattachment;
                if (i.indexOf('@') != -1) {                     // If message key contains @ symbol then it has attachments 
                    isattachment = 1;
                }
                var timeSent = i.substring(i.lastIndexOf("#") + 1, i.lastIndexOf("$"));   //to get the timestamp of the message

                var hm_time = "<span class='time'>" + timeSent.substring(timeSent.lastIndexOf(":") - 2) + "</span>";
                var hm_date = "<span class='date'>" + timeSent.substring(0, timeSent.lastIndexOf(" ")) + "</span>";

                if (senderpfnum == UserPFNum) {
                    // alert(msg.Attachment);
                    if (isattachment == 1) {
                        $("#divMsgs span.loadOld").after($("<div>").addClass("snd")
                            //.append(msg.message + "<br/>")
                            .append($("<a>")
                                .prop("href", "ghFileDownload.ashx?file=" + val)
                                .prop("target", "_blank")
                                .append($("<img>")
                                    .addClass("tn")
                                    .prop("alt", val)
                                    .prop("src", "getThumbNail.ashx?file=" + val))));
                    }
                    else {

                        $("#divMsgs span.loadOld").after($("<div>").addClass("snd").append(val + "<span class='fullTime'>" + hm_date + hm_time + "</span>"));
                       
                    }

                }
                else {
                    if (isattachment == 1) {
                        $("#divMsgs span.loadOld").after($("<div>").addClass("res")
                            //.append(msg.message + "<br/>")
                            .append($("<a>")
                                .prop("href", "ghFileDownload.ashx?file=" + val)
                                .prop("target", "_blank")
                                .append($("<img>")
                                    .addClass("tn")
                                    .prop("alt", val)
                                    .prop("src", "getThumbNail.ashx?file=" + val))));
                    }
                    else {

                        $("#divMsgs span.loadOld").after($("<div>").addClass("res").append(val + "<span class='fullTime'>" + hm_date + hm_time + "</span>"));
                       
                       
                       
                    }
                }


            });

           // $("#divMsgs").prepend($("<span>")
           //// $("span.loadOld").prepend($("<span>")
           //     .prop("class", "loadOld")
           //     .text("One week ago...")
           //     .data("pfnum", msg.pfnum)
           //     .data("todate", msg.todate)
           // );

        }
    });

    $('#divUsers span').click(function () {
        $(this).toggleClass("active");
        $(this).next().slideToggle(250);
    });

    // slide user chat 
    $('span.toggleUsersList , .OnlineUsers , .OfflineUsers ').click(function () { 
        $('.asideThreads').addClass("slideHide");
        $('.chatContainer').addClass("slideShow");
        //console.log("click is working");
    });
    $('.slideBack').click(function () {
        $('.asideThreads').removeClass("slideHide");
        $('.chatContainer').removeClass("slideShow");
    });

    //$(".inputMsg").click(function () { 
    //    $(this).toggleClass("active");
    //    alert("working ");
    //});

    $(".inputMsg").on('blur', function () {
        $(this).parent().removeClass('active');
    }).on('focus', function () {
        $(this).parent().addClass('active');
        
    }); 

    $("#txtMsg").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#btnSend").click();
        }
    });

    $("#btnSend").click(function (e) {
        e.preventDefault();

        var dt = new Date();
        var h = dt.getHours(), m = dt.getMinutes();
         var cdate = '<span class="date">' + dt.getDate() + '-' + (dt.getMonth() +1) + '-' + dt.getFullYear() + '</span>'; 
         //alert(cdate);
       // var _time = cdate + ' ' + h + ':' + m;
         var _time = cdate + ' <span class="time">' + h + ':' + m + '</span>';
       // var _time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
        var toConnID = $("#hdnconid").val();
        var msgReadStat = $("#hdnconid").data("isRead");
        if (toConnID== '')
            {
            toConnID = $("#hdnconid").data("pfnum");
        }

       // alert($("#hdnconid").data("pfnum"));

        if ($("#hdnconid").length) {
            var msg = {
                type: "message",
                message: $("#txtMsg").val(),
                toconnid: toConnID,                             // toconnid: $("#hdnconid").val(),
                FromName: $("#spnMySelf").text(),
                msgStatus: msgReadStat
            }
            

            connection.send(msg);
            //$("#divMsgs").append(msg.FromName + " : " + msg.message + "<br/>");
            $("#divMsgs").append($("<div>").addClass("snd").append(msg.message + "<span class='fullTime'>" + _time + "</span>"));
            //$("#divMsgs").append($("<div>").addClass("snd").append(_time));
            //$('#divMsgs').animate({
            //            scrollTop: $('#divMsgs').get(0).scrollHeight
            //}, 4500);
            $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });

            $("#txtMsg").val("");
        } else {
            alert("Select an online user to send message");
        }
    });
   


    $("#ulUsers").on("click", "li.OnlineUsers", function () {
        $('.asideThreads').addClass("slideHide");
        $('.chatContainer').addClass("slideShow");
        //Newly added by Meenatchi Sridharan on 08th April 2017
       
        //alert(this.id); 
        //alert("current user" + pfnum);
        var fromdate = new Date();
            var msg = {
                type: "history",
                toconnid: this.id,
                fromdate: fromdate
            }
           
        
       connection.send(msg);

        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $("span", this).remove();
        $("#divMsgs").html("");
        var spn = $("<span>").prop("id", $(this).prop("id")).append($(this).text()).addClass("OnlineUsers");
        $("#divChatUser").html("")
                            //.append($("<div>").addClass("toAvatar"))
                            .append(spn);
        //$("#divChatUser").append("<br/>");
        //var conid = $("<span>").prop("id", "spnconid").append($(this).data("conid"));
        //$("#divChatUser").append(conid);
        var hdn = $("<input>").prop("type", "hidden")
                                .prop("id", "hdnconid")
                                .data("isRead", "1")
                                .val($(this).data("conid"));
        $("#divChatUser").append(hdn);

    });

    $("#btnSendFile").change(function () {
        //alert(this);
        var files = this.files;
        var myData = new FormData();
        var filename = "";
        myData.append("method", "FileUpload");
        myData.append("type", "Ad");
        for (var i = 0; i < files.length; i++) {
            myData.append(files[i].name, files[i]);
            filename = files[i].name;
        }

        var pb = $("<div>");
        $(pb).progressbar({
            value: false
        });
        $("#divMsgs").append(pb);

        $.ajax({
            url: "ghFileUpload.ashx",
            type: "POST",
            data: myData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.err == "0") {
                    var msg = {
                        type: "fileshare",
                        message: $("#spnMySelf").text() + " has shared a file with you.",
                        filename: filename,
                        toconnid: $("#hdnconid").val(),
                        FromName: $("#spnMySelf").text(),
                        AttachID: response.AttachID
                    }
                    connection.send(msg);

                    $("#divMsgs").append($("<div>").addClass("snd")
                                                    .append($("<a>")
                                                            .prop("href", "ghFileDownload.ashx?file=" + filename)
                                                            .prop("target", "_blank")
                                                            .append($("<img>")
                                                                        .addClass("tn")
                                                                        .prop("alt", filename)
                                                                        .prop("src", "getThumbNail.ashx?file=" + filename)))
                        .append(" <br/> File sent! "));
                    //$('#divMsgs').animate({
                    //    scrollTop: $('#divMsgs').get(0).scrollHeight
                    //}, 4500);
                    $("#divMsgs").prop({ scrollTop: $("#divMsgs").prop("scrollHeight") });
                    //$("#divMsgs").append("<br/>" + msg.FromName + " : File sent successfully <br/>");
                } else {
                    alert(response.message);
                }
                $(pb).remove();
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        //console.log(percentComplete + "%");

                        //$(".progressBar").progressbar("value", percentComplete);
                        $(pb).progressbar("value", percentComplete);

                        if (percentComplete === 100) {
                            $(pb).progressbar("value", false);
                        }

                    }
                }, false);

                return xhr;
            },
            error: function (XHR, txtStatus, errThrown) {
                //alert(txtStatus);
                alert(XHR.responseText);
            }
        }); //End of ajax function
    });
    

    //this function is to load the conversation on demand - starts
    $("#divMsgs").on("click", "span.loadOld", function (e) {
        //        alert("inside loadOldmsgs");
       // alert($(this).data("pfnum"));
       // alert($(this).data("todate"));

       // var fromdate = new Date();
        var msg = {
            type: "ondemand",
            toconnid: $(this).data("pfnum"),
            fromdate: $(this).data("todate")
            //todate:fromdate
        }
        connection.send(msg);
     

    });

    //this function is to load the conversation on demand - ends



    //OfflineUsers - To send messages

    $("#ulUsers").on("click", "li.OfflineUsers", function () {

        $('.asideThreads').addClass("slideHide");
        $('.chatContainer').addClass("slideShow");
        //Newly added by Meenatchi Sridharan on 23rd May 2017

        //alert(this.id); 
        //alert("current user" + pfnum);
        var fromdate = new Date();
        var msg = {
            type: "history",
            toconnid: this.id,
            fromdate: fromdate
        }
       // alert("InsideOfflineUsers:" + this.id); 

        connection.send(msg);

        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $("span", this).remove();
        $("#divMsgs").html("");
        var spn = $("<span>").prop("id", $(this).prop("id")).append($(this).text()).addClass("OfflineUsers");
        $("#divChatUser").html("")
            .append($("<div>").addClass("toAvatar"))
            .append(spn);
        //$("#divChatUser").append("<br/>");
        //var conid = $("<span>").prop("id", "spnconid").append($(this).data("conid"));
        //$("#divChatUser").append(conid);
        var hdn = $("<input>").prop("type", "hidden")
            .prop("id", "hdnconid")
            .data("pfnum", this.id)
            .data("isRead", "0")
            .val($(this).data("conid"));
        $("#divChatUser").append(hdn);

    });
});



