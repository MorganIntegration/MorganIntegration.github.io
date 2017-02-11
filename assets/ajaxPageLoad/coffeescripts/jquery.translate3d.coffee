(($) ->
  delay = 0
  $.fn.translate3d = (translations, speed, easing, complete) ->
    opt = $.speed(speed, easing, complete)
    opt.easing = opt.easing or "ease"
    translations = $.extend(
      x: 0
      y: 0
      z: 0
    , translations)
    @each ->
      $this = $(this)
      $this.css
        transitionDuration: opt.duration + "ms"
        transitionTimingFunction: opt.easing
        transform: "translate3d(" + translations.x + "px, " + translations.y + "px, " + translations.z + "px)"

      setTimeout (->
        $this.css
          transitionDuration: "0s"
          transitionTimingFunction: "ease"

        opt.complete()
      ), opt.duration + (delay or 0)

) jQuery