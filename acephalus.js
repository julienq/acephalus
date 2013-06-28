"use strict";

var strips = [
  [0, 1, 2, 3, 4, 5, [6, { n: 7, x: 320, y: 32, to: 1 }]],
  [8, 9, 10, [11, { n: 12, y: 115, to: 2 }, { n: 13, x: 342, y: 100, to: 3 }]],
  [14, 15, 16, 17, 18, 19, [20, { n: 21, x: 388, y: 292, to: 5 }]],
  [22, 23, 24, [25, { n: 26, x: 333, to: 7 }, {n: 27, to: 4 }]],
  [28, [11, { n: 12, y: 115, to: 2 }, { n: 13, x: 342, y: 100, to: 3 }]],
  [29, 30, 31, 32, [33, { n: 34, x: 446, y: 44, to: 6 }]],
  [35, 36, 37, [38, { n: 39, y: 136, to: 9 }, { n: 40, x: 300, y: 80, to: 8 }]],
  [41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50],
  [52, 53, 41, 42, 43, 44],
];

var SRC = "png/%0.png";

function show_images(target, images) {
  var show = function (promise) {
    return promise.then(function (e) {
      console.log("Show image", e, target);
      if (e) {
        target.appendChild(e);
      }
    });
  }
  var promises = images.map(function (n) {
    if (Array.isArray(n)) {
      return show_images(flexo.$("div.choice"), n);
    }
    var n_ = n.n || n;
    var p = flexo.promise_img({ src: SRC.fmt(flexo.pad(n_, 2)),
      alt: "image #%0".fmt(n_) });
    if (typeof n == "object") {
      p = p.then(function (img) {
        return flexo.$a({ href: "#%0".fmt(n.to),
          style: "left:%0px;top:%1px".fmt(n.x || 0, n.y || 0) }, img);
      });
    }
    return p;
  });
  return new flexo.Promise().fulfill().each(promises, show).then(function () {
    return target;
  });
}

// Show the strip given by the hash
function show_strip() {
  var target = document.getElementById("strip");
  var left = document.body.scrollLeft;
  document.body.scrollTop = 0;
  document.body.scrollLeft = left;
  target.innerHTML = "";
  var strip = strips[flexo.clamp(parseInt(window.location.hash.substr(1), 10),
      0, strips.length - 1)];
  if (!Array.isArray(strip)) {
    console.error("No strip to show?!");
    return;
  }
  show_images(target, strip);
}

show_strip();
window.addEventListener("hashchange", show_strip, false);
