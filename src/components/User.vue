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
            <b-form-textarea
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

  </div>
</template>

<script>

let reactiveData = {};
let nonreactiveData = {};
let unsubscribe = null;
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
    watch: {
	'rootData.signedIn': function (signedIn) {
	    if(signedIn) {
		// User is signed in.
                reset();
                if(!unsubscribe) unsubscribe =
		    loadDb(this);
	    } else {
                // User is signed out.
		if (unsubscribe) {
		    //unsubscribe[0]();unsubscribe[1]();
		    unsubscribe = null
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
        }

    },
    created: function(){
	console.log("User created");
        //Set non reactive Data
        Object.assign(this, nonreactiveData);

	/*will only be called once when created, for subsequent
         signins we use the watch*/
	if (this.rootData.signedIn)
	    unsubscribe = loadDb(this);
    }
}
function reset(){
    Object.assign(reactiveData,
                  {  text: '',
                     messages: []
                  });
}


function loadDb (vm) {
    let db = vm.rootData.firebase.firestore();
    let fromID = vm.rootData.uid;
    let toID = vm.$route.params.id;
    let sentMsgs = [];
    let mergedMsgs = [];
    db.collection("users").doc(fromID)
        .collection("chatrooms").doc(toID)
        .collection("messages").orderBy("createdTime")
     	.get()
     	.then(function(querySnapshot) {
	    sentMsgs = querySnapshot.docs;
     	})
     	.catch(function(error) {
            console.error("Error getting out messages: ", error);
     	});

    let firstSnapshot = true;
    let unsubscribe = db.collection("users").doc(fromID)
        .collection("chatrooms").doc(toID)
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
     	          
    return unsubscribe;
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
        if (dtDate == new Date().toLocaleDateString())
            dtDate = "Today";
        
        let sysDt = { sys: true,
                      text: dtDate};
        messages.push(sysDt);
    }

    messages.push(dt);
}
function addMsg(fs,fromID,toID,msgtxt){
    let db = fs();
    let msg = {
        text: msgtxt,
        createdTime: fs.FieldValue.serverTimestamp()
    }
    // Add to DB
    db.collection("users").doc(fromID)
        .collection("chatrooms").doc(toID)
        .collection("messages").add(msg)
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});

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
    //margin-bottom: 8px;
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
