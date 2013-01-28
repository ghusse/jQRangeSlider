// Simple phantom.js integration script
// Adapted from Modernizr

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis :  30001 //< Default Max Timout is 30s
    , start = new Date().getTime()
    , condition = false
    , interval = setInterval(function () {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
          // If not time-out yet and condition not yet fulfilled
          condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()) //< defensive code
        } else {
          if (!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            console.log("'waitFor()' timeout")
            phantom.exit(1)
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            typeof(onReady) === "string" ? eval(onReady) : onReady() //< Do what it's supposed to do once the condition is fulfilled
            clearInterval(interval) //< Stop this interval
          }
        }
    }, 500) //< repeat check every 500ms
}


if (phantom.args.length === 0 || phantom.args.length > 2) {
  console.log('Usage: phantom.js URL')
  phantom.exit()
}

var page = new WebPage()

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
  console.log(msg)
};

page.open(phantom.args[0], function(status){
  var previous = 0;

  if (status !== "success") {
    console.log("Unable to access network")
    phantom.exit()
  } else {
    waitFor(function(){
       var current = page.evaluate(function(){
        var el = document.getElementById('qunit-testresult')
        try {
          return el.getElementsByClassName('total')[0].innerText
        } catch (e) { }
        return 0
      });

       if (current == previous){
        console.log("Tests: " + current);
        return true;
       }

       previous = current;
       return false;
    }, function(){
      var failedNum = page.evaluate(function(){
        var el = document.getElementById('qunit-testresult'),
          failed;
        try {
          failed = el.getElementsByClassName('failed')[0].innerHTML
          console.log("Failed: " + failed)
          return failed;
        } catch (e) { }
        
        return 10000
      });
      phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0)
    })
  }
})