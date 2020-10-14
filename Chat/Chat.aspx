<%@ Page Title="" Language="VB" MasterPageFile="~/MYSKM.master" AutoEventWireup="false" CodeFile="Chat.aspx.vb" Inherits="HRD_Chat" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <%--<script src="Scripts/jquery-1.6.4.min.js"></script>--%>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js" type="text/javascript"></script>
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/ui-lightness/jquery-ui.css" rel="Stylesheet" type="text/css" />

   <%-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>--%>

    <script src="scripts/jquery.signalR-2.2.1.min.js"></script>
    <script src="scripts/Chats.js"></script>  

    <%--<link href="hrFonts/iconStyle.css" rel="stylesheet" /> --%> 
    <link href="content/custom.css" rel="stylesheet" />
    <link href="content/font-awesome.css" rel="stylesheet" />

    <div class="mainContainerChat"> 
            <div class="asideThreads">
                <div class="user">
                    <span class="toggleUsersList fa fa-fw fa-arrow-right"></span>
                    <div class="userAvatar">    
                      <%--  <img src="images/Employee/User2.jpg" />--%>
                    </div> 
                    <div id="spnMySelf"></div> 
 
                </div> 
                <div id="divUsers">
                    <%--<span class="badge1" data-badge="5">Online Users</span>--%>
                    <span class="active">All Users <i class="icon-circle-down pull-right"></i> </span>
                    <ul id="ulUsers"></ul>
                </div>
            </div>  <!-- end asideThreads -->
            <div class="chatContainer">
                <div class="chatHead"> 
                    <span class="fa fa-fw fa-angle-left slideBack"></span>
                        <%--<a class="backButton" href="Default.aspx"> <span class="icon-arrow-left2"></span> Back</a>--%> 
                        <%--<div class="toAvatar">
                            <img src="images/Employee/User1.jpg" />
                        </div>--%> 
                    <div id="divChatUser">  </div> 
                </div>
                
                <div id="divMsgs"></div>
                <%--<div id="defStyles"> kaj flkj asdlkf laskdj flkasdj flkaj sd</div>--%>
                <div id="divSend"> 
                    <textarea id="txtMsg" class="inputMsg" placeholder="Enter Message Here ..."></textarea>
                    <div class="sendEmo">
                        <div class="emjBox">
                            <ul>
                                <li> <span class="icon-smile2"></span> </li> 
                                <li> <span class="icon-happy2"></span> </li> 
                                <li> <span class="icon-wink2"></span> </li> 
                                <li> <span class="icon-tongue2"></span> </li> 
                                <li> <span class="icon-sad2"></span> </li> 
                                <li> <span class="icon-grin2"></span> </li> 
                                <li> <span class="icon-cool2"></span> </li> 
                                <li> <span class="icon-angry2"></span> </li> 
                                <li> <span class="icon-evil2"></span> </li>
                                <li> <span class="icon-shocked2"></span> </li>
                                <li> <span class="icon-baffled2"></span> </li>   
                                <li> <span class="icon-confused2"></span> </li>  
                                <li> <span class="icon-neutral2"></span> </li> 
                                <li> <span class="icon-hipster2"></span> </li> 
                                <li> <span class="icon-wondering2"></span> </li> 
                                <li> <span class="icon-sleepy2"></span> </li> 
                                <li> <span class="icon-frustrated2"></span> </li>   
                                <li> <span class="icon-crying2"></span> </li>  
                                <li> <span class="icon-thumb-up2"></span> </li> 
                                <li> <span class="icon-thumb-down2"></span> </li>   
                            </ul>
                        </div>
                        <span class="icon-happy"></span>
                    </div>
                    <div class="sendFile"> 
                        <label for="btnSendFile"> <span class="icon-attachment"></span></label> 
                        <input id="btnSendFile" type="file"/>  
                    </div>
                    <button id="btnSend" class="fa fa-fw fa-send" ></button>
                </div>


                <%--<div id="divPvtChat" title="Private Chat" style="display: none;">
                   
                </div> --%>
            </div> <!-- end chatContainer -->
        </div> <!-- end mainContainer --> 
</asp:Content>

