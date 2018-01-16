<template>
  <div class="user container">
    <b-row>
      <b-col>
        <!-- Check if signed in before showing  page -->
        <!-- User id: {{$route.params.id}} <br> -->
        <!-- URL: {{baseURL}}/#/user/{{$route.params.id}} -->
        <!-- </b-col> -->
        <!-- <b-col> -->
        <div class="pane-chat" tabindex="0">
          <!-- <div class="pane-chat-tile"/> -->
          <div id="pane-chat-body" class="pane-chat-body">
            <div style="height: 100%;"/>
            <div v-for="mess in messages"
                 :class="['msg',
                         {'msg-out':mess.out},
                         {'msg-in':mess.in},
                         {'msg-sys':mess.sys},
                         {'tail': mess.tail} ]">
              <a>{{mess.text}}</a>
              <a v-if="!mess.sys">{{mess.time}}</a>
            </div>
          </div>

          <footer  class="pane-footer">
            <!-- @keydown.enter.native="newMsg($event.target)" -->
            <b-form-textarea v-if="rootData.signedIn"
               v-model="text"
               :no-resize="true"
               placeholder="Enter something"
               :rows="1"
               :max-rows="6"
               @keydown.enter.native.stop.prevent="newMsg($event.target)"
               ></b-form-textarea>
          </footer>
        </div>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col class="mt-5">
        <ul>
          <li v-for="notif in sortedNotifications">
            <!-- {{notif.key}}{{notif.name}}{{notif.email}}{{notif.lastUpdateTime}} -->
            <router-link v-if="notif.key" :to="{ name: 'user', params: { id: notif.key }}" @click.prevent>{{notif.name}}</router-link>
            <a>Email: {{notif.email}}</a>
          </li>
        </ul>
      </b-col>
    </b-row>

  </div>
</template>

<script>

let reactiveData = {};
let nonreactiveData = {unsubscribeMsgCb: null,
                       unsubscribeNotifCb: null,
                      userID: null};

export default {
    name: 'User',
    data () {
        reset();
	reactiveData.rootData = this.$root.$data;
        baseURL: window.location.origin;
	return reactiveData;
    },
    methods: {
	logme(m) {
	    console.log(m);
	},
        newMsg(el){
            // let chatBody =
            //     el.parentElement.parentElement.querySelector(".pane-chat-body");
            let fromID = this.rootData.uid;
            let toID = this.$route.params.id;
            let fs = this.rootData.firebase.firestore;
            let tail = true;
            addMsg(fs,fromID,toID,this.text);
            if(this.messages.length > 0 &&
               this.messages[this.messages.length-1].hasOwnProperty("out")){
                tail = false;
            }
            let dt = {text:this.text,
                      createdTime: new Date()};
            pushNewMsg(this.messages,dt,true);
            this.text='';

        }
    },
    computed: {
        sortedNotifications(){
	    let orderBy = require('lodash.orderby');
            return orderBy(this.notifications,
                            [notif => notif.lastUpdateTime],['desc']);
        }
    },
    watch: {
	'rootData.signedIn': function (signedIn) {
	    if(signedIn) {
		// User is signed in.
                reset();
		loadDb(this);
	    } else {
                // User is signed out.
		if (this.unsubscribeMsgCb) {
		    this.unsubscribeMsgCb();
		    this.unsubscribeMsgCb = null
		}
		if (this.unsubscribeNotifCb) {
		    this.unsubscribeNotifCb();
		    this.unsubscribeNotifCb = null
		}
		/*if (this.$router.currentRoute.name == 'profile')
		    this.$router.go(-1); //go back to previous page*/
                reset();
	    }
	    console.log(" Profile signed in status "+ signedIn);
	},
        messages: function(){
            let chatBody = document.getElementById("pane-chat-body");
            this.$nextTick(function () {
                chatBody.scrollTop = chatBody.scrollHeight;
            })
        },
        '$route' (to, from) {
            // react to route changes...
            if ((to.name == "user") &&
                (this.userID != to.params.id)){
                this.userID = to.params.id;
                if (this.unsubscribeMsgCb) {
	            this.unsubscribeMsgCb();
	            this.unsubscribeMsgCb = null;
	        }
                resetMsg();
                if (this.rootData.signedIn)
	            loadMsgDb(this);

            }
        }
    },
    created: function(){
	console.log("User created");
        //Set non reactive Data
        Object.assign(this, nonreactiveData);
        this.userID = this.$route.params.id;
	/*will only be called once when created, for subsequent
         signins we use the watch*/
	if (this.rootData.signedIn)
	    loadDb(this);
    }
}
function reset(){
    resetMsg();
    resetNotif();
}

function resetNotif(){
    Object.assign(reactiveData,
                  {
                      notifications: []
                  });
}

function resetMsg(){
    Object.assign(reactiveData,
                  {  text: '',
                     messages: []
                  });
}


function loadDb (vm) {
    loadNotifDb(vm);
    loadMsgDb (vm);
}

function loadNotifDb (vm) {
    let db = vm.rootData.firebase.firestore();
    let fromID = vm.rootData.uid;
    if(vm.unsubscribeNotifCb) console.error("subscription expected to be null")
    vm.unsubscribeNotifCb = db.collection("users").doc(fromID)
        .collection("chatrooms")
     	.onSnapshot(function(querySnapshot) {
            querySnapshot.docChanges.forEach(function(change) {
                let dt = change.doc.data();
		let key = change.doc.id;
                if(!dt.lastUpdateTime) return; //skip if null
                dt.key = key;
		if (change.type === "added") {
		    reactiveData.notifications.push(dt);
		} else {
		    let index = indexForKey (reactiveData.notifications,key);
		    if (change.type === "modified") {
                        if (index === undefined){
                            reactiveData.notifications.push(dt);
                        } else {
			    /*Can't use indexing as Vue will not trigger*/
			    reactiveData.notifications.splice(index,1,dt);
                        }
		    } else {
			if (change.type === "removed") {
			    reactiveData.notifications.splice(index,1 );
			}
		    }
		}
            });
        });

}

function loadMsgDb (vm) {
    let db = vm.rootData.firebase.firestore();
    let fromID = vm.rootData.uid;
    let toID = vm.$route.params.id;
    let sentMsgs = [];


    db.collection("users").doc(fromID)
        .collection("chatrooms").doc(toID)
        .collection("messages").orderBy("createdTime")
     	.get()
     	.then(function(querySnapshot) {
	    sentMsgs = querySnapshot.docs;
            if(vm.unsubscribeMsgCb) console.error("subscription expected to be null")
            vm.unsubscribeMsgCb = loadInMessages(vm,sentMsgs);
     	})
     	.catch(function(error) {
            console.error("Error getting out messages: ", error);
     	});
}

function loadInMessages(vm,sentMsgs){
    let db = vm.rootData.firebase.firestore();
    let fromID = vm.rootData.uid;
    let toID = vm.$route.params.id;
    let mergedMsgs = [];
    let firstSnapshot = true;
    let unsubscribeMsgCb = db.collection("users").doc(toID)
        .collection("chatrooms").doc(fromID)
        .collection("messages").orderBy("createdTime")
     	.onSnapshot(function(querySnapshot) {
            let dtr = {};
            let dts = {};
            let sentMsgsIdx = 0;
            if (firstSnapshot) {
	        querySnapshot.docChanges.forEach(function(change) {
                    if (change.type != "added")
                        console.error("change type not expected");
                    dtr = change.doc.data();
                    for( ;sentMsgsIdx < sentMsgs.length;sentMsgsIdx++){
                        dts = sentMsgs[sentMsgsIdx].data();
                        if(dts.createdTime < dtr.createdTime){
                            pushNewMsg(mergedMsgs,dts,true);
                        } else {
                            break;
                        }
                    }
                    pushNewMsg(mergedMsgs,dtr,false);
                })
                //merge remaining dts
                for( ;sentMsgsIdx < sentMsgs.length;sentMsgsIdx++){
                    dts = sentMsgs[sentMsgsIdx].data();
                    pushNewMsg(mergedMsgs,dts,true);
                }
                vm.messages = mergedMsgs;
                firstSnapshot = false;
            } else {
                querySnapshot.docChanges.forEach(function(change) {
                    if (change.type === "added"){
                        dtr = change.doc.data();
                        if(!dtr.createdTime){
                            //date is from local cache no server timestamp yet,
                            //create a temporary one,
                            dtr.createdTime = new Date();
                        }
                        pushNewMsg(vm.messages,dtr,false);
                    }
                })
            }
     	})

    return unsubscribeMsgCb;
}

function pushNewMsg(messages,dt,isOut){
    let tail = true;
    if(isOut) {
        dt.out = true;
    } else {
        dt.in = true;
    }

    //Do we need a tail
    if ((messages.length > 0) &&
        ((dt.out && messages[messages.length-1].hasOwnProperty("out")) ||
         (dt.in && messages[messages.length-1].hasOwnProperty("in"))))
    {
        tail = false;
    }
    dt.tail = tail;

    //Parse time
    dt.time =
        dt.createdTime
        .toLocaleTimeString()
        .replace(/:.. /,' ');

    //Do we need to add a Date
    let dtDate = dt.createdTime.toLocaleDateString();
    if ((messages.length == 0) ||
        (dtDate != messages[messages.length-1]
         .createdTime.toLocaleDateString()))
    {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate()-1);

        if (dtDate == today.toLocaleDateString())
            dtDate = "Today";
        else if (dtDate == yesterday.toLocaleDateString())
            dtDate = "Yesterday";

        let sysDt = { sys: true,
                      text: dtDate};
        messages.push(sysDt);
    }

    messages.push(dt);
}
function addMsg(fs,fromID,toID,msgtxt){
    let db = fs();
    let batch = db.batch();
    let msg = {
        text: msgtxt,
        createdTime: fs.FieldValue.serverTimestamp()
    }
    let lastUpdate = {lastUpdateTime: fs.FieldValue.serverTimestamp()};
    // Add to DB
    let newMsgRef = db.collection("users").doc(fromID)
        .collection("chatrooms").doc(toID)
        .collection("messages").doc();
    batch.set(newMsgRef,msg);

    let notifyToRef = db.collection("users").doc(toID)
        .collection("chatrooms").doc(fromID);
    batch.set(notifyToRef,lastUpdate,{merge: true});

    if (toID != fromID){
        let notifySelfRef = db.collection("users").doc(fromID)
            .collection("chatrooms").doc(toID);
        batch.set(notifySelfRef,lastUpdate,{merge: true});
    }

    batch.commit()
	.then(function() {
	    console.log("Added message");
	})
	.catch(function(error) {
	    console.error("Error adding message: ", error);
	});

}
function indexForKey (array, key, keyname) {
    if(typeof keyname === "undefined") {
        keyname = 'key';
    }
    for (let i = 0; i < array.length; i++) {
    if (array[i][keyname] === key) {
      return i
    }
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
    height: 26rem;
    max-width:360px;
    width: 100%;
}
.pane-chat-tile {
    background-image: url('https://web.whatsapp.com/img/8a055527b27b887521a9f084497d8879.png');
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.06;
    background-repeat: repeat repeat;
    z-index: -1;
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
}

.msg {
    font-family: "Open Sans",sans-serif;
    font-size: 13.6px;
    line-height: 19px;
    color: #262626;
    margin-top: 2px;
    margin-left: 5%;
    margin-right: 5%;
}
.msg-sys{
    align-self: center;
    font-size: 12.5px;
    line-height: 21px;
    border-radius: 7.5px;
    color: rgba(69,90,100,0.95);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    background-color: rgba(225,245,254,0.92);
    padding: 5px 12px 6px 12px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
    margin-top: 8px;
}

.msg-in{
    background-color: #fff;
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
    max-width: 15.5rem;
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

.tail{
    margin-top: 8px;
}
.msg-cont{
    margin-bottom: 2px;
}

.msg:last-of-type {
    margin-bottom: 0;
}

.pane-footer{
    background-color: #f5f1ee;
    display: flex;
}
.pane-footer > textarea {
    margin-left: 8%;
    margin-right: 8%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 15px;
}

</style>
