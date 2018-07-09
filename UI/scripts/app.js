(function () {
  var nav = document.getElementById('nav'),
    listItems = nav.getElementsByTagName('li'),
    windowLocationLen = window.location.href.split('/').length;
  current = window.location.href.split('/')[windowLocationLen - 1];

  for (var listItem of listItems) {
    var anchorTagHref = listItem.children[0].href.split('/')[windowLocationLen - 1] || '';

    if (anchorTagHref.indexOf(current) !== -1) {
      listItem.children[0].className += " link-active";
    }
  }
})();
