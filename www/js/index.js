/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready

	
// var weatherData="";
// function processTime(startstr){
//     var idx1=startstr.indexOf('-');
//     var idx2=startstr.indexOf(' ');

//     if( startstr.substr(idx2+1, 2)=="06") {
//         return startstr.substring(idx1+1, idx2)+ " 白天"+ '    <i class="fas fa-sun"><//i>';  
//     }else if (startstr.substr(idx2+1, 2)=="18"){
//         return startstr.substring(idx1+1, idx2)+ " 晚上"+ '    <i class="fas fa-moon"><//i>';  
//     }else {   
//         return "現在";
//     }
// }

// function updateWeather(){
//     var minTArray=weatherData[8].time;
//     var maxTArray=weatherData[12].time;
//     for(var i=0;i<minTArray.length;i++){
//         var startTime=weatherData[8].time[i].startTime;
//         var endTime=weatherData[8].time[i].endTime;
//         var li=$("<li>");
//         li.append($("<h1 class='Kanit'>").html(processTime(startTime)));

//         var minT=minTArray[i].elementValue[0].value;
//         var maxT=maxTArray[i].elementValue[0].value
//         $("<span>").addClass("ui-li-count").text(minT+" ~ "+maxT).appendTo(li);

//         $("#weatherList").append(li);
//     }
//     $("#weatherList").listview("refresh");
// }

function checkConnection() {
      var networkState = navigator.connection.type;
      if (networkState === Connection.NONE) {
          alert("沒有網路連線...");
          navigator.app.exitApp(); // 離開應用程式
      }
}

document.addEventListener('deviceready', onDeviceReady, false);

var ubikeData = []
var currentData = []

$('#select-area').on('change', () => {
    updateCurrentData();
})

$('#pre-rendered-example-input').on('input', () => {
    const input=$('#pre-rendered-example-input').val();
    if(input != '') showKeyWord();
})
$('#pre-rendered-example-input').on('change', () => {
    updateCurrentData();
})

function AreaFilter(data) {
    const selected = $('#select-area').find(":selected").val();

    switch (selected) {
        case '1':
            return data.filter((station) => station.sarea === '北投區');
        case '2':
            return data.filter((station) => station.sarea === '士林區');
        case '3':
            return data.filter((station) => station.sarea === '大同區');
        case '4':
            return data.filter((station) => station.sarea === '中山區');
        case '5':
            return data.filter((station) => station.sarea === '內湖區');
        case '6':
            return data.filter((station) => station.sarea === '松山區');
        case '7':
            return data.filter((station) => station.sarea === '萬華區');
        case '8':
            return data.filter((station) => station.sarea === '中正區');
        case '9':
            return data.filter((station) => station.sarea === '大安區');
        case '10':
            return data.filter((station) => station.sarea === '信義區');
        case '11':
            return data.filter((station) => station.sarea === '南港區');
        case '12':
            return data.filter((station) => station.sarea === '文山區');   
        default:
            return data;
    }
}
function KeyWordFilter(data) {
    const keyword = $('#pre-rendered-example-input').val();
    return data.filter((station) => station.sna.substr(11).indexOf(keyword)+1 );
}
function updateCurrentData() {
    currentData = AreaFilter(KeyWordFilter(ubikeData));
    showCurrentData();
}

function showKeyWord() {
    $('#keyword-list').find('a').slice(1).remove();
    const keywordList = AreaFilter(KeyWordFilter(ubikeData));

    for (var i=0; i < keywordList.length; i++) {
        const stationName = keywordList[i].sna.substr(11);
        var a = $('<a class="ui-btn ui-corner-all ui-shadow ui-first-child ui-shadow ui-last-child" />').text(stationName).on('click', ()=>{
            $('#keyword-list').find('a').slice(1).remove();
            $('#pre-rendered-example-input').val(stationName);
            currentData = keywordList.filter((station) => station.sna.substr(11) === stationName);
            showCurrentData();
        });
        $('#keyword-list').append(a);
    }
}
function showCurrentData() {
    $('#ubikeData>').remove();
    $('#ubikeData')
    .append($("<div class='station-number'>")
    .text('共'+currentData.length+'站點'));

    for(var i=0; i < currentData.length; i++) {
        const sna=currentData[i].sna.substr(11);
        const sarea=currentData[i].sarea;
        const tot=currentData[i].tot;
        const sbi=currentData[i].sbi;
        const bemp=currentData[i].bemp;
        const act=currentData[i].act;
        
        var li = $("<li class='Kanit'>");
		var h3 = $("<h3>").text(sna);
        
        const mapIcon = $('<i class="fa-solid fa-location-dot pl-4"></i>');
		mapIcon.on('click', ()=>{
			window.open("https://www.google.com/maps/search/?api=1&query="+sna, "_blank");
		});
		li.append(h3.append(mapIcon));
		$("<span>").addClass("ui-li-count").text(sarea).appendTo(li);
        $("<div>").text('車輛數量: '+sbi+'/'+tot).appendTo(li);
        $("<div>").text('空位數量: '+bemp+'/'+tot).appendTo(li);

        $("#ubikeData").append(li);
        
    }
    const updateTime=ubikeData[0].updateTime;
    $('#ubikeData').append($("<div class='update-time' />").text('資料更新時間: '+updateTime));
    $('#ubikeData').append($('<a href="#top" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-u ui-btn-icon-top">Top</a>').on('click', ()=>$.mobile.silentScroll(0)));
    $('#ubikeData').listview("refresh");
}

function onDeviceReady() {
    checkConnection();   
    var url="https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
    /*
    tot: 場站總停車格
    sbi: 場站目前車輛數量
    bemp: 空位數量
    act: 全站禁用狀態(0:禁用、1:啟用)
    srcUpdateTime:微笑單車系統發布資料更新的時間
    mday:微笑單車各場站來源資料更新時間
    updateTime:北市府交通局數據平台經過處理後將資料存入DB的時間
    infoTime:微笑單車各場站來源資料更新日期與時間
    infoDate:微笑單車各場站來源資料更新日期
    */
    $.getJSON(url, function(response){

        ubikeData = response;
        currentData = ubikeData;
    })
}
