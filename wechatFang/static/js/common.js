function getRootPathWeb() {
  //获取当前网址，如： http://localhost:8080/test/share/meun.jsp
  var curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： test/share/meun.jsp
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8080
  var localhostPath = curWwwPath.substring(0, pos);
  //获取带"/"的项目名，如：/test
  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
  return (localhostPath + projectName);
}

function getRootPathWebWithoutProjectName() {
  //获取当前网址，如： http://localhost:8080/test/share/meun.jsp
  var curWwwPath = window.document.location.href;
  //获取主机地址之后的目录，如： test/share/meun.jsp
  var pathName = window.document.location.pathname;
  var pos = curWwwPath.indexOf(pathName);
  //获取主机地址，如： http://localhost:8080
  var localhostPath = curWwwPath.substring(0, pos);

  return (localhostPath);
}

var currentHost = getHost();

function getHost() {
  var host = window.document.location.hostname;
  return host;
}

var basePath = getRootPathWeb();
if (basePath.indexOf("csclient") == -1) {
  basePath = getRootPathWebWithoutProjectName();
}
