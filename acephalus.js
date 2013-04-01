"use strict";

var desc = [
  [0, 1, 2, 3, 4, [5, [6, 1]]],          // strip 1 -> strip 2
  [7, 8, 9, [10, [11, 2], [12, 3]]],     // strip 2 -> strip 3 | 4
  [13, 14, 15, 16, 17, [18, [19, 5]]],   // strip 3 -> strip 6
  [20, 21, 22, [23, [24, 4], [25, 7]]],  // strip 4 -> strip 5 | strip 8
  [[10, [11, 2], [12, 3]]],              // strip 5 -> strip 3 | strip 4
  [26, 27, 28, 28, [29, [30, 6]]],       // strip 6 -> strip 7
  [31, 32, 33, [34, [35, 7], [36, 8]]],  // strip 7 -> strip 8 | strip 9
  [37, 38, 39],                          // strip 8
  [40, 41, 42, 43, 44, [45, [46, 9]]],   // strip 9 -> strip 10
  [47]                                   // strip 10 (TBC)
];

var Strip = {};

Strip.show = function (target) {
  flexo.remove_children(target);
  this.panels.forEach(function (panel) {
    panel.show(target);
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
  return target.appendChild(flexo.$("div.panel", this.image.toString()));
};

var PanelChoice = Object.create(Panel);

PanelChoice.show = function (target) {
  var p = Panel.show.call(this, target);
  this.choices.forEach(function (ch) {
    var span = p.appendChild(flexo.$span(ch[0].toString()));
    span.addEventListener("click", function (e) {
      strips[ch[1]].show(target);
    }, false);
  });
  return p;
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

strips[0].show(document.getElementById("strip"));
