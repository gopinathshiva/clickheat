/**
 * Application entry point
 */


// ================================
// START YOUR APP HERE
// ================================

import h337 from 'heatmap.js';
import * as firebase from "firebase/app";

import "firebase/database";

import { initClickHeat } from '../clickheat';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

initClickHeat({
  clickHeatGroup: '/something',
  clickHeatServer: '/something',
  clickHeatDebug: true
});

var start = new Date();
start.setHours(0,0,0,0);

var end = new Date();
end.setHours(23,59,59,999);

const startTime = start.getTime();
const endTime = end.getTime();

var heatmap = h337.create({
    container: document.getElementById('heatmap-container'),
    radius: 10,
    maxOpacity: .5,
    minOpacity: 0,
    blur: .75,
    // gradient: { .1: 'rgba(0,0,0,0)', 0.25: "rgba(0,0,90, .6)", .6: "blue", .9: "cyan", .95: 'rgba(255,255,255,.4)'},
    // backgroundColor: 'rgba(0, 0, 58, 0.96)'
  });

  // function generateRandomData(len) {
  //   var max = 100;
  //   var min = 1;
  //   var maxX = document.body.clientWidth;
  //   var maxY = document.body.clientHeight;
  //   var data = [];
  //   while (len--) {
  //     data.push({
  //       x: ((Math.random() * maxX) >> 0),
  //       y: ((Math.random() * maxY) >> 0),
  //       radius: ((Math.random() * 50 + min) >> 0)
  //     });
  //   }
  //   return {
  //     max: max,
  //     min: min,
  //     data: data
  //   }
  // };
  //
  // var { data } = generateRandomData(10);
  // console.log(data);
  //
  // heatmap.setData({
  //   max: 5,
  //   data: data
  // });

// firebase.database().ref('dates/').orderByKey().startAt(String(startTime)).endAt(String(endTime))
//   .once("value", function(snapshot){
//     var d = snapshot.val();
//     console.log(snapshot.val());
//   });

function getClickHeatData(screen = 1440, startDate = new Date(), endDate = new Date()){
  var start = new Date(startDate);
  start.setHours(0,0,0,0);

  var end = new Date(endDate);
  end.setHours(23,59,59,999);

  const startTime = start.getTime();
  const endTime = end.getTime();

  console.log(startTime);
  console.log(endTime);

  firebase.database().ref(`screens/${screen}/`).orderByChild("time").startAt(String(startTime)).endAt(String(startTime))
    .once("value", function(snapshot){
      var data = snapshot.val();
      const datas = [];
      for(var i in data){
        datas.push({
          x: data[i].x,
          y: data[i].y,
          radius: 10,
        })
      }
      console.log(datas);
      heatmap.setData({
        max: 5,
        data: datas
      });
      console.log(snapshot.val());
    });
}

getClickHeatData();

let startDate, endDate, screen;

// document.getElementById('startDate').onchange = function (e) {
//     console.log(this.value);
//     startDate = this.value;
// };
//
// document.getElementById('endDate').onchange = function (e) {
//     console.log(this.value);
//     endDate = this.value;
// };

document.getElementById('submit').onclick = function(e){
  const screen = document.getElementById('screen-size').value;
  getClickHeatData(screen);
}
