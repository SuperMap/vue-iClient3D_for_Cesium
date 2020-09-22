(function () {
  var isWinRT = (typeof Windows === "undefined") ? false : true;
  var r = new RegExp("(^|(.*?\\/))(.include\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'),
    src, m, baseurl = "";
  for (let i = 0, len = s.length; i < len; i++) {
    src = s[i].getAttribute('src');
    if (src) {
      var m = src.match(r);
      if (m) {
        baseurl = m[1];
        break;
      }
    }
  }

  function inputScript(inc, isAsync) {
    if (!isWinRT) {
      let script;
      if (isAsync) {
        script = '<' + 'script async type="text/javascript" src="' + inc + '"' + '><' + '/script>';
      } else {
        script = '<' + 'script type="text/javascript" src="' + inc + '"' + '><' + '/script>';
      }
      document.writeln(script);
    } else {
      let script = document.createElement("script");
      script.src = inc;
      if (isAsync) {
        script.async = true;
      };
      document.getElementsByTagName("HEAD")[0].appendChild(script);
    }
  }


  function inputCSS(style) {
    if (!isWinRT) {
      let css = '<' + 'link rel="stylesheet" href="' + style + '"' + '><' + '/>';
      document.writeln(css);
    } else {
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      document.getElementsByTagName("HEAD")[0].appendChild(link);
    }
  }

  function loadCss() {
    inputCSS("static/css/geoFont/iconfont.css");
    inputCSS("static/css/index.css");
    inputCSS("static/cesium/Widgets/widgets.css");
  };
  //加载类库资源文件
  function loadSMLibs() {
        inputScript("static/cesium/Cesium.js");
        inputScript("static/js/config.js");
        inputScript("static/js/tooltip.js");
        inputScript("https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js");
        inputScript("https://unpkg.com/axios/dist/axios.min.js",true);
        inputScript("https://cdn.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js",true);
  };
  //引入汉化资源文件
  //   function loadLocalization() {
  //       inputScript(baseurl + 'Lang/zh-CN.js');
  //   }
  // loadCss();
  loadSMLibs();
})();
