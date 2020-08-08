var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var notes = ["note-1", "note-2", "note-3"];
var boxes = ["box-1", "box-2", "box-3"];
var bgColors = ["#fff6a6", "#b7caf7", "#e4d3f0", "#a0dba1", "#ffe4b5", "#e3b0af", "black"]; //white, yellow, blue, lilac, green, orange, pink


  document.onload = initialize();
  document.getElementById('btn-1').onclick = function() { bringUpNote('note-1', 'box-1'); }
  document.getElementById('btn-2').onclick = function() { bringUpNote('note-2', 'box-2'); }
  document.getElementById('btn-3').onclick = function() { bringUpNote('note-3', 'box-3'); }
  // document.getElementById('btn-4').onclick = function() { bringUpNote('note-4', 'box-4'); }
  document.getElementById('btn-4').onclick = function() { setColor();  }

  // function changeBg() {
  //   chrome.storage.sync.get(['colorID'], function(result)) {
  //
  //   }
  // }

function initialize() {
  startTime();
  getLocation();
  initializeBg();
}

function initializeBg() {
  chrome.storage.sync.get(["colorBgId"], function(color) {
    // console.log(bgColors[0]);
    var n;
    if(color["colorBgId"] != undefined) {
      $("body").css("background", bgColors[color["colorBgId"]]);
      $(".action-boxes-container").css("background", bgColors[color["colorBgId"]]);
      n = color["colorBgId"];
    } else {
      // document.body.style.background = String(bgColors[n]);
      $("body").css("background", bgColors[5]);
      $(".action-boxes-container").css("background", bgColors[5]);
      chrome.storage.sync.set({"colorBgId" : 5}, function(){});
      n = color["colorBgId"];
    }


  });
}

function setColor() {
  chrome.storage.sync.get(["colorBgId"], function(color) {

    var n;
    if(color["colorBgId"] != undefined) {
      n = color["colorBgId"] + 1;
      if(n > bgColors.length - 1) {
        n = 0;
      }
      // console.log(bgColors[n]);
      // document.body.style.background = String(bgColors[n]);
      $("body").css("background", String(bgColors[n]));
      $(".action-boxes-container").css("background", bgColors[n]);
      chrome.storage.sync.set({"colorBgId" : n}, function(){});
    } else {
      n = 0;
      // document.body.style.background = String(bgColors[n]);
      $("body").css("background", String(bgColors[n]));
      $(".action-boxes-container").css("background", bgColors[n]);
      chrome.storage.sync.set({"colorBgId" : n}, function(){});
    }

  });
}


  function getDate() {
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth();
    var d = n.getDate();


    m = months[m];
    dayOfWeek = days[n.getDay()];
    document.getElementById("date-message").innerHTML = "It\'s " + dayOfWeek + ", " + m + " " + d;


  }

  var hour;
  function startTime() {
     var today = new Date();
     var h = today.getHours();
     var m = today.getMinutes();
     h = checkTime(h);
     m = checkTime(m);
     document.getElementById("clock").innerHTML = h + ":" + m ;
     var t = setTimeout(startTime, 500);

     getDate();

   }


  function checkTime(i) {
   if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
   return i;
  }

  function bringUpNote(i, b) {
    var loop;
    var x = document.getElementById(i);
    var y = document.getElementById(b);
    for(loop = 0; loop < notes.length; loop++)
    {
      if(notes[loop] == i) {

        if(x.style.transform === "translateY(-5em)") {
        x.style.transform = "translateY(20em)";
        y.style.boxShadow = "0 0 0 white";
        y.style.background = "#616161";


        } else {
          x.style.transform = "translateY(-5em)";
          y.style.boxShadow = "0 0 .5em white";
          y.style.background = "white";

        }
      } else {
        document.getElementById(notes[loop]).style.transform = "translateY(20em)";
        document.getElementById(boxes[loop]).style.boxShadow = "0 0 0 white";
        document.getElementById(boxes[loop]).style.background = "#616161";
      }



    }
  }

  var lat;
  var long;

  function getLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(getPosSuccess, getPosErr);
    }
    else {
      getPosErr(null);
    }
  }

  function getPosSuccess(pos) {
    lat = pos.coords.latitude.toFixed(4);
    long = pos.coords.longitude.toFixed(4);
    getWeather(lat, long)

  }

  function getPosErr(err) {
    var hour = new Date().getHours();
    var mes = "Something went terribly wrong...";
    var icon = "cyclone";
    if(5 <= hour && hour <= 18) {
      mes = "Have a good day. Be productive and well.";
      icon = "sunny"
    } else if(18 < hour && hour <= 23) {
      mes = "The moon rises for you to rest. Take this time to relax if you can.";
      icon = "moon";
    } else if (0 <= hour && hour <= 4) {
      mes = "What an odd hour...are you going to sleep soon?";
      icon = "moon";
    } else {
      mes = "Something went terribly wrong...";
      icon = "cyclone";
    }

    document.getElementById('greeting').innerHTML = mes;
    document.getElementById(icon).style.display = "inline-block";
  }

  function getWeather(lat, long) {
    $(document).ready(function() {
      $.getJSON("https://api.weatherapi.com/v1/current.json?key=42bf3344eb874ad0849233848201605&q=" + String(lat) + "," + String(long), function(data) {
      document.getElementById('greeting').innerHTML = data.current.condition.text + " in " + data.location.name;
      setIcon(data.current.condition.code);
    }).error( function() {getPosError()})
    });

  }

  function setIcon(code) {
    iconID = "sunnyshowers";

    if(code === 1000) { //sunny
      var check = new Date().getHours();
      if(5 < check && check < 18) {
      iconID = "sunny";
      } else {
        iconID = "fullmoon";
      }
       // document.getElementById("sunny").style.display = disp;
    }
    else if(code === 1003) { //partly cloudy
      iconID = "partlycloudy";
      // document.getElementById("partlycloudy").style.display = disp;
    }
    else if(code === 1006 || code === 1009 || code === 1030) { //cloudy, overcast, mist
      iconID = "cloudy";
      // document.getElementById("cloudy").style.display = disp;
    }
    else if(code === 1063) {//patchy rain
      var check = new Date().getHours();
      if(5 < check && check < 18) {
        iconID = "sunnyshowers";
      } else {
        iconID = "nightrain";
      }
      // document.getElementById("sunnyshowers").style.display = disp;
    }
    else if(code === 1066 || code === 1069 || code === 1072 || code === 1114 || code === 1117 ||
      code === 1204 || code === 1207 || code === 1210 || code === 1213 || code === 1216 ||
      code === 1219 || code === 1222 || code === 1225 || code === 1249 || code === 1252 ||
      code === 1255 || code === 1258 || code === 1279 || code === 1282) {//patchy snow, patchy sleet, freezing drizzle
      iconID = "snow";
      // document.getElementById("snow").style.display = disp;
    }
    else if(code === 1087 || code === 1150 || code === 1153 || code === 1168 || code === 1171 ||
      code === 1180 || code === 1183 || code === 1186 || code === 1189 || code === 1192 ||
      code === 1195 || code === 1198 || code === 1201 || code === 1240 || code === 1243 ||
      code === 1246 || code === 1273 || code === 1276) { //thundery outbreaks, patchy light drizzle, light drizzle, freezing drizzle
      iconID = "overcastshowers";
      // document.getElementById("overcastshowers").style.display = disp;
    }
    else if(code === 1135 || code === 1147) { //fog, freezing fog
      iconID = "fog";
      // document.getElementById("fog").style.display = disp;
    }
    else if(code === 1237 || code === 1261 || code === 1264) { //ice pellets
      iconID = "hail";
      // document.getElementById("hail").style.display = disp;
    }

    document.getElementById(iconID).style.display = "inline-block";

  }
