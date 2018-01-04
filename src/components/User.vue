<template>
  <div class="user container">
    <b-row>
      <b-col>
        <!-- User id: {{$route.params.id}} <br> -->
        <!-- URL: {{baseURL}}/#/user/{{$route.params.id}} -->
        <!-- </b-col> -->
        <!-- <b-col> -->
        <div class="pane-chat" tabindex="0">
          <!-- <div class="pane-chat-tile"/> -->
          <div class="pane-chat-body">            
            <div class="msg msg-system">
              <a>Today</a>
            </div>
            <div class="msg msg-in tail msg-cont">
              <a>Merry Christmas Farid!!!</a>
              <a>10:49 AM</a>
            </div>
            <div class="msg msg-in">
              <a>Merry Christmas Farid!!!</a>
              <a>10:49 AM</a>
            </div>
            <div class="msg msg-out tail msg-cont">
              <a>Merry Christmasto you!!!</a>
              <a>10:49 AM</a>
            </div>
            <div class="msg msg-out">
              <a>How are you you!!!</a>
              <a>10:49 AM</a>
            </div>
          </div>

          <footer  class="pane-footer">
             <b-form-input 
                  type="text"
                  placeholder="Type a message"></b-form-input>
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
    display: flex;
    flex-direction: column;
    height: 20rem;
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
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    border-left: 1px solid rgba(0,0,0,0.03);
    width: 100%;
    height: 100%;
    padding-left: 0;
    padding-bottom: 8px;
    flex: 1 1 0;

}

.msg {
    font-family: "Open Sans",sans-serif;
    font-size: 13.6px;
    line-height: 19px;
    color: #262626;
    margin-bottom: 12px;
    margin-left: 5%;
    margin-right: 5%;
}
.msg-system{
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

.msg-in{
    background-color: #fff;
    //    float: left;
    align-self: flex-start;
}
.msg-out{
    background-color: #dcf8c6;
    align-self: flex-end;
}



.msg-in, .msg-out {
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

.msg-in > a:first-child::after,
.msg-out > a:first-child::after{
    content: "";
    display: inline;
    margin-right: 78px;
}
.msg-in > a:last-child,
.msg-out > a:last-child{
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

.msg-in.tail::before{
    content: '';
    position: absolute;
    left: -12px;
    top: 0px;
    border-width: 16px 0px 0 16px;
    border-style: solid;
    border-color: white transparent;
}
.msg-out.tail::before{
    content: '';
    position: absolute;
    right: -12px;
    top: 0px;
    border-width: 16px 16px 0 0px;
    border-style: solid;
    border-color: #dcf8c6 transparent;
}

.msg-cont{
    margin-bottom: 2px;    
}

.msg:last-of-type {
    margin-bottom: 0;
}

.pane-footer{
    height: 5rem ;
    background-color: #f5f1ee;
    display: flex;
    align-items: center;    
}
.pane-footer > input {
    margin-left: 8%;
    margin-right: 8%;
    border-radius: 15px;
}

</style>
