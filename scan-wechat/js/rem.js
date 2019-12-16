(function() {
  var baseFontSize = 100;
  var baseWidth = 375;
  var clientWidth = document.documentElement.clientWidth || window.innerWidth;
  var innerWidth = Math.max(Math.min(clientWidth, 480), 360);

  var rem = 100;
  if (innerWidth >= 414) {
    rem = Math.floor(innerWidth / baseWidth * baseFontSize * 0.98);
  } else {
    rem = Math.floor(innerWidth / baseWidth * baseFontSize);
  }

  document.querySelector('html').style.fontSize = rem + 'px';
}());