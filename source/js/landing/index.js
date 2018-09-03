$(document).ready(function () {
    $("#userInfo").on("click", function () {
        $(this).closest("li").toggleClass("active");
    });

    $("#menu_icon").on("click", function () {
        $(this).closest(".block-1_menu").toggleClass("active");
        return false;
    });

    var $button1 = $(".button-1"),
      $container1 = $(".container-1"),
      $button2 = $(".button-2"),
      $container2 = $(".container-2"),
      $button3 = $(".button-3"),
      $container3 = $(".container-3");

    $button1.on("click", function () {
        $container1.addClass("active");
        $container2.removeClass("active");
        $container3.removeClass("active");

        $button1.addClass("active");
        $button2.removeClass("active");
        $button3.removeClass("active");
    });

    $button2.on("click", function () {
        $container1.removeClass("active");
        $container2.addClass("active");
        $container3.removeClass("active");

        $button1.removeClass("active");
        $button2.addClass("active");
        $button3.removeClass("active");
    });
    $button3.on("click", function () {
        $container1.removeClass("active");
        $container2.removeClass("active");
        $container3.addClass("active");

        $button1.removeClass("active");
        $button2.removeClass("active");
        $button3.addClass("active");
    });

    var $button11 = $(".button-1-mobile"),
      $container11 = $(".container-1-mobile"),
      $button22 = $(".button-2-mobile"),
      $container22 = $(".container-2-mobile"),
      $button33 = $(".button-3-mobile"),
      $container33 = $(".container-3-mobile");

    $button11.on("click", function () {
        $container11.addClass("active");
        $container22.removeClass("active");
        $container33.removeClass("active");

        $button11.addClass("active");
        $button22.removeClass("active");
        $button33.removeClass("active");
    });
    $button22.on("click", function () {
        $container11.removeClass("active");
        $container22.addClass("active");
        $container33.removeClass("active");

        $button11.removeClass("active");
        $button22.addClass("active");
        $button33.removeClass("active");
    });
    $button33.on("click", function () {
        $container11.removeClass("active");
        $container22.removeClass("active");
        $container33.addClass("active");

        $button11.removeClass("active");
        $button22.removeClass("active");
        $button33.addClass("active");
    });
});