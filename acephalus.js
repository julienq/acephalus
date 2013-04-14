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

// Load a list of images and return the list of (possibly unloaded) elements,
// then call f() when all images have been loaded.
function show_images(target, images, f) {
  var next_i = 0;
  var queue = [];
  var loaded = function (img, i) {
    queue[i] = img;
    while (i === next_i) {
      queue[i].classList.remove("hidden");
      ++next_i;
      if (queue[i + 1] != null) {
        ++i;
      } else if (next_i === images.length) {
        f();
      }
    }
  };
  images.forEach(function (n, i) {
    if (typeof n === "number") {
      // A single image
      var img = target.appendChild(flexo.$img({ alt: "image #%0".fmt(n),
        class: "hidden", src: SRC.fmt(flexo.pad(n, 2)) }));
      if (img.complete) {
        loaded(img, i);
      } else {
        img.addEventListener("load", function () {
          loaded(img, i);
        }, false);
      }
    } else if (Array.isArray(n)) {
      // An image with one or more links; first a background, then link images
      // with position
      var div = target.appendChild(flexo.$div({ class: "choice hidden" }));
      show_images(div, n, function () {
        loaded(div, i);
      });
    } else {
      // A link image
      var img = flexo.$img({ alt: "image #%0".fmt(n), class: "hidden",
        src: SRC.fmt(flexo.pad(n.n, 2)) });
      target.appendChild(flexo.$a({ href: "#%0".fmt(n.to),
        style: "left:%0px;top:%1px".fmt(n.x || 0, n.y || 0) }, img));
      if (img.complete) {
        loaded(img, i);
      } else {
        img.addEventListener("load", function () {
          loaded(img, i);
        }, false);
      }
    }
  });
}

// Show the strip given by the hash
function show_strip() {
  var target = document.getElementById("strip");
  document.body.scrollTop = 0;
  flexo.remove_children(target);
  var strip = strips[flexo.clamp(parseInt(window.location.hash.substr(1), 10),
      0, strips.length - 1)];
  if (!Array.isArray(strip)) {
    console.error("No strip to show?!");
    return;
  }
  show_images(target, strip, flexo.nop);
}

show_strip();
window.addEventListener("hashchange", show_strip, false);
