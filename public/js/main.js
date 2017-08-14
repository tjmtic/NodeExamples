$(document).ready(function() {

  $(".example").turnBox({

    // width / height of the box
    width: 700,
    height: 700,

    // 'x' or 'y'
    axis: "Y",

    // intensity of perspective
    perspective: 3000,

    // animation speed
    duration: 450,

    // delay time
    delay: 0,

    // easing effect
    easing: "ease-in-out",

    // 'positive' or 'negative'
    direction: "positive",

    // "real": Rotates the screen 90° at a time like an actual box.
    // "repeat": Will repeat the animated movement of screens 1 and 2 for screens 3 and 4.
    // "skip": Will cancel the display of a passing screen, and rotate the animation 90°relative to the designated screen.
    type: "real"

  });

});
