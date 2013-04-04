"use strict";

var desc = [
  [0, 1, 2, 3, 4, 5, [6, [7, 320, 32, 1]]],
  [8, 9, 10, [11, [12, 0, 115, 2], [13, 342, 100, 3]]],
  [14, 15, 16, 17, 18, 19, [20, [21, 388, 292, 5]]],
  [22, 23, 24, [25, [26, 333, 0, 7], [27, 0, 0, 4]]],
  [28, [11, [12, 0, 115, 2], [13, 342, 100, 3]]],
  [29, 30, 31, 32, [33, [34, 446, 44, 6]]],
  [35, 36, 37, [38, [39, 0, 136, 9], [40, 300, 80, 8]]],
  [41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50],
  [52, 53, 41, 42, 43, 44],
];

var Strip = {};

Strip.show = function (target) {
  flexo.remove_children(target);
  this.panels.forEach(function (panel) {
    var elem = panel.show(target);
  });
  document.body.scrollTop = 0;
};

function init_strip(panels) {
  var strip = Object.create(Strip);
  strip.panels = panels;
  return strip;
}

var Panel = {};

Panel.show = function (target) {
  return target.appendChild(flexo.$img({
    alt: "panel",
    src: "png/%0.png".fmt(flexo.pad(this.image.toString(), 2))
  }));
};

var PanelChoice = Object.create(Panel);

PanelChoice.show = function (target) {
  var p = Panel.show.call(this, target);
  var div = target.appendChild(flexo.$("div.choice", p));
  this.choices.forEach(function (ch) {
    var a = div.appendChild(flexo.$a({ href: "#%0".fmt(ch[3]) },
        flexo.$img({
          alt: "choice",
          src: "png/%0.png".fmt(flexo.pad(ch[0].toString(), 2))
        })));
    a.style.left = "%0px".fmt(ch[1]);
    a.style.top = "%0px".fmt(ch[2]);
  });
  return div;
}

function init_panel(n) {
  var panel;
  if (typeof n === "number") {
    panel = Object.create(Panel);
    panel.image = n;
  } else {
    panel = Object.create(PanelChoice);
    panel.image = n.shift();
    panel.choices = n;
  }
  return panel;
}

var strips = desc.map(function (s) {
  return init_strip(s.map(init_panel));
});

// Show the strip given by the hash
function show_strip() {
  strips[flexo.clamp(parseInt(window.location.hash.substr(1), 10), 0,
      strips.length - 1)].show(document.getElementById("strip"));
}

show_strip();
window.addEventListener("hashchange", show_strip, false);
