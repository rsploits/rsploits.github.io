

try {


var UPDATE_DATA_URL = "https://rear-olwen-rsploits-4f8dc15e.koyeb.app/roblox-version";


function updateLatestUpdateDate(data) {
    var parsed = JSON.parse(data);
    var windows = parsed["windows_version"];
    var android = parsed["android_version"];
    var macos = parsed["mac_version"];
    var ios = parsed["ios_version"];
    var windows_date = parsed["windows_date"] + " UTC";
    var android_date = parsed["android_date"] + " UTC";
    var macos_date = parsed["mac_date"] + " UTC";
    var ios_date = parsed["ios_date"] + " UTC";
    windows_date = new Date(Date.parse(windows_date)).toLocaleString();
    android_date = new Date(Date.parse(android_date)).toLocaleString();
    macos_date = new Date(Date.parse(macos_date)).toLocaleString();
    ios_date = new Date(Date.parse(ios_date)).toLocaleString();
    el("latestWinVer").innerHTML = windows;
    el("latestAndVer").innerHTML = android;
    el("latestMacVer").innerHTML = macos;
    el("latestIosVer").innerHTML = ios;
    el("latestWinVerDate").innerHTML = windows_date;
    el("latestAndVerDate").innerHTML = android_date;
    el("latestMacVerDate").innerHTML = macos_date;
    el("latestIosVerDate").innerHTML = ios_date;
}

    
updateLatestUpdateDate(await (await fetch(UPDATE_DATA_URL)).text());


} catch (e) {
    document.getElementById("text").innerHTML += e.stack;
}

