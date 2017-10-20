<template>
  <div id="app"> 

    <div class="topnav">
      <a href="#/">Intro</a>
      <a href="#/bar">Books</a>
      <a href="#">Link</a> 
    </div>

    <div class="content">
      <h2>CSS Template</h2>
      <p>A topnav, content and a footer.</p>
    </div>


    <img src="./assets/logo.png">
    <br>
    <br>
    <br>
    <br>
    <a>bye</a>
    <br>
    <router-view/>


    <div class="footer">
      <p>Footer</p>
    </div>
  </div>
</template>

<script>
  export default {
      name: 'app'
  }
</script>


<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2a6db0;
     //margin-top: 60px;
  }

* {
    box-sizing: border-box;
}

body {
    margin: 0;
}

/* Style the top navigation bar */
.topnav {
    overflow: hidden;
    background-color: #333;
    position: fixed;
    top: 0;
    width: 100%;
}

/* Style the topnav links */
.topnav a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

/* Change color on hover */
.topnav a:hover {
    background-color: #ddd;
    color: black;
}

/* Style the content */
.content {
    background-color: #ddd;
    padding-top: 40px;
    height: 200px; /* Should be removed. Only for demonstration */
}

/* Style the footer */
.footer {
    background-color: #f1f1f1;
    padding: 10px;
}


</style>
