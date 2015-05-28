var url = "https://dynupdate.no-ip.com/nic/update";
var userAgent = "";

var params = "hostname="+ipConfig.domain;

var headers = [];
headers["User-Agent"] = "MDMA Update Agent AWS/1.0 "+ipConfig.adminMail;
headers["Authentification"] = "Basic " + ipConfig.base64Auth;
