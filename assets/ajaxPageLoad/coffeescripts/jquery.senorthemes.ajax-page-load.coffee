###
	AjaxPageLoad.js 0.9

	Created by Carlos Carrasco
	Released under http://unlicense.org/
###

# Reference jQuery
$ = jQuery

# Adds plugin object to jQuery
$.fn.extend
  ajaxPageLoad : (options) ->
    settings =
      anchorsWrapper: null
      animation: false
      animationSpeed: 500
      activeNavItem: $('nav .active a')
      prevPageItem: null
      currentPageItem: null
      nextPageItem: null
      slideDirection: 'right'
      click: null
      animationOverride: false
      printOverride: null
      complete: null
      debug: false

    # Merge default settings with options.
    settings = $.extend settings, options

    # Simple logger.
    $navItems = $(@)
    wrap = settings.target
    $wrap = $(settings.target)
    $anchorsWrapper = $(settings.anchorsWrapper)
    $wrap.wrapInner('<div class="card-wrap" />')
    $wrap.addClass('card-container')
    card = targetCard = loaderCard = '.card-wrap'
    $card = $targetCard = $loaderCard = $('.card-wrap')
    #create an array with all the anchors to work with
    navDef = []
    log = (msg) ->
      console?.log msg if settings.debug
    log @
    showPreloader = ->
      # $loaderCard.css
      #   position: 'fixed'
      #   top: 0
      #   left: 0

      $loaderCard.addClass 'loading'
      $loaderCard.html '<div class="loader">
<div class="duo duo1">
  <div class="dot dot-a"></div>
  <div class="dot dot-b"></div>
</div>
<div class="duo duo2">
  <div class="dot dot-a"></div>
  <div class="dot dot-b"></div>
</div>
</div>'
    removePreloader = ->
      $loaderCard.html ''
      $loaderCard.removeAttr 'style'
      $loaderCard.removeClass 'loading'

    loadPage = (navItem)->
      pageurl = navItem.href
      $.ajax
        url: pageurl + "?ajax=true"
        success: (data) ->
          if $.isFunction settings.printOverride
            settings.printOverride.call @,settings.currentPageItem , $targetCard
          else
            removePreloader()
            $targetCard.hide().html($(data).find('#content-wrapper').parent().html()).fadeIn(1000)
          # Let's call the callback after the page is loaded
          if $.isFunction settings.complete
            settings.complete.call @,settings.currentPageItem , $targetCard , data
            
    targetAppliesToAjaxLoad = (navItem)->
      if !settings.currentPageItem?
        settings.currentPageItem = 
          pathName: null
      # if is an anchor then no ajax-load
      if settings.currentPageItem.pathname is navItem.pathname
        return false
      else
        settings.slideDirection = (if (settings.currentPageItem.index < navItem.index) then "right" else "left")
        return true
    getNavItem = (i,el) ->
      x = window.location
      url = $(el).attr 'href'
      # if is an absolute URL
      if (/^(?:[a-z]+:)?\/\//i.test(url))
        url      = $(@).prop 'href'
        pathArray   = url.split '/'
        protocol      = pathArray[0]
        host          = pathArray[2]
        pathNameArray = url.split host
        pathNameArray = pathNameArray[1].split "#"
        pathName      = pathNameArray[0].replace(/^\//, '').replace(/\/$/, '')
        hash          = (if pathNameArray[1]? then pathNameArray[1] else null)
        navItem =
          index: i
          id: $(@).attr 'id'
          hostname: host
          protocol: protocol
          pathname: pathName
          hash: hash
          href: protocol + '//' + host + '/' + pathName 
          # href: protocol + '//' + host + '/' + pathName + '#' + hash 
      else
        parts = url.split "#"
        hash = (if parts[1]? then parts[1] else null)
        navItem =
          index: i
          id: $(@).attr 'id'
          hostname: x.hostname
          protocol: x.protocol
          pathname: parts[0]
          hash: hash
          href: x.protocol + '//' + x.hostname + '/' + parts[0]
          # href: x.protocol + '//' + x.hostname + '/' + parts[0] + '#' + hash
      navItem
    goTo = ->
      wrapperWidth = $wrap.width()
     
      if $.isFunction settings.animationOverride
        settings.animation = settings.animationOverride.call @
      
      if settings.animation 
        $wrap.append('<div class="card-wrap loading"></div>')
        $card = $wrap.find '.card-wrap:first'
        $targetCard = $loaderCard = $wrap.find '.card-wrap:last'
        showPreloader()
        $card.addClass((if settings.slideDirection is "right" then 'slide-right' else 'slide-left' ) )
        # CSS3 animation takes 400ms to finish
        setTimeout (->
          $card.remove()
          loadPage(settings.nextPageItem)
        ), 400
        # ,
        # # when animation is complete...
        # () ->
        #   $wrap.addClass('noTransition')
        #   # .find('.card-wrap:first').remove()
        #   $(wrap+','+targetCard).removeAttr 'style'
        #   $wrap.removeClass('noTransition')
      else
        showPreloader()
        loadPage(settings.nextPageItem)

    return @each (i,el) ->
      if $(el).parent().hasClass 'active'
        settings.currentPageItem = getNavItem(i,el) 
      # settings.currentPageItem = navItem()
      $(el).on "click", (ev) ->
        # Let's call the callback after the page is loaded
        if $.isFunction settings.click
          settings.click.call el,settings.currentPageItem

        settings.nextPageItem = getNavItem(i,el)
        if targetAppliesToAjaxLoad(settings.nextPageItem)
          ev.preventDefault()
          ev.stopPropagation()
          goTo()
        settings.prevPageItem = settings.currentPageItem
        settings.currentPageItem = settings.nextPageItem
        # to change the browser URL to the given link location
        if settings.currentPageItem.href isnt window.location
          window.history.pushState
            path: settings.currentPageItem.href
          , "", settings.currentPageItem.href