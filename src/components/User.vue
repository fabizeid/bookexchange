<template>
  <div class="user container">
    <b-row>
      <b-col>
        <!-- User id: {{$route.params.id}} <br> -->
        <!-- URL: {{baseURL}}/#/user/{{$route.params.id}} -->
      <!-- </b-col> -->
      <!-- <b-col> -->
        <div class="pane-chat" tabindex="0">
          <!-- <div class="pane-chat-tile"></div> -->

            <div class="pane-chat-body">

                <div class="msgf msgf-system">
                  <a>Today</a>
                </div>
              <!-- <div class="msg msg-system"> -->
              <!--   <div class="message message-system"> -->
              <!--     Today -->
              <!--   </div> -->
              <!-- </div> -->
              <div class="msgf msgf-in tail msgf-cont">
                <a>Merry Christmas Farid!!!</a>
                <a>10:49 AM</a>
              </div>
              <div class="msgf msgf-in">
                <a>Merry Christmas Farid!!!</a>
                <a>10:49 AM</a>
              </div>
              <div class="msgf msgf-out tail">
                <a>Merry Christmasto you!!!</a>
                <a>10:49 AM</a>
              </div>

                <div class="msg msg-continuation">
                  <div class="message  message-in">
                    <span class="tail-container"></span>
                    <div class="bubble">
                      <div class="wr">
                        <a>Merry Christmas Farid!!!</a>
                      </div>
                      <div class="bubble-text-meta">
                        <a>10:49 AM</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="msg">
                  <div class="message  message-in">
                    <div class="bubble">
                      <div class="wr">
                        <a>Merry Christmas!!!</a>
                      </div>
                      <div class="bubble-text-meta">
                        <span class="va">10:49 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="msg msg-continuation">
                  <div class="message  message-out">
                    <span class="tail-container"></span>
                    <div class="bubble">
                      <div class="wr">
                        <a>You




                          
                          too!!!</a>
                      </div>
                      <div class="bubble-text-meta">
                        <span class="va">10:49 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                

            </div>

          <footer  class="pane-footer">
          </footer>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>


export default {
    name: 'User',
    data () {
	return { baseURL: window.location.origin}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
col {
    padding: 0;
}
.pane-chat {
    background-color: #e5ddd5;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    //height: 100%;
    height: 20rem;
    //position: absolute;
    //-webkit-transform-origin: left top;
    //transform-origin: left top;
    width: 100%
}
.pane-chat-tile {
    background-image: url('https://web.whatsapp.com/img/8a055527b27b887521a9f084497d8879.png');
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.06;
    background-repeat: repeat repeat
}

.pane-chat-body {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    border-left: 1px solid rgba(0,0,0,0.03);
    width: 100%;
    height: 100%;
    padding-left: 0;
    padding-bottom: 8px;
    -webkit-flex: 1 1 0;
    flex: 1 1 0;

}

.msg {
    padding-left: 5%;
    padding-right: 5%;
    margin-bottom: 12px;
    position: relative;
}

.msg:after {
    content: '';
    display: table;
    clear: both;
}

.msg-system {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
}
.msgf {
    font-family: "Open Sans",sans-serif;
    font-size: 13.6px;
    line-height: 19px;
    color: #262626;
    margin-bottom: 12px;
    margin-left: 5%;
    margin-right: 5%;
}
.msgf-system{
    align-self: center;
    font-size: 12.5px;
    line-height: 21px;
    border-radius: 7.5px;
    color: rgba(69,90,100,0.95);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    background-color: rgba(225,245,254,0.92);
    padding: 5px 12px 6px 12px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
    
}

.msgf-in{
    background-color: #fff;
    //    float: left;
    align-self: flex-start;
}
.msgf-out{
    background-color: #dcf8c6;
    align-self: flex-end;
}



.msgf-in, .msgf-out {
    border-radius: 7.5px;
    position: relative;//needed for tail
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
    max-width: 95%;
    min-width: 110px;
    box-sizing: border-box;
    padding: 6px 0 8px 0;
    padding-left: 9px;
    padding-right: 7px;
}

.msgf-in > a:first-child::after,
.msgf-out > a:first-child::after{
    content: "";
    display: inline;
    margin-right: 78px;
}
.msgf-in > a:last-child,
.msgf-out > a:last-child{
    position: absolute;
    bottom: 3px;
    right: 7px;
    color: rgba(0, 0, 0, 0.45);
    font-family: "Roboto", sans-serif;
    font-size: 11px;
    height: 15px;
    line-height: 15px;
    white-space: nowrap;
}

.msgf-in.tail::before{
    content: '';
    position: absolute;
    left: -12px;
    top: 0px;
    border-width: 16px 0px 0 16px;
    border-style: solid;
    border-color: white transparent;
}
.msgf-out.tail::before{
    content: '';
    position: absolute;
    right: -12px;
    top: 0px;
    border-width: 16px 16px 0 0px;
    border-style: solid;
    border-color: #dcf8c6 transparent;
}

.msgf-cont{
    margin-bottom: 2px;    
}
.msg.msg-continuation {
    margin-bottom: 2px;
}

.message:last-of-type {
    margin-bottom: 0;
}

.message-system {
    -webkit-flex: none;
    flex: none;
    max-width: 100% !important;
    text-align: center;
    font-size: 12.5px;
    line-height: 21px;
    display: inline-block;
    border-radius: 7.5px;
    color: rgba(69,90,100,0.95);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    background-color: rgba(225,245,254,0.92);
    padding: 5px 12px 6px 12px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
}
.message {
    font-family: "Open Sans",sans-serif;
    font-size: 13.6px;
    line-height: 19px;
    color: #262626;
}

.message-in {
    background-color: #fff;
    float: left;
}

.message-out {
    background-color: #dcf8c6;
    float: right;
}

.message-in, .message-out {
    border-radius: 7.5px;
    position: relative;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
    max-width: 95%;
}
.message-in .tail-container {
    content: '';
    position: absolute;
    left: -12px;
    top: 0px;
    border-width: 30px 0px 0 30px;
    border-style: solid;
    border-color: white transparent;
}

.message-out .tail-container {
    content: '';
    position: absolute;
    right: -12px;
    top: 0px;
    border-width: 30px 30px 0 0px;
    border-style: solid;
    border-color: #dcf8c6 transparent;
}

.bubble {
    padding: 6px 0 8px 0;
    padding-left: 9px;
    padding-right: 7px;
    min-width: 110px;
    box-sizing: border-box;
}

.wr {
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.wr::after {
    content: "";
    display: inline;
    margin-right: 78px;
}
.bubble-text-meta {
    position: absolute;
    bottom: 3px;
    right: 7px;
    color: rgba(0, 0, 0, 0.45);
    font-family: "Roboto", sans-serif;
    font-size: 11px;
    height: 15px;
    line-height: 15px;
    white-space: nowrap;
}
.pane-footer{
    height: 5rem ;
    background-color: grey;
    }
</style>
