(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.init()",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "desktopMipmappingEnabled": false,
 "minHeight": 20,
 "scripts": {
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "registerKey": function(key, value){  window[key] = value; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "unregisterKey": function(key){  delete window[key]; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "existsKey": function(key){  return key in window; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "defaultVRPointer": "laser",
 "horizontalAlign": "left",
 "downloadEnabled": false,
 "class": "Player",
 "gap": 10,
 "height": "100%",
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "data": {
  "name": "Player460"
 },
 "overflow": "visible",
 "definitions": [{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -169.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49918B00_457D_8623_41D0_EF5C4E633754"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -164.19,
   "backwardYaw": -0.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A",
   "distance": 1
  },
  {
   "yaw": 3.37,
   "backwardYaw": -150.46,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30805221_12F3_C958_4188_D68D920D14FB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25",
 "thumbnailUrl": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_t.jpg",
 "label": "RUTE_2_020",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_28CD8241_12B0_C9D9_41A4_21BC40CAE3F0",
  "this.overlay_28BCE7B1_12B0_D6B9_4196_44D7C11E5165"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.54,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A144DC3_457D_8225_41C2_1B7EC07E5CD6"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 7.32,
   "backwardYaw": -171.39,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77",
   "distance": 1
  },
  {
   "yaw": -174.17,
   "backwardYaw": 4.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A528E6_1291_DADB_4199_30F832A831C3",
 "thumbnailUrl": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_t.jpg",
 "label": "RUTE_1_017",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_04EE3CAE_12B0_5AAB_41AF_F7B8C502029B",
  "this.overlay_05849C6F_12B0_59A9_418D_E9947EF4208B"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AA8DE1E_457D_9E5F_41B9_54156921C7AC"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_007",
 "id": "panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0",
 "thumbnailUrl": "media/panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A69C14_1290_597F_417E_32A8C40623F2_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 9.35,
   "backwardYaw": -172.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_41F98000_1390_4957_41AA_06D842C87E40",
 "thumbnailUrl": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_t.jpg",
 "label": "RUTE_3_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_423511E5_1390_4AD8_41B2_497030889C21"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 8.97,
   "backwardYaw": -167.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1",
   "distance": 1
  },
  {
   "yaw": -178.19,
   "backwardYaw": -53.24,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_57EF7A03_1371_F958_419B_B6E409AA52BA",
 "thumbnailUrl": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_t.jpg",
 "label": "GEDUNG_B_1_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_50C5A73E_1370_57A8_4196_CEE4816B9CAC",
  "this.overlay_5A2A9BAB_1390_DEA8_41AF_7740631D5FBC"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 8.61,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_486A2ED9_457D_9E25_41CB_0326537B5F96"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 6.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49A6785D_457D_82DD_4186_EEC983371EA7"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_008",
 "id": "panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE",
 "thumbnailUrl": "media/panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -142.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_481FBB9C_457D_8623_41C1_C66C907DFA0A"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_006",
 "id": "panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F",
 "thumbnailUrl": "media/panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 17.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48471F26_457D_9E6F_41C9_E1E02F159D3D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B40CA1B_457D_8625_4175_5D0E6B55A0B6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -175.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_486FBB42_457D_8627_41B6_495266DE9D0C"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6FC04_1290_795F_4196_870A883C05BA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -168,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B1EFC81_457D_8225_41C0_5A21936A29AC"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_005",
 "id": "panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68",
 "thumbnailUrl": "media/panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B26AA3D_457D_865D_41C4_A648517D8E3B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 8.81,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_484FCF19_457D_9E25_41CA_4A836A5F891F"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -162.8,
   "backwardYaw": 1.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16",
   "distance": 1
  },
  {
   "yaw": -10.76,
   "backwardYaw": -94.54,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3082E344_12F0_4FD8_4199_C97F4995F22F",
 "thumbnailUrl": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_t.jpg",
 "label": "RUTE_2_008",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_3E8B6F52_1290_37FB_4181_4C02AE46217D",
  "this.overlay_3E10769B_1290_4968_4196_D55A98961B75"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6BC0B_1290_3969_419C_D64912901FE4_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.27,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48342F40_457D_9E23_41C5_45C2B2344900"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 171.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48F02921_457D_8265_41B6_2C261E56BE0A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 18.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AD9CDF6_457D_9DEF_4198_B86D8C362C9D"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_004",
 "id": "panorama_58368404_1390_C95F_418B_0A875A0C068C",
 "thumbnailUrl": "media/panorama_58368404_1390_C95F_418B_0A875A0C068C_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 4.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48B3C962_457D_82E7_41CA_50061FB01890"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -173.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_483C9F32_457D_9E67_4181_CC58FB7217E0"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_016",
 "id": "panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250",
 "thumbnailUrl": "media/panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": -0.01,
   "backwardYaw": -164.19,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25",
   "distance": 1
  },
  {
   "yaw": -154.44,
   "backwardYaw": -3.21,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A",
 "thumbnailUrl": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_t.jpg",
 "label": "RUTE_2_019",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2A1EBB14_12B0_3F78_416A_044C5131D79E",
  "this.overlay_282B6ECA_12BF_D6E8_419A_AA97DA562DF3"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 12.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48A75C0E_457D_823F_41C6_0A437207AC8D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -179.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48F00BC2_457D_8627_41B2_B7C29BA49983"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -173.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_481ED8FA_457D_83E7_41B9_D2768A0BDC0C"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.67,
  "class": "PanoramaCameraPosition",
  "pitch": -2.2
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -15.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A044DD0_457D_8223_41CE_5A2B66AEF943"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -164.79,
   "backwardYaw": 12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684",
   "distance": 1
  },
  {
   "yaw": 5.36,
   "backwardYaw": -157.43,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30809506_12F0_4B5B_41A2_E99AB3C67730",
 "thumbnailUrl": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_t.jpg",
 "label": "RUTE_2_012",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_26017374_12B3_CFBF_4196_87988ECF4C15",
  "this.overlay_2315DE9C_12B0_796F_41AF_5F726CAAC2C5"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -14.98,
   "backwardYaw": 175.88,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581",
   "distance": 1
  },
  {
   "yaw": -177.57,
   "backwardYaw": 10.9,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA",
 "thumbnailUrl": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_t.jpg",
 "label": "RUTE_6_004",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_31C7067E_12F1_C9A8_4194_D4FF57BDE90A",
  "this.overlay_308ED263_12F0_49D8_41AE_4E84DE7FC821"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30839447_12F0_49D8_41AC_8C0721666D72_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 5.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B6B5C42_457D_8227_41BF_59675B797D9B"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 115.75,
   "backwardYaw": 7.64,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "distance": 1
  },
  {
   "yaw": -104.91,
   "backwardYaw": 7.64,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3080F360_12F0_4FD8_41A4_6668EA80A156",
 "thumbnailUrl": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_t.jpg",
 "label": "RUTE_2_023",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_51E5D92C_1290_5BA8_416C_4A4E6B4C0704",
  "this.overlay_53D58C44_1290_39DF_41AF_A15EED7D2CB0"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_1_027",
 "id": "panorama_18A6FC04_1290_795F_4196_870A883C05BA",
 "thumbnailUrl": "media/panorama_18A6FC04_1290_795F_4196_870A883C05BA_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -170.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A98BE2B_457D_9E65_4163_66DDDF829A78"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5829EA40_1370_59D7_4175_B87115763828_camera"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_003",
 "id": "panorama_500DAF90_1371_D777_41AA_382F379E58CE",
 "thumbnailUrl": "media/panorama_500DAF90_1371_D777_41AA_382F379E58CE_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": -173.18,
   "backwardYaw": 5.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E",
   "distance": 1
  },
  {
   "yaw": 3.94,
   "backwardYaw": -173.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A6BC0B_1290_3969_419C_D64912901FE4",
 "thumbnailUrl": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_t.jpg",
 "label": "RUTE_1_023",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_08B268AF_1290_7AA9_4199_33E5741117DD",
  "this.overlay_08964C4A_1290_79EB_418E_D03D153D4FB9"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -173.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_482CCF4D_457D_9E3D_41D1_22363D5BDFC1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 15.21,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_482A1B8F_457D_863D_41BD_57686BF770AC"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -151.26,
   "backwardYaw": 10.13,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9",
   "distance": 1
  },
  {
   "yaw": 9.74,
   "backwardYaw": -161.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8",
 "thumbnailUrl": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_t.jpg",
 "label": "RUTE_2_016",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2778CC2A_12B0_39AB_41B1_F991300FD6E6",
  "this.overlay_2713B04A_12B0_C9EB_41B0_885B447F570F"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -159.22,
   "backwardYaw": 6.35,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30805221_12F3_C958_4188_D68D920D14FB",
   "distance": 1
  },
  {
   "yaw": 15.71,
   "backwardYaw": -22.91,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93",
 "thumbnailUrl": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_t.jpg",
 "label": "RUTE_2_022",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2ECE24E7_12B3_CAD9_41A0_EC428AD7193F",
  "this.overlay_2E93ED55_12B3_DBF9_4198_DD0E67603754"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 157.09,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4827BF5B_457D_9E25_41CA_C2D4C468E0F7"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.68,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49B38851_457D_8225_4190_8BBE766681FD"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30859936_12F0_FBBB_41AC_798CC35649DF_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_583EF486_1390_495B_4158_C9E4C66D8930_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 22.68,
   "backwardYaw": 1.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1",
   "distance": 1
  },
  {
   "yaw": -8.56,
   "backwardYaw": 12.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5829EA40_1370_59D7_4175_B87115763828",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_573635F4_1370_4AB8_41B0_17651EB1AE06",
 "thumbnailUrl": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_t.jpg",
 "label": "GEDUNG_B_2_003",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_55D6526B_1370_49A8_41A0_49AFB3E140CD",
  "this.overlay_558DCBE8_1370_5ED7_41A0_134650860473"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_011",
 "id": "panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30",
 "thumbnailUrl": "media/panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": -161.01,
   "backwardYaw": 9.74,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8",
   "distance": 1
  },
  {
   "yaw": 3.17,
   "backwardYaw": -161.01,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3083B060_12F3_C9D8_41AB_06E931EB715C",
 "thumbnailUrl": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_t.jpg",
 "label": "RUTE_2_017",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2411103D_12B0_C9A8_41B2_3423A8FE1AF4",
  "this.overlay_25AE7E21_12B0_D958_41B2_68B845F18FCC"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 85.46,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48BDF955_457D_822C_41B5_0EC9E718DD79"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BED1CA8_457D_8263_41D0_2D8CAF373682"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -7.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BC33CE3_457D_83E5_41C9_60ED59E112F1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -168.3,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_555F3E5E_457D_9EDF_41B2_5771043398D3"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48DB093B_457D_8264_41B4_2A5AC97423CD"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30805221_12F3_C958_4188_D68D920D14FB_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -150.46,
   "backwardYaw": 3.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25",
   "distance": 1
  },
  {
   "yaw": 6.35,
   "backwardYaw": -159.22,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30805221_12F3_C958_4188_D68D920D14FB",
 "thumbnailUrl": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_t.jpg",
 "label": "RUTE_2_021",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2C6A93FE_12B1_CEAB_4199_4D3164E23AA8",
  "this.overlay_2DEC66A3_12B0_4958_41A5_8E599EA04084"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 4.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48A3197B_457D_82E5_41AC_0719453F169F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 3.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48BC7BF6_457D_85EF_41CB_216DB3916918"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 5.96,
   "backwardYaw": -153.25,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9",
   "distance": 1
  },
  {
   "yaw": -158.42,
   "backwardYaw": 4.36,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308396BE_12F0_36A8_4169_9F508D2A9A34",
 "thumbnailUrl": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_t.jpg",
 "label": "RUTE_2_014",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_21B3CE15_12B0_3979_41B0_95F2D6055117",
  "this.overlay_2120F236_12B7_C9B8_41AE_44C3A9494C6E"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -169.6,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BD45A7D_457D_86DD_41A2_A3C38A729735"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 97.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48B22C02_457D_8227_41CA_57569FB10845"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_camera"
},
{
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_020",
 "id": "panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6",
 "thumbnailUrl": "media/panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": 3.35,
   "backwardYaw": 179.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6",
 "thumbnailUrl": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_t.jpg",
 "label": "RUTE_1_006",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_1D405EC1_1293_D6D9_41A5_E6F01D1BD16D"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 8.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48554B5C_457D_8623_41B7_4637479DB326"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 26.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48755B34_457D_8663_41CE_4C0A055AA4DC"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -179.76,
   "backwardYaw": 77.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7",
   "distance": 1
  },
  {
   "yaw": 10.4,
   "backwardYaw": -172.69,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405",
   "distance": 1
  },
  {
   "yaw": -53.24,
   "backwardYaw": -178.19,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE",
 "thumbnailUrl": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_t.jpg",
 "label": "RUTE_2_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_31ED26F9_12F0_76A9_41B2_CAE551291F14",
  "this.overlay_36382A4C_12F0_39EF_4198_41FC51BE5F1A",
  "this.overlay_5FDF103C_1373_C9A8_41B2_7394FC09F5B5"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -123.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4999886B_457D_82E5_41B1_ED7419E6D06A"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 12,
   "backwardYaw": -164.79,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730",
   "distance": 1
  },
  {
   "yaw": 172.12,
   "backwardYaw": 37.09,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684",
 "thumbnailUrl": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_t.jpg",
 "label": "RUTE_2_011",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_227188E1_12B0_3AD8_4191_5BE0DEB01B5C",
  "this.overlay_20805ECC_12B0_36EF_41A8_0866551354C2"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 7.12,
   "backwardYaw": 179.86,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A69C14_1290_597F_417E_32A8C40623F2",
   "distance": 1
  },
  {
   "yaw": -175.2,
   "backwardYaw": 6.72,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396",
 "thumbnailUrl": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_t.jpg",
 "label": "RUTE_1_028",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0F5D1F8A_1290_376B_4170_E12F8297F534",
  "this.overlay_0C834EC0_1290_56D8_41B2_19D04087EB48"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -119.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AC9EE03_457D_9E25_41C4_637BE5703378"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 1.78,
   "backwardYaw": -162.8,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F",
   "distance": 1
  },
  {
   "yaw": -167.78,
   "backwardYaw": 6.95,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16",
 "thumbnailUrl": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_t.jpg",
 "label": "RUTE_2_007",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_39741D46_1293_FBDB_4187_0F0A7A531558",
  "this.overlay_3F590584_1290_4B5F_4197_5D79F6FA60AB"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -178.58,
   "backwardYaw": 4.33,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46",
   "distance": 1
  },
  {
   "yaw": 5.73,
   "backwardYaw": -175.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A",
 "thumbnailUrl": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_t.jpg",
 "label": "RUTE_1_011",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_01AC5800_12B0_D957_419D_DE515AB1DD80",
  "this.overlay_06FAD5F5_12B0_4AB9_41A0_097B1F5B6C4A"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0CB36990_1290_7B77_4185_203A9F15A004_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500CD516_1371_CB7B_4198_E74933EA24A1_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 37.09,
   "backwardYaw": 172.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684",
   "distance": 1
  },
  {
   "yaw": 7.64,
   "backwardYaw": 115.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080F360_12F0_4FD8_41A4_6668EA80A156",
   "distance": 1
  },
  {
   "yaw": -171.56,
   "backwardYaw": 7.38,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A",
   "distance": 1
  },
  {
   "yaw": -22.91,
   "backwardYaw": 15.71,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30839447_12F0_49D8_41AC_8C0721666D72",
 "thumbnailUrl": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_t.jpg",
 "label": "RUTE_2_010",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_3C6AE7D8_1291_F6F7_41A8_BACDF7CEFD68",
  "this.overlay_2634869A_1290_C96B_419D_DE33684C1BCD",
  "this.overlay_2036E0DC_1290_4AEF_419F_237CB55EEF73",
  "this.overlay_2C170B4A_12AF_FFE8_41A2_61FACFB8215E"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 6.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A707D54_457D_8223_41BD_413E576077CC"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_009",
 "id": "panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C",
 "thumbnailUrl": "media/panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 8.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48139907_457D_822D_41C2_6DCD7B784BB6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -12.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BD36CCB_457D_8225_41C4_6F99323AD085"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 18.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B60B9E7_457D_85ED_41A4_588F9572610D"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_014",
 "id": "panorama_58245D40_139F_DBD7_41A9_3799CF4021D5",
 "thumbnailUrl": "media/panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -170.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B7249CB_457D_8225_41D0_DB22FA894523"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B36CA30_457D_8663_41CB_40B5807C73A9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_498FDB0D_457D_863D_41CA_7C92036E6578"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B50CA05_457D_862D_41C2_2F7104D54527"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49931878_457D_82E3_41C1_7E2CB69D91C9"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -171.19,
   "backwardYaw": 7.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF",
   "distance": 1
  },
  {
   "yaw": 5.53,
   "backwardYaw": -163.83,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA",
 "thumbnailUrl": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_t.jpg",
 "label": "RUTE_1_015",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0795A934_12B0_5BBF_418B_29C4FA2D6796",
  "this.overlay_04CF4F97_12B0_D778_419C_6DD795A297F9"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 29.54,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BBABA97_457D_862D_41CE_25B511DC52A8"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48026BB5_457D_866D_41CC_510BDE4E06AB"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.36,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48E4D92E_457D_827F_41CB_993741BA96CF"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48438B75_457D_86ED_41AE_264A43CC6F97"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -178.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48848C28_457D_8263_41B4_37E0A9F82813"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 179.37,
   "backwardYaw": 3.35,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6",
   "distance": 1
  },
  {
   "yaw": 0.75,
   "backwardYaw": 179.46,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A81204_1290_C95F_4194_B964C3B3CFDA",
 "thumbnailUrl": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_t.jpg",
 "label": "RUTE_1_007",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_02601A79_1290_79A8_41A8_460FFDCA388D",
  "this.overlay_02145A0D_1290_3969_4187_149FD3E74B81"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -64.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BB17CFA_457D_83E7_41D0_A57AECD71840"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 4.53,
   "backwardYaw": -174.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A528E6_1291_DADB_4199_30F832A831C3",
   "distance": 1
  },
  {
   "yaw": -163.83,
   "backwardYaw": 5.53,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485",
 "thumbnailUrl": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_t.jpg",
 "label": "RUTE_1_016",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_079BC3F9_12B3_CEA8_419C_FE824DB652CC",
  "this.overlay_04C84EAD_12B0_76A9_4190_B4E79CFA58A9"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582A3922_1390_3B5B_41A2_0F2460D03646_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BA17D12_457D_8227_41C4_B44077B7ECD2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.18,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B28CC75_457D_82ED_41C1_3B14FDFAFF68"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_021",
 "id": "panorama_58333030_1390_49B7_419C_A8A12705A275",
 "thumbnailUrl": "media/panorama_58333030_1390_49B7_419C_A8A12705A275_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -3.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B05CA57_457D_862D_41C2_256062D31F02"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -178.12,
   "backwardYaw": 7.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA",
 "thumbnailUrl": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_t.jpg",
 "label": "PARKIR_002",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_50D39A0D_1293_D96B_41A1_72F3C6BDD1E1"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 56.55,
   "backwardYaw": -172.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76",
   "distance": 1
  },
  {
   "yaw": -161.9,
   "backwardYaw": 7.82,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30859936_12F0_FBBB_41AC_798CC35649DF",
 "thumbnailUrl": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_t.jpg",
 "label": "RUTE_2_003",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_356D42E1_1290_CED8_418C_0AF47EFE515E",
  "this.overlay_35074896_1290_F97B_4188_53AC47D1978F"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58230C05_1390_5958_418E_7BBF9E458181_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -176.76,
   "backwardYaw": 5.73,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A6F40F_1290_4969_4160_424E39008604",
 "thumbnailUrl": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_t.jpg",
 "label": "RUTE_1_026",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0EAC6D70_1290_3BB7_41A9_EB19E6D61262"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 0.75,
   "backwardYaw": 179.86,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936",
   "distance": 1
  },
  {
   "yaw": 179.46,
   "backwardYaw": 0.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D",
 "thumbnailUrl": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_t.jpg",
 "label": "RUTE_1_008",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_026CAA6E_12B0_39AB_41A0_56AD3D378D88",
  "this.overlay_0046D05F_12B0_C9E8_4172_7555642DEF51"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_006",
 "id": "panorama_500D3F1E_1370_576B_4199_EF960685B250",
 "thumbnailUrl": "media/panorama_500D3F1E_1370_576B_4199_EF960685B250_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3082DE59_12F0_59E9_4194_1BB224F38023_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -14.56,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4801D913_457D_8225_41D0_58A5B0FB9FE6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.19,
  "class": "PanoramaCameraPosition",
  "pitch": 6.35
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 1.78,
   "backwardYaw": 22.68,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06",
   "distance": 1
  },
  {
   "yaw": -167.37,
   "backwardYaw": 8.97,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_500CD516_1371_CB7B_4198_E74933EA24A1",
 "thumbnailUrl": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_t.jpg",
 "label": "GEDUNG_B_1_002",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_572A8519_1370_4B69_41A8_3C915B57B23E",
  "this.overlay_5412C68E_1370_496B_41A9_7A2B8046DFCC"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 12.93,
   "backwardYaw": -8.56,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_5829EA40_1370_59D7_4175_B87115763828",
 "thumbnailUrl": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_t.jpg",
 "label": "GEDUNG_B_3_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_5B2D0A97_1370_7978_41A1_7DE47AC3274A"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.31,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_486608AC_457D_8263_41A3_BC4766F2111D"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_004",
 "id": "panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3",
 "thumbnailUrl": "media/panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.81,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4859E8BA_457D_8267_41C6_8452C5A2DA61"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 10.13,
   "backwardYaw": -151.26,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8",
   "distance": 1
  },
  {
   "yaw": -153.25,
   "backwardYaw": 5.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9",
 "thumbnailUrl": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_t.jpg",
 "label": "RUTE_2_015",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_26A51DB4_12B0_DABF_4193_67807BB60EC6",
  "this.overlay_269A325A_12B0_49EB_417A_BC4437A81C24"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 6.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49BA9844_457D_8223_4170_24826DE2A074"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 0.75,
   "backwardYaw": 179.86,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46",
   "distance": 1
  },
  {
   "yaw": 179.86,
   "backwardYaw": 0.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A5F20B_1290_C968_419A_B9E845F2F936",
 "thumbnailUrl": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_t.jpg",
 "label": "RUTE_1_009",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_03C761A2_12B0_CB5B_41A9_24E6E075EC81",
  "this.overlay_001DDA8D_12B0_7968_41A2_87635A26CE0D"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -173.98,
   "backwardYaw": 6.92,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77",
   "distance": 1
  },
  {
   "yaw": 5.33,
   "backwardYaw": 153.79,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A60A1F_1291_F969_41AA_1D09360C08BC",
 "thumbnailUrl": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_t.jpg",
 "label": "RUTE_1_019",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_050F70C4_12B0_CADF_41A7_59E516667FF0",
  "this.overlay_05145664_12B0_C9D8_4198_94E9F51D7010"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -167.07,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B74DC36_457D_826F_41D0_69432EE54AF5"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_2_001",
 "id": "panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B",
 "thumbnailUrl": "media/panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.48,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B807D3D_457D_825D_41B5_195C54137BDF"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -94.54,
   "backwardYaw": -10.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F",
   "distance": 1
  },
  {
   "yaw": 7.38,
   "backwardYaw": -171.56,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A",
 "thumbnailUrl": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_t.jpg",
 "label": "RUTE_2_009",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_3CB264CE_1297_CAE8_41A8_DEF4E5F85491",
  "this.overlay_3C73BEE7_1290_56D9_419D_433E99560CBC"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_487D1B28_457D_8663_41B3_2BB58D9FBD8A"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 179.86,
   "backwardYaw": 0.75,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936",
   "distance": 1
  },
  {
   "yaw": 4.33,
   "backwardYaw": -178.58,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46",
 "thumbnailUrl": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_t.jpg",
 "label": "RUTE_1_010",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_00C4071C_12B0_5768_41A1_12420B2437A5",
  "this.overlay_01C9DB0B_12B7_DF68_4196_81B1E59C9E76"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -26.21,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48CE8BE9_457D_85E5_41C5_2860098316D0"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 20.78,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_499FAAE6_457D_87EF_41A1_1441A30F680A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4986A884_457D_8223_41A8_39FA69945048"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 78.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BDCECB4_457D_8263_41C7_EE77B9E281BE"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 15.02,
  "class": "PanoramaCameraPosition",
  "pitch": -12.1
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_camera"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_009",
 "id": "panorama_583650FB_1390_4AA9_41A7_C1C78098B247",
 "thumbnailUrl": "media/panorama_583650FB_1390_4AA9_41A7_C1C78098B247_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": 175.88,
   "backwardYaw": -14.98,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581",
 "thumbnailUrl": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_t.jpg",
 "label": "RUTE_6_005",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_30B9A4DA_12F0_4AE8_41A9_36B39284BD3C"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -171.39,
   "backwardYaw": 7.32,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A528E6_1291_DADB_4199_30F832A831C3",
   "distance": 1
  },
  {
   "yaw": 6.92,
   "backwardYaw": -173.98,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A52116_1291_CB78_41A0_8E93673CAD77",
 "thumbnailUrl": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_t.jpg",
 "label": "RUTE_1_018",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_05A2B0E7_12B0_4AD9_41B1_F0A4D81D0AE9",
  "this.overlay_0A0287E9_12B1_D6A8_41A5_47761364B28F"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -171.03,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_486D9ECC_457D_9E23_41CE_0B1C6810897D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_camera"
},
{
 "items": [
  {
   "media": "this.panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_camera"
  },
  {
   "media": "this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_camera"
  },
  {
   "media": "this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_camera"
  },
  {
   "media": "this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936_camera"
  },
  {
   "media": "this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_camera"
  },
  {
   "media": "this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_camera"
  },
  {
   "media": "this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_camera"
  },
  {
   "media": "this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7_camera"
  },
  {
   "media": "this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_camera"
  },
  {
   "media": "this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_camera"
  },
  {
   "media": "this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_camera"
  },
  {
   "media": "this.panorama_18A528E6_1291_DADB_4199_30F832A831C3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A528E6_1291_DADB_4199_30F832A831C3_camera"
  },
  {
   "media": "this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77_camera"
  },
  {
   "media": "this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_camera"
  },
  {
   "media": "this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_camera"
  },
  {
   "media": "this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_camera"
  },
  {
   "media": "this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_camera"
  },
  {
   "media": "this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4_camera"
  },
  {
   "media": "this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_camera"
  },
  {
   "media": "this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_camera"
  },
  {
   "media": "this.panorama_18A6F40F_1290_4969_4160_424E39008604",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6F40F_1290_4969_4160_424E39008604_camera"
  },
  {
   "media": "this.panorama_18A6FC04_1290_795F_4196_870A883C05BA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6FC04_1290_795F_4196_870A883C05BA_camera"
  },
  {
   "media": "this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_camera"
  },
  {
   "media": "this.panorama_18A69C14_1290_597F_417E_32A8C40623F2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_18A69C14_1290_597F_417E_32A8C40623F2_camera"
  },
  {
   "media": "this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2_camera"
  },
  {
   "media": "this.panorama_0CB36990_1290_7B77_4185_203A9F15A004",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0CB36990_1290_7B77_4185_203A9F15A004_camera"
  },
  {
   "media": "this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_camera"
  },
  {
   "media": "this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_camera"
  },
  {
   "media": "this.panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_camera"
  },
  {
   "media": "this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_camera"
  },
  {
   "media": "this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_camera"
  },
  {
   "media": "this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF_camera"
  },
  {
   "media": "this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_camera"
  },
  {
   "media": "this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_camera"
  },
  {
   "media": "this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 35)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_camera"
  },
  {
   "media": "this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 35, 36)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_camera"
  },
  {
   "media": "this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 36, 37)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_camera"
  },
  {
   "media": "this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 37, 38)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_camera"
  },
  {
   "media": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 38, 39)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30839447_12F0_49D8_41AC_8C0721666D72_camera"
  },
  {
   "media": "this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 39, 40)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_camera"
  },
  {
   "media": "this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 40, 41)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_camera"
  },
  {
   "media": "this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 41, 42)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023_camera"
  },
  {
   "media": "this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 42, 43)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_camera"
  },
  {
   "media": "this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 43, 44)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_camera"
  },
  {
   "media": "this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 44, 45)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_camera"
  },
  {
   "media": "this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 45, 46)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_camera"
  },
  {
   "media": "this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 46, 47)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_camera"
  },
  {
   "media": "this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 47, 48)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_camera"
  },
  {
   "media": "this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 48, 49)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_camera"
  },
  {
   "media": "this.panorama_30805221_12F3_C958_4188_D68D920D14FB",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 49, 50)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30805221_12F3_C958_4188_D68D920D14FB_camera"
  },
  {
   "media": "this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 50, 51)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_camera"
  },
  {
   "media": "this.panorama_3080F360_12F0_4FD8_41A4_6668EA80A156",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 51, 52)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_camera"
  },
  {
   "media": "this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 52, 53)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_camera"
  },
  {
   "media": "this.panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 53, 54)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_camera"
  },
  {
   "media": "this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 54, 55)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_camera"
  },
  {
   "media": "this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 55, 56)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1_camera"
  },
  {
   "media": "this.panorama_500DAF90_1371_D777_41AA_382F379E58CE",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 56, 57)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500DAF90_1371_D777_41AA_382F379E58CE_camera"
  },
  {
   "media": "this.panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 57, 58)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_camera"
  },
  {
   "media": "this.panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 58, 59)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500DD4D0_1370_4AF7_419F_DAE24B5E4D68_camera"
  },
  {
   "media": "this.panorama_500D3F1E_1370_576B_4199_EF960685B250",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 59, 60)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500D3F1E_1370_576B_4199_EF960685B250_camera"
  },
  {
   "media": "this.panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 60, 61)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500DF97C_1370_7BAF_41A7_42E3DC3023D0_camera"
  },
  {
   "media": "this.panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 61, 62)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_camera"
  },
  {
   "media": "this.panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 62, 63)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_camera"
  },
  {
   "media": "this.panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 63, 64)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_camera"
  },
  {
   "media": "this.panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 64, 65)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_camera"
  },
  {
   "media": "this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 65, 66)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_camera"
  },
  {
   "media": "this.panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 66, 67)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_camera"
  },
  {
   "media": "this.panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 67, 68)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_camera"
  },
  {
   "media": "this.panorama_5829EA40_1370_59D7_4175_B87115763828",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 68, 69)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5829EA40_1370_59D7_4175_B87115763828_camera"
  },
  {
   "media": "this.panorama_41F98000_1390_4957_41AA_06D842C87E40",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 69, 70)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_41F98000_1390_4957_41AA_06D842C87E40_camera"
  },
  {
   "media": "this.panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 70, 71)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_camera"
  },
  {
   "media": "this.panorama_582E97A5_1390_D759_4199_36000DEC1683",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 71, 72)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582E97A5_1390_D759_4199_36000DEC1683_camera"
  },
  {
   "media": "this.panorama_58368404_1390_C95F_418B_0A875A0C068C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 72, 73)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58368404_1390_C95F_418B_0A875A0C068C_camera"
  },
  {
   "media": "this.panorama_582960C6_1390_CADB_419B_0FD42D7F4B39",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 73, 74)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_camera"
  },
  {
   "media": "this.panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 74, 75)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_camera"
  },
  {
   "media": "this.panorama_582A3922_1390_3B5B_41A2_0F2460D03646",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 75, 76)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582A3922_1390_3B5B_41A2_0F2460D03646_camera"
  },
  {
   "media": "this.panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 76, 77)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58368548_1390_4BE8_41A8_E3B0AD73ADCE_camera"
  },
  {
   "media": "this.panorama_583650FB_1390_4AA9_41A7_C1C78098B247",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 77, 78)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_583650FB_1390_4AA9_41A7_C1C78098B247_camera"
  },
  {
   "media": "this.panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 78, 79)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_camera"
  },
  {
   "media": "this.panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 79, 80)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_582EC92A_1390_5BA8_41AE_7F78C06BED30_camera"
  },
  {
   "media": "this.panorama_583EF486_1390_495B_4158_C9E4C66D8930",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 80, 81)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_583EF486_1390_495B_4158_C9E4C66D8930_camera"
  },
  {
   "media": "this.panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 81, 82)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_camera"
  },
  {
   "media": "this.panorama_58245D40_139F_DBD7_41A9_3799CF4021D5",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 82, 83)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_camera"
  },
  {
   "media": "this.panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 83, 84)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_camera"
  },
  {
   "media": "this.panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 84, 85)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5822B567_139F_CBD8_419E_6AB1BD1FB250_camera"
  },
  {
   "media": "this.panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 85, 86)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_camera"
  },
  {
   "media": "this.panorama_58245D02_1390_3B58_417D_16901B546427",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 86, 87)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58245D02_1390_3B58_417D_16901B546427_camera"
  },
  {
   "media": "this.panorama_58276915_1390_5B79_41AA_B9CE8298385D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 87, 88)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58276915_1390_5B79_41AA_B9CE8298385D_camera"
  },
  {
   "media": "this.panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 88, 89)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_camera"
  },
  {
   "media": "this.panorama_58333030_1390_49B7_419C_A8A12705A275",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 89, 90)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_58333030_1390_49B7_419C_A8A12705A275_camera"
  },
  {
   "media": "this.panorama_58230C05_1390_5958_418E_7BBF9E458181",
   "camera": "this.panorama_58230C05_1390_5958_418E_7BBF9E458181_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 90, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 98.96,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_484E38C7_457D_822D_4174_A1A53B0E9B38"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A66DD6B_457D_82E5_41D0_A83AFBD55915"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A52116_1291_CB78_41A0_8E93673CAD77_camera"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_022",
 "id": "panorama_58230C05_1390_5958_418E_7BBF9E458181",
 "thumbnailUrl": "media/panorama_58230C05_1390_5958_418E_7BBF9E458181_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 176.07,
   "backwardYaw": -81.04,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89",
   "distance": 1
  },
  {
   "yaw": -101.14,
   "backwardYaw": 177.07,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB36990_1290_7B77_4185_203A9F15A004",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_0CCB3121_1290_4B59_4171_99013F043BA2",
 "thumbnailUrl": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_t.jpg",
 "label": "RUTE_6_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0D293374_1291_CFB8_41B0_A466A7FBF09F",
  "this.overlay_0DC20FF1_1290_76B9_41AE_621F5A84FED1"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A25EDB6_457D_826F_419A_85EB23F5C360"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58245D02_1390_3B58_417D_16901B546427_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58245D02_1390_3B58_417D_16901B546427_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_018",
 "id": "panorama_58245D02_1390_3B58_417D_16901B546427",
 "thumbnailUrl": "media/panorama_58245D02_1390_3B58_417D_16901B546427_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 12.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4984AB1A_457D_8627_41C9_25B4F6A99A4A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48931996_457D_822F_41CC_DB449F3A8204"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_013",
 "id": "panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8",
 "thumbnailUrl": "media/panorama_5839B0FC_139F_CAAF_41A1_8BDDC0B9A3F8_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -0.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48744EB2_457D_9E67_41C6_347C8B31AB35"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 55.38,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4834A8E1_457D_83E5_4185_EE5EF08B6214"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -3.21,
   "backwardYaw": -154.44,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A",
   "distance": 1
  },
  {
   "yaw": -161.01,
   "backwardYaw": 3.17,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D",
 "thumbnailUrl": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_t.jpg",
 "label": "RUTE_2_018",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_2A9A0ECE_12B1_D6EB_41B2_82CB248C4C8D",
  "this.overlay_2A532D4F_12B1_FBE9_41A3_DC48D272FBC8"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A880E37_457D_9E6D_41C2_69522AEC1AB9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -175.67,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_485D7EF3_457D_9FE5_41A0_CD346DF6ADBE"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 165.44,
   "backwardYaw": 60.16,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6",
   "distance": 1
  },
  {
   "yaw": 7.75,
   "backwardYaw": -178.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3",
 "thumbnailUrl": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_t.jpg",
 "label": "PARKIR_001",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_50F529BF_1290_7AA8_4185_ED671A50F2FB",
  "this.overlay_57D88DF0_1290_5AB7_41B1_F57E2F2228B3"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -169.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AEB5DEA_457D_9DE7_41C1_40BDE7F2C05F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -102.91,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4873989F_457D_825D_41D1_502FBA91CD9E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.67,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AFAEDDC_457D_8223_4196_62D819980D82"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 169.24,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4861DB4F_457D_863D_41C3_EE0F815B6DA2"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -172.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_488189B2_457D_8267_41CE_8D82BEE486FB"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 177.07,
   "backwardYaw": -101.14,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2",
   "distance": 1
  },
  {
   "yaw": 11.7,
   "backwardYaw": 167.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_0CB36990_1290_7B77_4185_203A9F15A004",
 "thumbnailUrl": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_t.jpg",
 "label": "RUTE_6_002",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0D67E0A4_1290_495F_41AD_B330F42D9300",
  "this.overlay_32F4E5E6_1290_4ADB_418B_B4BE0BF5C905"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5836ECB0_1390_DAB7_419C_C517B442CE5F_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 22.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B0EEC8D_457D_823D_41C1_978726D373F9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0CCB3121_1290_4B59_4171_99013F043BA2_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 2.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_556ECE51_457D_9E25_413D_D1385D5A0E58"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 10.9,
   "backwardYaw": -177.57,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA",
   "distance": 1
  },
  {
   "yaw": 167.12,
   "backwardYaw": 11.7,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CB36990_1290_7B77_4185_203A9F15A004",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58",
 "thumbnailUrl": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_t.jpg",
 "label": "RUTE_6_003",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_326FB132_12EF_CBBB_41AC_60837397BEA5",
  "this.overlay_318C46D4_12F1_D6FF_41B2_9482DF1B8282"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 11.9,
   "backwardYaw": 164.93,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89",
   "distance": 1
  },
  {
   "yaw": 153.79,
   "backwardYaw": 5.33,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A602F8_1291_CEA8_41A4_71B848014EBD",
 "thumbnailUrl": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_t.jpg",
 "label": "RUTE_1_020",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0A90A6F9_12B0_36A9_41A8_796395561BBD",
  "this.overlay_0A229874_12B0_79BF_41AF_9ADEBB58DAEA"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B5B3C4F_457D_823D_41CD_F229B61E0CD7"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_583650FB_1390_4AA9_41A7_C1C78098B247_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -172.96,
   "backwardYaw": 6.37,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76",
   "distance": 1
  },
  {
   "yaw": 7.55,
   "backwardYaw": -171.16,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504",
   "distance": 1
  },
  {
   "yaw": 60.16,
   "backwardYaw": 165.44,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6",
 "thumbnailUrl": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_t.jpg",
 "label": "RUTE_2_005",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_388DDAD2_129F_FEF8_41AD_7B4EB616660B",
  "this.overlay_3EF72E87_1290_D958_419E_A7198069D224",
  "this.overlay_553C93A8_1290_4F57_419A_21B1DD71A9A7"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_017",
 "id": "panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A",
 "thumbnailUrl": "media/panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 16.17,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48783892_457D_8227_41C4_573E19E9B410"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_2_004",
 "id": "panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22",
 "thumbnailUrl": "media/panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58333030_1390_49B7_419C_A8A12705A275_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -157.43,
   "backwardYaw": 5.36,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730",
   "distance": 1
  },
  {
   "yaw": 4.36,
   "backwardYaw": -158.42,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_3082DE59_12F0_59E9_4194_1BB224F38023",
 "thumbnailUrl": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_t.jpg",
 "label": "RUTE_2_013",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_20B7B928_12B0_5BA8_4194_23B0C2FAB6DD",
  "this.overlay_21D8579A_12B0_F76B_416F_4A8108559920"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_019",
 "id": "panorama_58276915_1390_5B79_41AA_B9CE8298385D",
 "thumbnailUrl": "media/panorama_58276915_1390_5B79_41AA_B9CE8298385D_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49A33AD9_457D_8625_41CC_884E8BF155ED"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_2_005",
 "id": "panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56",
 "thumbnailUrl": "media/panorama_5737CBAC_1370_7EAF_418B_2B9DA6073D56_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 176.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A358DA9_457D_8265_41AB_F972C9DF3D31"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -168.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BF42A63_457D_86E5_4168_B52F02100535"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -170.69,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48372B82_457D_8627_41C8_4F34D14D175D"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_005",
 "id": "panorama_582960C6_1390_CADB_419B_0FD42D7F4B39",
 "thumbnailUrl": "media/panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58368404_1390_C95F_418B_0A875A0C068C_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 4.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48540F00_457D_9E23_41C8_3AA457622F48"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 18.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BE40A70_457D_86E3_41CC_0908BE4DF704"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_49C67836_457D_826F_41BC_B0E7A6B10B87"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 179.99,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BCA9A8A_457D_8627_41AA_BF2AE4508FBD"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 165.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B4AEC5C_457D_8223_41D0_550485DB5DE8"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -164.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B903D2B_457D_8265_41C1_E99E99C66E26"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -174.98,
   "backwardYaw": 7.52,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89",
   "distance": 1
  },
  {
   "yaw": 5.53,
   "backwardYaw": -173.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E",
 "thumbnailUrl": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_t.jpg",
 "label": "RUTE_1_022",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0B11A047_1291_C9D9_41A7_D555FA8830B7",
  "this.overlay_08431FA8_1290_7757_41AC_F3CC06472251"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 21.58,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_55782E44_457D_9E23_41A2_7582CCD7CC6D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582E97A5_1390_D759_4199_36000DEC1683_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582960C6_1390_CADB_419B_0FD42D7F4B39_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A5F20B_1290_C968_419A_B9E845F2F936_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500D1E2E_1370_59AB_4185_AC1E9B22B38C_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 7.45,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B38EC68_457D_82E3_419F_8078115CB21C"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 179.86,
   "backwardYaw": 7.12,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A69C14_1290_597F_417E_32A8C40623F2",
 "thumbnailUrl": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_t.jpg",
 "label": "RUTE_1_029",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0E1E32BC_1290_CEA8_41B1_E9990838FADB"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_2_002",
 "id": "panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA",
 "thumbnailUrl": "media/panorama_576BAB6A_1370_3FA8_4170_C737AA77B0DA_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_583150C1_139F_CAD9_41A9_DE9420E10D7A_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -157.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48778EBF_457D_9E5D_41D0_A229E180AEC9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A6F40F_1290_4969_4160_424E39008604_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5B0E526C_1370_C9AF_41B3_0839EF005F2B_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 179.58,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48525F0C_457D_9E23_41AF_D5B5B54FC913"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4AB9EE11_457D_9E25_41C6_6BBCABD620F8"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_582E97A5_1390_D759_4199_36000DEC1683"
  },
  {
   "yaw": -172.21,
   "backwardYaw": 9.35,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_41F98000_1390_4957_41AA_06D842C87E40",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475",
 "thumbnailUrl": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_t.jpg",
 "label": "RUTE_3_002",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_5C24EE10_1390_D977_41A4_BE76A753788A",
  "this.overlay_5E69F408_1390_C968_4197_5131258FE32C"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_012",
 "id": "panorama_583EF486_1390_495B_4158_C9E4C66D8930",
 "thumbnailUrl": "media/panorama_583EF486_1390_495B_4158_C9E4C66D8930_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A528E6_1291_DADB_4199_30F832A831C3_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -0.42,
   "backwardYaw": -175.18,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF",
   "distance": 1
  },
  {
   "yaw": 77.09,
   "backwardYaw": -179.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE",
   "distance": 1
  },
  {
   "yaw": -124.62,
   "backwardYaw": 9.31,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A7208B_1290_4969_41A8_E57FABE879D7",
 "thumbnailUrl": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_t.jpg",
 "label": "RUTE_1_013",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_06E6A92A_12B0_DBAB_4184_D0053AB905A0",
  "this.overlay_060CFC94_12B0_5978_41B0_65F6C68773AC",
  "this.overlay_36BEF9CB_12F0_3AE9_41A2_8E6CC17486D7"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -175.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4860AEE6_457D_9FEE_41A5_E00AD83EC89E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58245D02_1390_3B58_417D_16901B546427_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 28.74,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4BFD4C9B_457D_8225_41CD_50924DB4504B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -2.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4840A8D4_457D_8223_4192_96A40AF228D9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500DAF90_1371_D777_41AA_382F379E58CE_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -175.18,
   "backwardYaw": -0.42,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7",
   "distance": 1
  },
  {
   "yaw": 7.92,
   "backwardYaw": -171.19,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF",
 "thumbnailUrl": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_t.jpg",
 "label": "RUTE_1_014",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_063D4BB7_12B0_3EB9_41A5_A850752CBED0",
  "this.overlay_07580C4C_12B0_59E8_41AA_6E3D459C4B0C"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 15.81,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A458D9A_457D_8227_41C4_66F98DA8AF6D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -82.23,
   "backwardYaw": -175.97,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED",
   "distance": 1
  },
  {
   "yaw": 6.72,
   "backwardYaw": -175.2,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396",
   "distance": 1
  },
  {
   "yaw": -173.78,
   "backwardYaw": 3.94,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB",
 "thumbnailUrl": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_t.jpg",
 "label": "RUTE_1_024",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_08C85CDF_1290_3AE9_41A4_444C4C80DB37",
  "this.overlay_09B72876_1290_39BB_417C_75D6D709E455",
  "this.overlay_0E0EA010_1290_4978_419D_C6AEE034A068"
 ]
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_010",
 "id": "panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F",
 "thumbnailUrl": "media/panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": -172.55,
   "backwardYaw": 56.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF",
   "distance": 1
  },
  {
   "yaw": 6.37,
   "backwardYaw": -172.96,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6",
   "distance": 1
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3"
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76",
 "thumbnailUrl": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_t.jpg",
 "label": "RUTE_2_004",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_38DB2E49_1290_59E9_4185_8031A98E921A",
  "this.overlay_3A691107_1291_CB59_4190_B45FCF0E3651",
  "this.overlay_55B6758C_1290_CB68_4193_0966E134374A"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_41F98000_1390_4957_41AA_06D842C87E40_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 5.73,
   "backwardYaw": -176.76,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6F40F_1290_4969_4160_424E39008604",
   "distance": 1
  },
  {
   "yaw": -175.97,
   "backwardYaw": -82.23,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED",
 "thumbnailUrl": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_t.jpg",
 "label": "RUTE_1_025",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_09682CCE_1290_7AE8_41B1_8350F1E74106",
  "this.overlay_0EAB5D23_1290_5B59_4160_ECB54BA93DE3"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A7208B_1290_4969_41A8_E57FABE879D7_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -174.27,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4828D8ED_457D_83FD_41AE_7682FBE1836B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -178.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48CFA948_457D_8223_41D0_A464A1C62A92"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 126.76,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4896BC1C_457D_8223_4195_CD4681D68B70"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500D3F1E_1370_576B_4199_EF960685B250_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 25.56,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_480DCBA8_457D_8663_41AF_D9FD4D391B89"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -173.28,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4A571D83_457D_8225_41BD_7F209AA847C2"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 9.31,
   "backwardYaw": -124.62,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7",
   "distance": 1
  },
  {
   "yaw": -175.17,
   "backwardYaw": 5.73,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B",
 "thumbnailUrl": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_t.jpg",
 "label": "RUTE_1_012",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_01099EE7_12B0_56D8_41AC_887A1C5D98C9",
  "this.overlay_066B9C57_12B0_F9F9_41A5_B96C01F17F11"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5737D0F3_1370_4AB9_41A3_6F35B1264E22_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 7.82,
   "backwardYaw": -161.9,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF",
   "distance": 1
  },
  {
   "yaw": -172.69,
   "backwardYaw": 10.4,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_30849067_12F0_C9D8_4191_8DBA15CEA405",
 "thumbnailUrl": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_t.jpg",
 "label": "RUTE_2_002",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_37D60B91_1290_DF79_41B2_73405C0966D0",
  "this.overlay_37A3F602_1290_4958_41A4_96321CD3E1C6"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 5.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_4B152A4A_457D_8627_41C8_36F6737AAAA5"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58276915_1390_5B79_41AA_B9CE8298385D_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_500D4A68_1370_39D7_41A5_A0A7DFEAA8B3_camera"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_007",
 "id": "panorama_582A3922_1390_3B5B_41A2_0F2460D03646",
 "thumbnailUrl": "media/panorama_582A3922_1390_3B5B_41A2_0F2460D03646_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_58245D40_139F_DBD7_41A9_3799CF4021D5_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 6.95,
   "backwardYaw": -167.78,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16",
   "distance": 1
  },
  {
   "yaw": -171.16,
   "backwardYaw": 7.55,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_308E628C_12F0_C96F_41B2_C85D6B49E504",
 "thumbnailUrl": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_t.jpg",
 "label": "RUTE_2_006",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_3E004C14_1290_3978_4157_3A354E9C83B0",
  "this.overlay_39AE5D33_1290_FBB9_4192_97E7852BAD9E"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -4.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_499B5AF4_457D_87E3_41AB_E3CF14810C0B"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_003",
 "id": "panorama_582E97A5_1390_D759_4199_36000DEC1683",
 "thumbnailUrl": "media/panorama_582E97A5_1390_D759_4199_36000DEC1683_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "adjacentPanoramas": [
  {
   "yaw": 7.52,
   "backwardYaw": -174.98,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E",
   "distance": 1
  },
  {
   "yaw": -81.04,
   "backwardYaw": 176.07,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2",
   "distance": 1
  },
  {
   "yaw": 164.93,
   "backwardYaw": 11.9,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD",
   "distance": 1
  }
 ],
 "hfovMin": "135%",
 "hfov": 360,
 "partial": false,
 "id": "panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89",
 "thumbnailUrl": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_t.jpg",
 "label": "RUTE_1_021",
 "pitch": 0,
 "hfovMax": 130,
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "class": "Panorama",
 "overlays": [
  "this.overlay_0A6A9624_12B0_495F_419D_F3E0BBB5E4F7",
  "this.overlay_0BAF760A_12AF_C968_41A3_CD519323E18C",
  "this.overlay_0C395158_1290_4BE8_41A5_920088AA0F1C"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 1.42,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48E46BCF_457D_863D_41D0_0C27D1785906"
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "RUTE_3_015",
 "id": "panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E",
 "thumbnailUrl": "media/panorama_5839E98D_139F_FB69_41B1_FE7BF6C5E01E_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "GEDUNG_B_1_008",
 "id": "panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0",
 "thumbnailUrl": "media/panorama_500D13DC_1370_4EE8_41B0_4EAF35435DF0_t.jpg",
 "partial": false,
 "class": "Panorama",
 "pitch": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -173.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48DA3BDC_457D_8623_41B2_B8B3E5BB46DC"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 4.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_48492B68_457D_86E3_41AE_BDC778DE1BE0"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_582CAD3F_1390_7BA8_419C_6FFFD37FFA2F_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_5826C4E4_1390_4AD8_4152_FCEAADA336A6_camera"
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "paddingLeft": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "playbackBarHeadShadowHorizontalLength": 0,
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "100%",
 "minHeight": 50,
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "height": "100%",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "shadow": false,
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "paddingRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressRight": 0,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "class": "ViewerArea",
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13,
   "image": "this.AnimatedImageResource_2E0D0DA0_12B0_5B57_41A3_14B88EB7B004",
   "pitch": -14.76,
   "yaw": -164.19,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A, this.camera_4BCA9A8A_457D_8627_41AA_BF2AE4508FBD); this.mainPlayList.set('selectedIndex', 47)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_28CD8241_12B0_C9D9_41A4_21BC40CAE3F0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13,
   "yaw": -164.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.38,
   "image": "this.AnimatedImageResource_2E0D3DA0_12B0_5B57_4164_45AEE2180A20",
   "pitch": -5.61,
   "yaw": 3.37,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30805221_12F3_C958_4188_D68D920D14FB, this.camera_4BBABA97_457D_862D_41CE_25B511DC52A8); this.mainPlayList.set('selectedIndex', 49)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_28BCE7B1_12B0_D6B9_4196_44D7C11E5165",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.38,
   "yaw": 3.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.53,
   "image": "this.AnimatedImageResource_08420749_12B0_77E9_41B0_94A5D439A73C",
   "pitch": -6.27,
   "yaw": 7.32,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77, this.camera_486A2ED9_457D_9E25_41CB_0326537B5F96); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04EE3CAE_12B0_5AAB_41AF_F7B8C502029B",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.53,
   "yaw": 7.32,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.08,
   "image": "this.AnimatedImageResource_0842E749_12B0_77E9_41A8_8FAE015D5296",
   "pitch": -18.01,
   "yaw": -174.17,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485, this.camera_4860AEE6_457D_9FEE_41A5_E00AD83EC89E); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_05849C6F_12B0_59A9_418D_E9947EF4208B",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.08,
   "yaw": -174.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.99,
   "image": "this.AnimatedImageResource_35CB12B5_3E36_3820_41A3_2539AB3DB95A",
   "pitch": 0.5,
   "yaw": 9.35,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475, this.camera_498FDB0D_457D_863D_41CA_7C92036E6578); this.mainPlayList.set('selectedIndex', 70)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_423511E5_1390_4AD8_41B2_497030889C21",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.99,
   "yaw": 9.35,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_1_HS_0_0.png",
      "width": 117,
      "class": "ImageResourceLevel",
      "height": 110
     }
    ]
   },
   "hfov": 6.64,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -17.74,
   "yaw": 8.97
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1, this.camera_48A75C0E_457D_823F_41C6_0A437207AC8D); this.mainPlayList.set('selectedIndex', 55)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_50C5A73E_1370_57A8_4196_CEE4816B9CAC",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 6.64,
   "yaw": 8.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_1_HS_0_0_0_map.gif",
      "width": 17,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.82,
   "image": "this.AnimatedImageResource_4295C308_1390_4F68_41AC_F8E37A038BD8",
   "pitch": -27.99,
   "yaw": -178.19,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE, this.camera_4896BC1C_457D_8223_4195_CD4681D68B70); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5A2A9BAB_1390_DEA8_41AF_7740631D5FBC",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.82,
   "yaw": -178.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -27.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.08,
   "image": "this.AnimatedImageResource_3D78AE1A_1290_396B_41A1_02BDE5D99A37",
   "pitch": -13.37,
   "yaw": -10.76,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A, this.camera_48BDF955_457D_822C_41B5_0EC9E718DD79); this.mainPlayList.set('selectedIndex', 37)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3E8B6F52_1290_37FB_4181_4C02AE46217D",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.08,
   "yaw": -10.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.19,
   "image": "this.AnimatedImageResource_3D794E1A_1290_396B_41A4_8DB6467C2D48",
   "pitch": -11.18,
   "yaw": -162.8,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16, this.camera_48CFA948_457D_8223_41D0_A464A1C62A92); this.mainPlayList.set('selectedIndex', 35)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3E10769B_1290_4968_4196_D55A98961B75",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.19,
   "yaw": -162.8,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.4,
   "image": "this.AnimatedImageResource_2E0D4DA0_12B0_5B57_41B1_D1121F122FE4",
   "pitch": -4.41,
   "yaw": -0.01,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25, this.camera_4A458D9A_457D_8227_41C4_66F98DA8AF6D); this.mainPlayList.set('selectedIndex', 48)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2A1EBB14_12B0_3F78_416A_044C5131D79E",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.4,
   "yaw": -0.01,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.03,
   "image": "this.AnimatedImageResource_2E0D6DA0_12B0_5B57_419D_9B6D0AB41D12",
   "pitch": -14.16,
   "yaw": -154.44,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D, this.camera_4A358DA9_457D_8265_41AB_F972C9DF3D31); this.mainPlayList.set('selectedIndex', 46)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_282B6ECA_12BF_D6E8_419A_AA97DA562DF3",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.03,
   "yaw": -154.44,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.36,
   "image": "this.AnimatedImageResource_2E08BD9B_12B0_5B69_41A5_2A1B3817B206",
   "pitch": -6.2,
   "yaw": 5.36,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023, this.camera_4B0EEC8D_457D_823D_41C1_978726D373F9); this.mainPlayList.set('selectedIndex', 41)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_26017374_12B3_CFBF_4196_87988ECF4C15",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.36,
   "yaw": 5.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.54,
   "image": "this.AnimatedImageResource_2E0F5D9B_12B0_5B69_4188_5E7B7642EB26",
   "pitch": -21.13,
   "yaw": -164.79,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684, this.camera_4B1EFC81_457D_8225_41C0_5A21936A29AC); this.mainPlayList.set('selectedIndex', 39)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2315DE9C_12B0_796F_41AF_5F726CAAC2C5",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.54,
   "yaw": -164.79,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.68,
   "image": "this.AnimatedImageResource_3BA3311B_12F0_4B69_41AC_B9BC8AF6E265",
   "pitch": -23.99,
   "yaw": -177.57,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58, this.camera_49918B00_457D_8623_41D0_EF5C4E633754); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_31C7067E_12F1_C9A8_4194_D4FF57BDE90A",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.68,
   "yaw": -177.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.44,
   "image": "this.AnimatedImageResource_3BAC811B_12F0_4B68_41A5_D543DE3F7AEE",
   "pitch": 0.33,
   "yaw": -14.98,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581, this.camera_499B5AF4_457D_87E3_41AB_E3CF14810C0B); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_308ED263_12F0_49D8_41AE_4E84DE7FC821",
 "data": {
  "label": "Info Red 03"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.44,
   "yaw": -14.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.86,
   "image": "this.AnimatedImageResource_5E9D8B7C_1293_DFAF_4150_F0477972A03A",
   "pitch": -16.28,
   "yaw": 115.75,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30839447_12F0_49D8_41AC_8C0721666D72, this.camera_48E4D92E_457D_827F_41CB_993741BA96CF); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_51E5D92C_1290_5BA8_416C_4A4E6B4C0704",
 "data": {
  "label": "Arrow 02c Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 14.86,
   "yaw": 115.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0_HS_0_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.87,
   "image": "this.AnimatedImageResource_5E821B7D_1293_DFA9_41AA_61514AD6F457",
   "pitch": -15.26,
   "yaw": -104.91,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30839447_12F0_49D8_41AC_8C0721666D72, this.camera_48DB093B_457D_8264_41B4_2A5AC97423CD); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_53D58C44_1290_39DF_41AF_A15EED7D2CB0",
 "data": {
  "label": "Arrow 02c Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.87,
   "yaw": -104.91,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0_HS_1_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.34,
   "image": "this.AnimatedImageResource_0C44A8C1_1290_5AD8_41AD_95942D99EF8A",
   "pitch": -12.64,
   "yaw": 3.94,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB, this.camera_49BA9844_457D_8223_4170_24826DE2A074); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_08B268AF_1290_7AA9_4199_33E5741117DD",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.34,
   "yaw": 3.94,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.22,
   "image": "this.AnimatedImageResource_0C4378C1_1290_5AD8_41AD_CDEE6816E0E4",
   "pitch": -15.23,
   "yaw": -173.18,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E, this.camera_49C67836_457D_826F_41BC_B0E7A6B10B87); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_08964C4A_1290_79EB_418E_D03D153D4FB9",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.22,
   "yaw": -173.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.4,
   "image": "this.AnimatedImageResource_2E0E6D9E_12B0_5B6B_41B0_F533D38EFDD4",
   "pitch": -4.81,
   "yaw": 9.74,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C, this.camera_4AD9CDF6_457D_9DEF_4198_B86D8C362C9D); this.mainPlayList.set('selectedIndex', 45)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2778CC2A_12B0_39AB_41B1_F991300FD6E6",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.4,
   "yaw": 9.74,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.89,
   "image": "this.AnimatedImageResource_2E0E0D9E_12B0_5B6B_4192_2FB8BCC33234",
   "pitch": -16.55,
   "yaw": -151.26,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9, this.camera_4AEB5DEA_457D_9DE7_41C1_40BDE7F2C05F); this.mainPlayList.set('selectedIndex', 43)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2713B04A_12B0_C9EB_41B0_885B447F570F",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.89,
   "yaw": -151.26,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.11,
   "image": "this.AnimatedImageResource_2E0D9DA2_12B0_5B5B_4192_F88E85830F46",
   "pitch": -12.77,
   "yaw": 15.71,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30839447_12F0_49D8_41AC_8C0721666D72, this.camera_4827BF5B_457D_9E25_41CA_C2D4C468E0F7); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2ECE24E7_12B3_CAD9_41A0_EC428AD7193F",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.11,
   "yaw": 15.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.52,
   "image": "this.AnimatedImageResource_2E0C4DA2_12B0_5B5B_41A6_B7EA4A870465",
   "pitch": -21.33,
   "yaw": -159.22,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30805221_12F3_C958_4188_D68D920D14FB, this.camera_482CCF4D_457D_9E3D_41D1_22363D5BDFC1); this.mainPlayList.set('selectedIndex', 49)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2E93ED55_12B3_DBF9_4198_DD0E67603754",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.52,
   "yaw": -159.22,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_1_HS_0_0.png",
      "width": 150,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "hfov": 7.66,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -31.07,
   "yaw": 22.68
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_500CD516_1371_CB7B_4198_E74933EA24A1, this.camera_48848C28_457D_8263_41B4_37E0A9F82813); this.mainPlayList.set('selectedIndex', 55)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_55D6526B_1370_49A8_41A0_49AFB3E140CD",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.66,
   "yaw": 22.68,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_1_HS_1_0.png",
      "width": 150,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "hfov": 8.89,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": 6.15,
   "yaw": -8.56
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5829EA40_1370_59D7_4175_B87115763828, this.camera_4B74DC36_457D_826F_41D0_69432EE54AF5); this.mainPlayList.set('selectedIndex', 68)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_558DCBE8_1370_5ED7_41A0_134650860473",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.89,
   "yaw": -8.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 6.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_573635F4_1370_4AB8_41B0_17651EB1AE06_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.39,
   "image": "this.AnimatedImageResource_2E0E3D9E_12B0_5B68_41A5_98C6017AE92F",
   "pitch": -5.21,
   "yaw": 3.17,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D, this.camera_4B60B9E7_457D_85ED_41A4_588F9572610D); this.mainPlayList.set('selectedIndex', 46)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2411103D_12B0_C9A8_41B2_3423A8FE1AF4",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.39,
   "yaw": 3.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.83,
   "image": "this.AnimatedImageResource_2E0EDD9E_12B0_5B68_417C_3BB015226E1E",
   "pitch": -17.35,
   "yaw": -161.01,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8, this.camera_4B7249CB_457D_8225_41D0_DB22FA894523); this.mainPlayList.set('selectedIndex', 44)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_25AE7E21_12B0_D958_41B2_68B845F18FCC",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.83,
   "yaw": -161.01,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.95,
   "image": "this.AnimatedImageResource_2E0DDDA1_12B0_5B59_4197_27A8929F0CD6",
   "pitch": -15.56,
   "yaw": -150.46,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25, this.camera_49A33AD9_457D_8625_41CC_884E8BF155ED); this.mainPlayList.set('selectedIndex', 48)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2C6A93FE_12B1_CEAB_4199_4D3164E23AA8",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.95,
   "yaw": -150.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.43,
   "image": "this.AnimatedImageResource_2E0DFDA2_12B0_5B5B_41A0_5699E48D6020",
   "pitch": -2.42,
   "yaw": 6.35,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93, this.camera_499FAAE6_457D_87EF_41A1_1441A30F680A); this.mainPlayList.set('selectedIndex', 50)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2DEC66A3_12B0_4958_41A5_8E599EA04084",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.43,
   "yaw": 6.35,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.42,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.34,
   "image": "this.AnimatedImageResource_2E0FCD9C_12B0_5B6F_4185_BB0F8CB6D199",
   "pitch": -7.2,
   "yaw": 5.96,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9, this.camera_48755B34_457D_8663_41CE_4C0A055AA4DC); this.mainPlayList.set('selectedIndex', 43)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_21B3CE15_12B0_3979_41B0_95F2D6055117",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.34,
   "yaw": 5.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.98,
   "image": "this.AnimatedImageResource_2E0FED9C_12B0_5B6F_41AB_FFF1F73AAC7D",
   "pitch": -15.16,
   "yaw": -158.42,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082DE59_12F0_59E9_4194_1BB224F38023, this.camera_486FBB42_457D_8627_41B6_495266DE9D0C); this.mainPlayList.set('selectedIndex', 41)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2120F236_12B7_C9B8_41AE_44C3A9494C6E",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.98,
   "yaw": -158.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.8,
   "image": "this.AnimatedImageResource_03593CB2_1291_FABB_41AE_AC3156EC9BBA",
   "pitch": -8.06,
   "yaw": 3.35,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA, this.camera_48744EB2_457D_9E67_41C6_347C8B31AB35); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_1D405EC1_1293_D6D9_41A5_E6F01D1BD16D",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.8,
   "yaw": 3.35,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.2,
   "image": "this.AnimatedImageResource_3F0C8439_12F3_C9A8_4196_903CCAB8ED56",
   "pitch": -29.76,
   "yaw": -179.76,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7, this.camera_4873989F_457D_825D_41D1_502FBA91CD9E); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_31ED26F9_12F0_76A9_41B2_CAE551291F14",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.2,
   "yaw": -179.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.71,
   "image": "this.AnimatedImageResource_5A6910B7_1370_CAB9_419C_EFE03311B600",
   "pitch": -8.43,
   "yaw": 10.4,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405, this.camera_486608AC_457D_8263_41A3_BC4766F2111D); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_36382A4C_12F0_39EF_4198_41FC51BE5F1A",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.71,
   "yaw": 10.4,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.59,
   "image": "this.AnimatedImageResource_5A6940B7_1370_CAB9_4187_058AA7CF7A2C",
   "pitch": -12.62,
   "yaw": -53.24,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA, this.camera_4859E8BA_457D_8267_41C6_8452C5A2DA61); this.mainPlayList.set('selectedIndex', 54)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5FDF103C_1373_C9A8_41B2_7394FC09F5B5",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.59,
   "yaw": -53.24,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.85,
   "image": "this.AnimatedImageResource_2E0E6D99_12B0_5B69_415B_A01ADE04EA80",
   "pitch": -9.38,
   "yaw": 12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730, this.camera_482A1B8F_457D_863D_41BD_57686BF770AC); this.mainPlayList.set('selectedIndex', 40)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_227188E1_12B0_3AD8_4191_5BE0DEB01B5C",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.85,
   "yaw": 12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.8,
   "image": "this.AnimatedImageResource_2E0E0D9B_12B0_5B69_41A4_FA0B973A977B",
   "pitch": -17.75,
   "yaw": 172.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30839447_12F0_49D8_41AC_8C0721666D72, this.camera_481FBB9C_457D_8623_41C1_C66C907DFA0A); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_20805ECC_12B0_36EF_41A8_0866551354C2",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.8,
   "yaw": 172.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.31,
   "image": "this.AnimatedImageResource_0C550622_1297_C95B_413E_761DF707A090",
   "pitch": -13.44,
   "yaw": 7.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A69C14_1290_597F_417E_32A8C40623F2, this.camera_4A66DD6B_457D_82E5_41D0_A83AFBD55915); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0F5D1F8A_1290_376B_4170_E12F8297F534",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.31,
   "yaw": 7.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.36,
   "image": "this.AnimatedImageResource_0C556623_1297_C959_41B0_E441ABE0ED90",
   "pitch": -12.04,
   "yaw": -175.2,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB, this.camera_4A571D83_457D_8225_41BD_7F209AA847C2); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0C834EC0_1290_56D8_41B2_19D04087EB48",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.36,
   "yaw": -175.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.77,
   "image": "this.AnimatedImageResource_3D786E19_1290_3969_419C_7940704359D2",
   "pitch": -18.14,
   "yaw": -167.78,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504, this.camera_483C9F32_457D_9E67_4181_CC58FB7217E0); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_39741D46_1293_FBDB_4187_0F0A7A531558",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.77,
   "yaw": -167.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.21,
   "image": "this.AnimatedImageResource_3D781E1A_1290_396B_41A3_EADCA0CA6DA8",
   "pitch": -10.58,
   "yaw": 1.78,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F, this.camera_48471F26_457D_9E6F_41C9_E1E02F159D3D); this.mainPlayList.set('selectedIndex', 36)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3F590584_1290_4B5F_4197_5D79F6FA60AB",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.21,
   "yaw": 1.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.49,
   "image": "this.AnimatedImageResource_0AA56F96_12B3_D77B_41B2_4B19FF4E1B92",
   "pitch": -8.26,
   "yaw": 5.73,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B, this.camera_48540F00_457D_9E23_41C8_3AA457622F48); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_01AC5800_12B0_D957_419D_DE515AB1DD80",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.49,
   "yaw": 5.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.94,
   "image": "this.AnimatedImageResource_0AA5BF9C_12B3_D76F_4185_6A6FB05615A3",
   "pitch": -20.2,
   "yaw": -178.58,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46, this.camera_485D7EF3_457D_9FE5_41A0_CD346DF6ADBE); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_06FAD5F5_12B0_4AB9_41A0_097B1F5B6C4A",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.94,
   "yaw": -178.58,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.99,
   "image": "this.AnimatedImageResource_3D765E1C_1290_3968_419F_AC287E7568F9",
   "pitch": -14.96,
   "yaw": -171.56,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A, this.camera_4BA17D12_457D_8227_41C4_B44077B7ECD2); this.mainPlayList.set('selectedIndex', 37)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3C6AE7D8_1291_F6F7_41A8_BACDF7CEFD68",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.99,
   "yaw": -171.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.48,
   "image": "this.AnimatedImageResource_41D6FAA2_1290_D95B_4196_E6A25DCF36BA",
   "pitch": -6.93,
   "yaw": 37.09,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684, this.camera_4BC33CE3_457D_83E5_41C9_60ED59E112F1); this.mainPlayList.set('selectedIndex', 39)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2634869A_1290_C96B_419D_DE33684C1BCD",
 "data": {
  "label": "Arrow 02b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.48,
   "yaw": 37.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_2_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.28,
   "image": "this.AnimatedImageResource_41D66AA3_1290_D959_417F_7CF1CDE5C485",
   "pitch": -7.58,
   "yaw": -22.91,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93, this.camera_4B903D2B_457D_8265_41C1_E99E99C66E26); this.mainPlayList.set('selectedIndex', 50)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2036E0DC_1290_4AEF_419F_237CB55EEF73",
 "data": {
  "label": "Arrow 02b Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.28,
   "yaw": -22.91,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_3_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.02,
   "image": "this.AnimatedImageResource_41D7FAA3_1290_D959_4185_92DBBFE75D80",
   "pitch": 4.75,
   "yaw": 7.64,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080F360_12F0_4FD8_41A4_6668EA80A156, this.camera_4BB17CFA_457D_83E7_41D0_A57AECD71840); this.mainPlayList.set('selectedIndex', 51)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2C170B4A_12AF_FFE8_41A2_61FACFB8215E",
 "data": {
  "label": "Info Red 03"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.02,
   "yaw": 7.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 4.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.52,
   "image": "this.AnimatedImageResource_08ACA257_12B1_C9F8_4194_0F9D79321156",
   "pitch": -6.87,
   "yaw": 5.53,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485, this.camera_48783892_457D_8227_41C4_573E19E9B410); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0795A934_12B0_5BBF_418B_29C4FA2D6796",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.52,
   "yaw": 5.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.88,
   "image": "this.AnimatedImageResource_08A3025C_12B1_C9E8_417A_C2CDCDE52D5C",
   "pitch": -21.2,
   "yaw": -171.19,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF, this.camera_4986A884_457D_8223_41A8_39FA69945048); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04CF4F97_12B0_D778_419C_6DD795A297F9",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.88,
   "yaw": -171.19,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.39,
   "image": "this.AnimatedImageResource_08A87255_12B1_C9F8_41A5_635AA257CDD9",
   "pitch": -11.25,
   "yaw": 0.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D, this.camera_4A144DC3_457D_8225_41C2_1B7EC07E5CD6); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_02601A79_1290_79A8_41A8_460FFDCA388D",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.39,
   "yaw": 0.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.79,
   "image": "this.AnimatedImageResource_074E00B8_12B0_4AA8_4173_7B6E2EAAC33E",
   "pitch": -22.16,
   "yaw": 179.37,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6, this.camera_4A25EDB6_457D_826F_419A_85EB23F5C360); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_02145A0D_1290_3969_4187_149FD3E74B81",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.79,
   "yaw": 179.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.54,
   "image": "this.AnimatedImageResource_08A3725D_12B1_C9E8_41A3_449E56716ABD",
   "pitch": -6.07,
   "yaw": 4.53,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A528E6_1291_DADB_4199_30F832A831C3, this.camera_4B6B5C42_457D_8227_41BF_59675B797D9B); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_079BC3F9_12B3_CEA8_419C_FE824DB652CC",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.54,
   "yaw": 4.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.94,
   "image": "this.AnimatedImageResource_08A3C25D_12B1_C9E8_41A9_937DFA163B2D",
   "pitch": -20.2,
   "yaw": -163.83,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA, this.camera_4B5B3C4F_457D_823D_41CD_F229B61E0CD7); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_04C84EAD_12B0_76A9_4190_B4E79CFA58A9",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.94,
   "yaw": -163.83,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.8,
   "image": "this.AnimatedImageResource_41C0CAB0_1290_DEB8_41B0_F7F0A88945FD",
   "pitch": -17.75,
   "yaw": -178.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3, this.camera_488189B2_457D_8267_41CE_8D82BEE486FB); this.mainPlayList.set('selectedIndex', 52)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_50D39A0D_1293_D96B_41A1_72F3C6BDD1E1",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.8,
   "yaw": -178.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.26,
   "image": "this.AnimatedImageResource_3F30D234_1291_C9B8_4157_7D982889CC26",
   "pitch": -15,
   "yaw": -161.9,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30849067_12F0_C9D8_4191_8DBA15CEA405, this.camera_4B28CC75_457D_82ED_41C1_3B14FDFAFF68); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_356D42E1_1290_CED8_418C_0AF47EFE515E",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.26,
   "yaw": -161.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.65,
   "image": "this.AnimatedImageResource_389D8AE3_1293_FED9_41AC_527C3346E1BB",
   "pitch": -14.04,
   "yaw": 56.55,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76, this.camera_4B38EC68_457D_82E3_419F_8078115CB21C); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_35074896_1290_F97B_4188_53AC47D1978F",
 "data": {
  "label": "Arrow 02b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.65,
   "yaw": 56.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0_HS_3_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.59,
   "image": "this.AnimatedImageResource_0C41C8C2_1290_5AD8_41A0_975EED41BAF1",
   "pitch": -25.18,
   "yaw": -176.76,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED, this.camera_48342F40_457D_9E23_41C5_45C2B2344900); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0EAC6D70_1290_3BB7_41A9_EB19E6D61262",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.59,
   "yaw": -176.76,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -25.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.39,
   "image": "this.AnimatedImageResource_005DE032_12B0_49BB_41B1_F15846207DA4",
   "pitch": -11.25,
   "yaw": 0.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936, this.camera_4B36CA30_457D_8663_41CB_40B5807C73A9); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_026CAA6E_12B0_39AB_41A0_56AD3D378D88",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.39,
   "yaw": 0.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.89,
   "image": "this.AnimatedImageResource_0039A5F4_12B3_CAB8_41A1_20D4E23775B1",
   "pitch": -21,
   "yaw": 179.46,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A81204_1290_C95F_4194_B964C3B3CFDA, this.camera_4B26AA3D_457D_865D_41C4_A648517D8E3B); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0046D05F_12B0_C9E8_4172_7555642DEF51",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.89,
   "yaw": 179.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_1_HS_0_0.png",
      "width": 150,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "hfov": 8.9,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -5.2,
   "yaw": 1.78
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06, this.camera_48778EBF_457D_9E5D_41D0_A229E180AEC9); this.mainPlayList.set('selectedIndex', 65)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_572A8519_1370_4B69_41A8_3C915B57B23E",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.9,
   "yaw": 1.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_1_HS_1_0.png",
      "width": 150,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "hfov": 8.17,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.9,
   "yaw": -167.37
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_57EF7A03_1371_F958_419B_B6E409AA52BA, this.camera_486D9ECC_457D_9E23_41CE_0B1C6810897D); this.mainPlayList.set('selectedIndex', 54)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5412C68E_1370_496B_41A9_7A2B8046DFCC",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.17,
   "yaw": -167.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -23.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_500CD516_1371_CB7B_4198_E74933EA24A1_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_1_HS_0_0.png",
      "width": 150,
      "class": "ImageResourceLevel",
      "height": 150
     }
    ]
   },
   "hfov": 8.66,
   "distance": 50,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -14.35,
   "yaw": 12.93
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_573635F4_1370_4AB8_41B0_17651EB1AE06, this.camera_48F02921_457D_8265_41B6_2C261E56BE0A); this.mainPlayList.set('selectedIndex', 65)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5B2D0A97_1370_7978_41A1_7DE47AC3274A",
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.66,
   "yaw": 12.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5829EA40_1370_59D7_4175_B87115763828_1_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.94,
   "image": "this.AnimatedImageResource_2E0F9D9D_12B0_5B69_41B2_056F790DF53F",
   "pitch": -15.76,
   "yaw": -153.25,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34, this.camera_4BED1CA8_457D_8263_41D0_2D8CAF373682); this.mainPlayList.set('selectedIndex', 42)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_26A51DB4_12B0_DABF_4193_67807BB60EC6",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.94,
   "yaw": -153.25,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.37,
   "image": "this.AnimatedImageResource_2E0E4D9D_12B0_5B69_41A2_F61D262C318F",
   "pitch": -5.81,
   "yaw": 10.13,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8, this.camera_4BFD4C9B_457D_8225_41CD_50924DB4504B); this.mainPlayList.set('selectedIndex', 44)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_269A325A_12B0_49EB_417A_BC4437A81C24",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.37,
   "yaw": 10.13,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.39,
   "image": "this.AnimatedImageResource_074D50B8_12B0_4AA8_41B1_D3E5A2399F0D",
   "pitch": -11.25,
   "yaw": 0.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46, this.camera_4B50CA05_457D_862D_41C2_2F7104D54527); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_03C761A2_12B0_CB5B_41A9_24E6E075EC81",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.39,
   "yaw": 0.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.07,
   "image": "this.AnimatedImageResource_074D10B8_12B0_4AA8_41A3_75FEF7874EF4",
   "pitch": -18.21,
   "yaw": 179.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D, this.camera_4B40CA1B_457D_8625_4175_5D0E6B55A0B6); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_001DDA8D_12B0_7968_41A2_87635A26CE0D",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.07,
   "yaw": 179.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.21,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.59,
   "image": "this.AnimatedImageResource_0843E74A_12B0_77EB_41AE_F7C1A5A72534",
   "pitch": -2.69,
   "yaw": 5.33,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD, this.camera_48CE8BE9_457D_85E5_41C5_2860098316D0); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_050F70C4_12B0_CADF_41A7_59E516667FF0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.59,
   "yaw": 5.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.93,
   "image": "this.AnimatedImageResource_0840474A_12B0_77EB_4193_F239F71F62C5",
   "pitch": -20.4,
   "yaw": -173.98,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A52116_1291_CB78_41A0_8E93673CAD77, this.camera_48DA3BDC_457D_8623_41B2_B8B3E5BB46DC); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_05145664_12B0_C9D8_4198_94E9F51D7010",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.93,
   "yaw": -173.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.28,
   "image": "this.AnimatedImageResource_3D79FE1B_1290_3968_41B2_CBB5F3446CDA",
   "pitch": -8.79,
   "yaw": -94.54,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3082E344_12F0_4FD8_4199_C97F4995F22F, this.camera_4861DB4F_457D_863D_41C3_EE0F815B6DA2); this.mainPlayList.set('selectedIndex', 36)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3CB264CE_1297_CAE8_41A8_DEF4E5F85491",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.28,
   "yaw": -94.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.96,
   "image": "this.AnimatedImageResource_3D79AE1B_1290_3968_41AD_199346D30F0A",
   "pitch": -9.51,
   "yaw": 7.38,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30839447_12F0_49D8_41AC_8C0721666D72, this.camera_48554B5C_457D_8623_41B7_4637479DB326); this.mainPlayList.set('selectedIndex', 38)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3C73BEE7_1290_56D9_419D_433E99560CBC",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.96,
   "yaw": 7.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.51,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.46,
   "image": "this.AnimatedImageResource_0AA4DF96_12B3_D77B_41A5_ABC478DA5D54",
   "pitch": -9.06,
   "yaw": 4.33,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A, this.camera_48E46BCF_457D_863D_41D0_0C27D1785906); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_00C4071C_12B0_5768_41A1_12420B2437A5",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.46,
   "yaw": 4.33,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.87,
   "image": "this.AnimatedImageResource_0AA51F96_12B3_D77B_41B0_66617EAEFD2E",
   "pitch": -21.4,
   "yaw": 179.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5F20B_1290_C968_419A_B9E845F2F936, this.camera_48F00BC2_457D_8627_41B2_B7C29BA49983); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_01C9DB0B_12B7_DF68_4196_81B1E59C9E76",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.87,
   "yaw": 179.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.98,
   "image": "this.AnimatedImageResource_30A1EE30_12F0_59B7_41A0_14415E0B0A54",
   "pitch": -19.97,
   "yaw": 175.88,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA, this.camera_4B4AEC5C_457D_8223_41D0_550485DB5DE8); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_30B9A4DA_12F0_4AE8_41A9_36B39284BD3C",
 "data": {
  "label": "Circle Door 02"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.98,
   "yaw": 175.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0_HS_0_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.54,
   "image": "this.AnimatedImageResource_08435749_12B0_77E9_41A1_08FC87A4787A",
   "pitch": -5.88,
   "yaw": 6.92,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC, this.camera_49A6785D_457D_82DD_4186_EEC983371EA7); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_05A2B0E7_12B0_4AD9_41B1_F0A4D81D0AE9",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.54,
   "yaw": 6.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.13,
   "image": "this.AnimatedImageResource_0843174A_12B0_77EB_41AE_AF93D03A2D6A",
   "pitch": -17.02,
   "yaw": -171.39,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A528E6_1291_DADB_4199_30F832A831C3, this.camera_49B38851_457D_8225_4190_8BBE766681FD); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0A0287E9_12B1_D6A8_41A5_47761364B28F",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.13,
   "yaw": -171.39,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.35,
   "image": "this.AnimatedImageResource_3BA18113_12F0_4B78_419B_17B338C0364B",
   "pitch": -12.44,
   "yaw": -101.14,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB36990_1290_7B77_4185_203A9F15A004, this.camera_4840A8D4_457D_8223_4192_96A40AF228D9); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0D293374_1291_CFB8_41B0_A466A7FBF09F",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.35,
   "yaw": -101.14,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.11,
   "image": "this.AnimatedImageResource_3BA11114_12F0_4B78_4198_80D8B2248931",
   "pitch": -40.1,
   "yaw": 176.07,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89, this.camera_484E38C7_457D_822D_4174_A1A53B0E9B38); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0DC20FF1_1290_76B9_41AE_621F5A84FED1",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.11,
   "yaw": 176.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -40.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.79,
   "image": "this.AnimatedImageResource_2E0EFD9F_12B0_5B69_419E_501D05FAD792",
   "pitch": -4.67,
   "yaw": -3.21,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A, this.camera_480DCBA8_457D_8663_41AF_D9FD4D391B89); this.mainPlayList.set('selectedIndex', 47)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2A9A0ECE_12B1_D6EB_41B2_82CB248C4C8D",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.79,
   "yaw": -3.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -4.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.87,
   "image": "this.AnimatedImageResource_2E0E9D9F_12B0_5B69_417D_59B114EE5003",
   "pitch": -16.75,
   "yaw": -161.01,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3083B060_12F3_C9D8_41AB_06E931EB715C, this.camera_48026BB5_457D_866D_41CC_510BDE4E06AB); this.mainPlayList.set('selectedIndex', 45)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2A532D4F_12B1_FBE9_41A3_DC48D272FBC8",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.87,
   "yaw": -161.01,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.78,
   "image": "this.AnimatedImageResource_41C3FAAF_1290_DEA8_4188_5471F96FBFA0",
   "pitch": -22.49,
   "yaw": 165.44,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6, this.camera_4AC9EE03_457D_9E25_41C4_637BE5703378); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_50F529BF_1290_7AA8_4185_ED671A50F2FB",
 "data": {
  "label": "Arrow 02c Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 16.78,
   "yaw": 165.44,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_1_HS_0_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.23,
   "image": "this.AnimatedImageResource_41C36AAF_1290_DEA8_41A1_547FC9B886F3",
   "pitch": -10.18,
   "yaw": 7.75,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA, this.camera_4AB9EE11_457D_9E25_41C6_6BBCABD620F8); this.mainPlayList.set('selectedIndex', 53)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_57D88DF0_1290_5AB7_41B1_F57E2F2228B3",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.23,
   "yaw": 7.75,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_1_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.31,
   "image": "this.AnimatedImageResource_3BA2E114_12F0_4B78_41B2_AA478DF7F5F5",
   "pitch": -13.44,
   "yaw": 11.7,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58, this.camera_4BD36CCB_457D_8225_41C4_6F99323AD085); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0D67E0A4_1290_495F_41AD_B330F42D9300",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.31,
   "yaw": 11.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.48,
   "image": "this.AnimatedImageResource_3BA2611A_12F0_4B6B_41AA_347DEDEC79A9",
   "pitch": -26.57,
   "yaw": 177.07,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2, this.camera_4BDCECB4_457D_8263_41C7_EE77B9E281BE); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_32F4E5E6_1290_4ADB_418B_B4BE0BF5C905",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.48,
   "yaw": 177.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.12,
   "image": "this.AnimatedImageResource_3BA3F11A_12F0_4B6B_41AA_8758B50DB3F4",
   "pitch": -17.22,
   "yaw": 167.12,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB36990_1290_7B77_4185_203A9F15A004, this.camera_555F3E5E_457D_9EDF_41B2_5771043398D3); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_326FB132_12EF_CBBB_41AC_60837397BEA5",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.12,
   "yaw": 167.12,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.72,
   "image": "this.AnimatedImageResource_3BA3A11B_12F0_4B69_4185_934A731DD5DC",
   "pitch": -10.45,
   "yaw": 10.9,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA, this.camera_556ECE51_457D_9E25_413D_D1385D5A0E58); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_318C46D4_12F1_D6FF_41B2_9482DF1B8282",
 "data": {
  "label": "Arrow 01 Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.72,
   "yaw": 10.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.53,
   "image": "this.AnimatedImageResource_0C46E8C0_1290_5AD8_4185_9186CB01054C",
   "pitch": -6.47,
   "yaw": 11.9,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89, this.camera_4A044DD0_457D_8223_41CE_5A2B66AEF943); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0A90A6F9_12B0_36A9_41A8_796395561BBD",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.53,
   "yaw": 11.9,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.64,
   "image": "this.AnimatedImageResource_0C4558C0_1290_5AD8_41A6_D35132D4136E",
   "pitch": -24.58,
   "yaw": 153.79,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A60A1F_1291_F969_41AA_1D09360C08BC, this.camera_4AFAEDDC_457D_8223_4196_62D819980D82); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0A229874_12B0_79BF_41AF_9ADEBB58DAEA",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.64,
   "yaw": 153.79,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.54,
   "image": "this.AnimatedImageResource_3D7ABE16_1290_397B_41AA_F3ED653AC2A0",
   "pitch": -21.13,
   "yaw": -172.96,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76, this.camera_481ED8FA_457D_83E7_41B9_D2768A0BDC0C); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_388DDAD2_129F_FEF8_41AD_7B4EB616660B",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.54,
   "yaw": -172.96,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.26,
   "image": "this.AnimatedImageResource_3D7B6E16_1290_397B_41AC_820502E3B670",
   "pitch": -9.59,
   "yaw": 7.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308E628C_12F0_C96F_41B2_C85D6B49E504, this.camera_48139907_457D_822D_41C2_6DCD7B784BB6); this.mainPlayList.set('selectedIndex', 34)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3EF72E87_1290_D958_419E_A7198069D224",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.26,
   "yaw": 7.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.84,
   "image": "this.AnimatedImageResource_41D2EA9A_1290_D968_41B0_74B4036101A6",
   "pitch": -12.08,
   "yaw": 60.16,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3, this.camera_4801D913_457D_8225_41D0_58A5B0FB9FE6); this.mainPlayList.set('selectedIndex', 52)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_553C93A8_1290_4F57_419A_21B1DD71A9A7",
 "data": {
  "label": "Arrow 02c Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 15.84,
   "yaw": 60.16,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_2_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.21,
   "image": "this.AnimatedImageResource_2E0F7D9B_12B0_5B69_41A2_6041EA624EB0",
   "pitch": -10.58,
   "yaw": 4.36,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_308396BE_12F0_36A8_4169_9F508D2A9A34, this.camera_55782E44_457D_9E23_41A2_7582CCD7CC6D); this.mainPlayList.set('selectedIndex', 42)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_20B7B928_12B0_5BA8_4194_23B0C2FAB6DD",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.21,
   "yaw": 4.36,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.73,
   "image": "this.AnimatedImageResource_2E0F2D9C_12B0_5B6F_41A7_C668C7505941",
   "pitch": -18.74,
   "yaw": -157.43,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30809506_12F0_4B5B_41A2_E99AB3C67730, this.camera_4A880E37_457D_9E6D_41C2_69522AEC1AB9); this.mainPlayList.set('selectedIndex', 40)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_21D8579A_12B0_F76B_416F_4A8108559920",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.73,
   "yaw": -157.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.51,
   "image": "this.AnimatedImageResource_0C4468C1_1290_5AD8_4193_9DABF284EC5B",
   "pitch": -7.47,
   "yaw": 5.53,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4, this.camera_4A707D54_457D_8223_41BD_413E576077CC); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0B11A047_1291_C9D9_41A7_D555FA8830B7",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.51,
   "yaw": 5.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.24,
   "image": "this.AnimatedImageResource_0C4438C1_1290_5AD8_4196_1F88BFBFC3FB",
   "pitch": -14.83,
   "yaw": -174.98,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89, this.camera_4B807D3D_457D_825D_41B5_195C54137BDF); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_08431FA8_1290_7757_41AC_F3CC06472251",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.24,
   "yaw": -174.98,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.31,
   "image": "this.AnimatedImageResource_0C4048C3_1290_5AD8_418A_A1BE2F6FAE89",
   "pitch": -13.44,
   "yaw": 179.86,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396, this.camera_4AA8DE1E_457D_9E5F_41B9_54156921C7AC); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0E1E32BC_1290_CEA8_41B1_E9990838FADB",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.31,
   "yaw": 179.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.03,
   "image": "this.AnimatedImageResource_35CBF2B6_3E36_3820_41C7_4CBB764B5471",
   "pitch": -26.81,
   "yaw": -172.21,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_41F98000_1390_4957_41AA_06D842C87E40, this.camera_4A98BE2B_457D_9E65_4163_66DDDF829A78); this.mainPlayList.set('selectedIndex', 69)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5C24EE10_1390_D977_41A4_BE76A753788A",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.03,
   "yaw": -172.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -26.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.1,
   "image": "this.AnimatedImageResource_35CBA2B6_3E36_3820_41C5_5B49AB663CE1",
   "pitch": -19.17,
   "yaw": 7.78,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 71)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_5E69F408_1390_C968_4197_5131258FE32C",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 13.1,
   "yaw": 7.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_1_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.8,
   "image": "this.AnimatedImageResource_59CADB0E_1290_5F6B_41AA_ED5D0B496755",
   "pitch": -2.18,
   "yaw": -0.42,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF, this.camera_48492B68_457D_86E3_41AE_BDC778DE1BE0); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_06E6A92A_12B0_DBAB_4184_D0053AB905A0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.8,
   "yaw": -0.42,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.16,
   "image": "this.AnimatedImageResource_0563FFA2_12B0_575B_4185_5F25FF0C8BD6",
   "pitch": -16.42,
   "yaw": -124.62,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B, this.camera_48372B82_457D_8627_41C8_4F34D14D175D); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_060CFC94_12B0_5978_41B0_65F6C68773AC",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.16,
   "yaw": -124.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.42,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.35,
   "image": "this.AnimatedImageResource_59CA2B0E_1290_5F6B_4165_4C44E5EB352E",
   "pitch": -3.69,
   "yaw": 77.09,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE, this.camera_48438B75_457D_86ED_41AE_264A43CC6F97); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_36BEF9CB_12F0_3AE9_41A2_8E6CC17486D7",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.35,
   "yaw": 77.09,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.54,
   "image": "this.AnimatedImageResource_08ADF257_12B1_C9F8_41B1_8FFAC4CA0918",
   "pitch": -6.07,
   "yaw": 7.92,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA, this.camera_484FCF19_457D_9E25_41CA_4A836A5F891F); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_063D4BB7_12B0_3EB9_41A5_A850752CBED0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.54,
   "yaw": 7.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.87,
   "image": "this.AnimatedImageResource_08AC5257_12B1_C9F8_4180_9D7FFC4F7E64",
   "pitch": -21.4,
   "yaw": -175.18,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7, this.camera_48525F0C_457D_9E23_41AF_D5B5B54FC913); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_07580C4C_12B0_59E8_41AA_6E3D459C4B0C",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.87,
   "yaw": -175.18,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -21.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.4,
   "image": "this.AnimatedImageResource_0C43E8C2_1290_5AD8_41AC_1946095BDA21",
   "pitch": -11.05,
   "yaw": -82.23,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED, this.camera_48B3C962_457D_82E7_41CA_50061FB01890); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_08C85CDF_1290_3AE9_41A4_444C4C80DB37",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.4,
   "yaw": -82.23,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.48,
   "image": "this.AnimatedImageResource_0C4248C2_1290_5AD8_418A_A9992866890F",
   "pitch": -8.46,
   "yaw": -173.78,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6BC0B_1290_3969_419C_D64912901FE4, this.camera_48931996_457D_822F_41CC_DB449F3A8204); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_09B72876_1290_39BB_417C_75D6D709E455",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.48,
   "yaw": -173.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.13,
   "image": "this.AnimatedImageResource_0C4228C2_1290_5AD8_418F_085DE64B3409",
   "pitch": -17.02,
   "yaw": 6.72,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396, this.camera_48A3197B_457D_82E5_41AC_0719453F169F); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0E0EA010_1290_4978_419D_C6AEE034A068",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.13,
   "yaw": 6.72,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.86,
   "image": "this.AnimatedImageResource_59BDEB15_1290_5F78_419B_97C93D0FF68E",
   "pitch": -16.04,
   "yaw": 6.37,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6, this.camera_49931878_457D_82E3_41C1_7E2CB69D91C9); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_38DB2E49_1290_59E9_4185_8031A98E921A",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 7.86,
   "yaw": 6.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -16.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.51,
   "image": "this.AnimatedImageResource_3D7A2E15_1290_3979_41B1_F00ACF029C30",
   "pitch": -31.08,
   "yaw": -172.55,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF, this.camera_4999886B_457D_82E5_41B1_ED7419E6D06A); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3A691107_1291_CB59_4190_B45FCF0E3651",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.51,
   "yaw": -172.55,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -31.08,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.79,
   "image": "this.AnimatedImageResource_59BD3B16_1290_5F78_418F_638015787C1A",
   "pitch": -11.99,
   "yaw": 40.68,
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 52)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_55B6758C_1290_CB68_4193_0966E134374A",
 "data": {
  "label": "Arrow 02b Right-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 5.79,
   "yaw": 40.68,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_2_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.51,
   "image": "this.AnimatedImageResource_0C4288C2_1290_5AD8_41A6_CAE7C06914D3",
   "pitch": -7.47,
   "yaw": 5.73,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6F40F_1290_4969_4160_424E39008604, this.camera_48BC7BF6_457D_85EF_41CB_216DB3916918); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_09682CCE_1290_7AE8_41B1_8350F1E74106",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.51,
   "yaw": 5.73,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.21,
   "image": "this.AnimatedImageResource_0C4178C2_1290_5AD8_41AD_DFCCF29B8CCD",
   "pitch": -15.63,
   "yaw": -175.97,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB, this.camera_48B22C02_457D_8227_41CA_57569FB10845); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0EAB5D23_1290_5B59_4160_ECB54BA93DE3",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.21,
   "yaw": -175.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -15.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.41,
   "image": "this.AnimatedImageResource_0AA21F9C_12B3_D76F_41A7_0F29AAD075ED",
   "pitch": -10.85,
   "yaw": 9.31,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A7208B_1290_4969_41A8_E57FABE879D7, this.camera_4834A8E1_457D_83E5_4185_EE5EF08B6214); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_01099EE7_12B0_56D8_41AC_887A1C5D98C9",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.41,
   "yaw": 9.31,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.97,
   "image": "this.AnimatedImageResource_0AA25F9C_12B3_D76F_41A0_08D8FCF3CCFD",
   "pitch": -19.81,
   "yaw": -175.17,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A, this.camera_4828D8ED_457D_83FD_41AE_7682FBE1836B); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_066B9C57_12B0_F9F9_41A5_B96C01F17F11",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.97,
   "yaw": -175.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.69,
   "image": "this.AnimatedImageResource_3F303234_1291_C9B8_41AF_AC89D1E27D78",
   "pitch": -9.43,
   "yaw": 7.82,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_30859936_12F0_FBBB_41AC_798CC35649DF, this.camera_4BE40A70_457D_86E3_41CC_0908BE4DF704); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_37D60B91_1290_DF79_41B2_73405C0966D0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 8.69,
   "yaw": 7.82,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.61,
   "image": "this.AnimatedImageResource_3F304234_1291_C9B8_41A1_A7870072BEBC",
   "pitch": -20.27,
   "yaw": -172.69,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE, this.camera_4BD45A7D_457D_86DD_41A2_A3C38A729735); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_37A3F602_1290_4958_41A4_96321CD3E1C6",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 11.61,
   "yaw": -172.69,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.76,
   "image": "this.AnimatedImageResource_3D7B0E18_1290_3977_41A5_5F8BB79265B7",
   "pitch": -18.34,
   "yaw": -171.16,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6, this.camera_487D1B28_457D_8663_41B3_2BB58D9FBD8A); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3E004C14_1290_3978_4157_3A354E9C83B0",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.76,
   "yaw": -171.16,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.8,
   "image": "this.AnimatedImageResource_3D7BBE18_1290_3968_418D_E13B1CA414CA",
   "pitch": -17.75,
   "yaw": 6.95,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16, this.camera_4984AB1A_457D_8627_41C9_25B4F6A99A4A); this.mainPlayList.set('selectedIndex', 35)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_39AE5D33_1290_FBB9_4192_97E7852BAD9E",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 12.8,
   "yaw": 6.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.53,
   "image": "this.AnimatedImageResource_0C4518C0_1290_5AD8_419F_EFA9735A755E",
   "pitch": -6.27,
   "yaw": 7.52,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E, this.camera_4B152A4A_457D_8627_41C8_36F6737AAAA5); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0A6A9624_12B0_495F_419D_F3E0BBB5E4F7",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.53,
   "yaw": 7.52,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.94,
   "image": "this.AnimatedImageResource_0C4588C1_1290_5AD8_4193_D44E96121863",
   "pitch": -20.2,
   "yaw": 164.93,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_18A602F8_1291_CEA8_41A4_71B848014EBD, this.camera_4BF42A63_457D_86E5_4168_B52F02100535); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0BAF760A_12AF_C968_41A3_CD519323E18C",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 9.94,
   "yaw": 164.93,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.43,
   "image": "this.AnimatedImageResource_3F751430_12F3_C9B8_41A7_53EBB43B0F79",
   "pitch": -10.05,
   "yaw": -81.04,
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_0CCB3121_1290_4B59_4171_99013F043BA2, this.camera_4B05CA57_457D_862D_41C2_256062D31F02); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_0C395158_1290_4BE8_41A5_920088AA0F1C",
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "hfov": 10.43,
   "yaw": -81.04,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_2_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   }
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0D0DA0_12B0_5B57_41A3_14B88EB7B004",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0D3DA0_12B0_5B57_4164_45AEE2180A20",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308209C6_12F3_DAD8_41AA_9A30C227CE25_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08420749_12B0_77E9_41B0_94A5D439A73C",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0842E749_12B0_77E9_41A8_8FAE015D5296",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A528E6_1291_DADB_4199_30F832A831C3_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_35CB12B5_3E36_3820_41A3_2539AB3DB95A",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_41F98000_1390_4957_41AA_06D842C87E40_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_4295C308_1390_4F68_41AC_F8E37A038BD8",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_57EF7A03_1371_F958_419B_B6E409AA52BA_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D78AE1A_1290_396B_41A1_02BDE5D99A37",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D794E1A_1290_396B_41A4_8DB6467C2D48",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082E344_12F0_4FD8_4199_C97F4995F22F_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0D4DA0_12B0_5B57_41B1_D1121F122FE4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0D6DA0_12B0_5B57_419D_9B6D0AB41D12",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308CB0F9_12F3_CAA8_41B2_49081D85865A_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E08BD9B_12B0_5B69_41A5_2A1B3817B206",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0F5D9B_12B0_5B69_4188_5E7B7642EB26",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30809506_12F0_4B5B_41A2_E99AB3C67730_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA3311B_12F0_4B69_41AC_B9BC8AF6E265",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3BAC811B_12F0_4B68_41A5_D543DE3F7AEE",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_0CB33A1C_1290_5968_41B1_747F72DDF2DA_0_HS_1_0.png",
   "width": 500,
   "class": "ImageResourceLevel",
   "height": 750
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_5E9D8B7C_1293_DFAF_4150_F0477972A03A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0_HS_0_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_5E821B7D_1293_DFA9_41AA_61514AD6F457",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3080F360_12F0_4FD8_41A4_6668EA80A156_0_HS_1_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C44A8C1_1290_5AD8_41AD_95942D99EF8A",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4378C1_1290_5AD8_41AD_CDEE6816E0E4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6BC0B_1290_3969_419C_D64912901FE4_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E6D9E_12B0_5B6B_41B0_F533D38EFDD4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E0D9E_12B0_5B6B_4192_2FB8BCC33234",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308677F7_12F3_D6B9_419A_51A1B866CCA8_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0D9DA2_12B0_5B5B_4192_F88E85830F46",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0C4DA2_12B0_5B5B_41A6_B7EA4A870465",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30806A9C_12F0_3968_41A0_4B98CEC28B93_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E3D9E_12B0_5B68_41A5_98C6017AE92F",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0EDD9E_12B0_5B68_417C_3BB015226E1E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3083B060_12F3_C9D8_41AB_06E931EB715C_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0DDDA1_12B0_5B59_4197_27A8929F0CD6",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0DFDA2_12B0_5B5B_41A0_5699E48D6020",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30805221_12F3_C958_4188_D68D920D14FB_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0FCD9C_12B0_5B6F_4185_BB0F8CB6D199",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0FED9C_12B0_5B6F_41AB_FFF1F73AAC7D",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308396BE_12F0_36A8_4169_9F508D2A9A34_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_03593CB2_1291_FABB_41AE_AC3156EC9BBA",
 "frameDuration": 90,
 "levels": [
  {
   "url": "media/panorama_18EB2371_1290_CFB9_41AC_1C6FB19B91E6_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3F0C8439_12F3_C9A8_4196_903CCAB8ED56",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_5A6910B7_1370_CAB9_419C_EFE03311B600",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_5A6940B7_1370_CAB9_4187_058AA7CF7A2C",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_37FD3715_12F0_D779_41B0_E16832A5A9BE_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E6D99_12B0_5B69_415B_A01ADE04EA80",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E0D9B_12B0_5B69_41A4_FA0B973A977B",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30806CAB_12F0_7AA8_41A3_B13095A2A684_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C550622_1297_C95B_413E_761DF707A090",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C556623_1297_C959_41B0_E441ABE0ED90",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6D3CC_1290_4EEF_41AB_98F0E0BDE396_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D786E19_1290_3969_419C_7940704359D2",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D781E1A_1290_396B_41A3_EADCA0CA6DA8",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3083EAE7_12F0_3ED8_41A7_AAD5C3694D16_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA56F96_12B3_D77B_41B2_4B19FF4E1B92",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA5BF9C_12B3_D76F_4185_6A6FB05615A3",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5D22D_1290_C9A9_41A1_A97BDDC4313A_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D765E1C_1290_3968_419F_AC287E7568F9",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41D6FAA2_1290_D95B_4196_E6A25DCF36BA",
 "frameDuration": 58,
 "levels": [
  {
   "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_2_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41D66AA3_1290_D959_417F_7CF1CDE5C485",
 "frameDuration": 58,
 "levels": [
  {
   "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_3_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41D7FAA3_1290_D959_4185_92DBBFE75D80",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_30839447_12F0_49D8_41AC_8C0721666D72_0_HS_4_0.png",
   "width": 500,
   "class": "ImageResourceLevel",
   "height": 750
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08ACA257_12B1_C9F8_4194_0F9D79321156",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08A3025C_12B1_C9E8_417A_C2CDCDE52D5C",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A4C4A8_1290_4AA8_41AF_A376751855FA_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08A87255_12B1_C9F8_41A5_635AA257CDD9",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_074E00B8_12B0_4AA8_4173_7B6E2EAAC33E",
 "frameDuration": 90,
 "levels": [
  {
   "url": "media/panorama_18A81204_1290_C95F_4194_B964C3B3CFDA_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08A3725D_12B1_C9E8_41A3_449E56716ABD",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08A3C25D_12B1_C9E8_41A9_937DFA163B2D",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A4DFBC_1290_36AF_41B1_FC104F0AC485_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_41C0CAB0_1290_DEB8_41B0_F7F0A88945FD",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_2D6728D1_1293_DAF8_41B1_F62F074937EA_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3F30D234_1291_C9B8_4157_7D982889CC26",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_389D8AE3_1293_FED9_41AC_527C3346E1BB",
 "frameDuration": 71,
 "levels": [
  {
   "url": "media/panorama_30859936_12F0_FBBB_41AC_798CC35649DF_0_HS_3_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C41C8C2_1290_5AD8_41A0_975EED41BAF1",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6F40F_1290_4969_4160_424E39008604_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_005DE032_12B0_49BB_41B1_F15846207DA4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0039A5F4_12B3_CAB8_41A1_20D4E23775B1",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5A9CE_1290_FAE8_419B_F80ADC55A70D_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0F9D9D_12B0_5B69_41B2_056F790DF53F",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E4D9D_12B0_5B69_41A2_F61D262C318F",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082DF8A_12F0_3768_41A0_6E322770C7C9_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_074D50B8_12B0_4AA8_41B1_D3E5A2399F0D",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_074D10B8_12B0_4AA8_41A3_75FEF7874EF4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5F20B_1290_C968_419A_B9E845F2F936_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0843E74A_12B0_77EB_41AE_F7C1A5A72534",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0840474A_12B0_77EB_4193_F239F71F62C5",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A60A1F_1291_F969_41AA_1D09360C08BC_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D79FE1B_1290_3968_41B2_CBB5F3446CDA",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D79AE1B_1290_3968_41AD_199346D30F0A",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3080BB89_12F0_5F6B_4172_B5EADEC4394A_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA4DF96_12B3_D77B_41A5_ABC478DA5D54",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA51F96_12B3_D77B_41B0_66617EAEFD2E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A5F9E6_1290_DADB_41A5_DA9A9026CA46_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_30A1EE30_12F0_59B7_41A0_14415E0B0A54",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_0CB3324C_1290_49EF_4188_3E8F0E30A581_0_HS_0_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08435749_12B0_77E9_41A1_08FC87A4787A",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0843174A_12B0_77EB_41AE_AF93D03A2D6A",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A52116_1291_CB78_41A0_8E93673CAD77_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA18113_12F0_4B78_419B_17B338C0364B",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA11114_12F0_4B78_4198_80D8B2248931",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CCB3121_1290_4B59_4171_99013F043BA2_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0EFD9F_12B0_5B69_419E_501D05FAD792",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0E9D9F_12B0_5B69_417D_59B114EE5003",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308D48BB_12F3_FAA8_41A1_3BA585151A9D_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41C3FAAF_1290_DEA8_4188_5471F96FBFA0",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_1_HS_0_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_41C36AAF_1290_DEA8_41A1_547FC9B886F3",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_5ACE5AD9_1293_FEE8_41AF_CA9072A306D3_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA2E114_12F0_4B78_41B2_AA478DF7F5F5",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA2611A_12F0_4B6B_41AA_347DEDEC79A9",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CB36990_1290_7B77_4185_203A9F15A004_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA3F11A_12F0_4B6B_41AA_8758B50DB3F4",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3BA3A11B_12F0_4B69_4185_934A731DD5DC",
 "frameDuration": 90,
 "levels": [
  {
   "url": "media/panorama_0CB3220E_1290_4968_41A9_46E15F9C7E58_0_HS_1_0.png",
   "width": 300,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C46E8C0_1290_5AD8_4185_9186CB01054C",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4558C0_1290_5AD8_41A6_D35132D4136E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A602F8_1291_CEA8_41A4_71B848014EBD_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D7ABE16_1290_397B_41AA_F3ED653AC2A0",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D7B6E16_1290_397B_41AC_820502E3B670",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41D2EA9A_1290_D968_41B0_74B4036101A6",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_3080FA4A_12F0_D9EB_41B1_19E5EA5E74A6_0_HS_2_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0F7D9B_12B0_5B69_41A2_6041EA624EB0",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_2E0F2D9C_12B0_5B6F_41A7_C668C7505941",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_3082DE59_12F0_59E9_4194_1BB224F38023_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4468C1_1290_5AD8_4193_9DABF284EC5B",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4438C1_1290_5AD8_4196_1F88BFBFC3FB",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A663E7_1291_CED8_4164_BF7C6EC70A2E_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4048C3_1290_5AD8_418A_A1BE2F6FAE89",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A69C14_1290_597F_417E_32A8C40623F2_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_35CBF2B6_3E36_3820_41C7_4CBB764B5471",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_35CBA2B6_3E36_3820_41C5_5B49AB663CE1",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_582EBB64_1390_3FDF_41B1_6CEC45EBC475_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_59CADB0E_1290_5F6B_41AA_ED5D0B496755",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0563FFA2_12B0_575B_4185_5F25FF0C8BD6",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_59CA2B0E_1290_5F6B_4165_4C44E5EB352E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A7208B_1290_4969_41A8_E57FABE879D7_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08ADF257_12B1_C9F8_41B1_8FFAC4CA0918",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_08AC5257_12B1_C9F8_4180_9D7FFC4F7E64",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A7A2D1_1290_4EF9_4188_A3CAE5F4C1FF_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C43E8C2_1290_5AD8_41AC_1946095BDA21",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4248C2_1290_5AD8_418A_A9992866890F",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4228C2_1290_5AD8_418F_085DE64B3409",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6D3F5_1290_4EB9_41AC_0B95238444DB_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_59BDEB15_1290_5F78_419B_97C93D0FF68E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D7A2E15_1290_3979_41B1_F00ACF029C30",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 6,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_59BD3B16_1290_5F78_418F_638015787C1A",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_308391FC_12F0_CAA8_41A1_F9E70C1F3A76_0_HS_2_0.png",
   "width": 400,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4288C2_1290_5AD8_41A6_CAE7C06914D3",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4178C2_1290_5AD8_41AD_DFCCF29B8CCD",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A6DBC2_1290_5EDB_41B2_8F05270A1CED_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA21F9C_12B3_D76F_41A7_0F29AAD075ED",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0AA25F9C_12B3_D76F_41A0_08D8FCF3CCFD",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A59BBA_1290_3EA9_41B2_4DEA141BD24B_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3F303234_1291_C9B8_41AF_AC89D1E27D78",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3F304234_1291_C9B8_41A1_A7870072BEBC",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_30849067_12F0_C9D8_4191_8DBA15CEA405_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D7B0E18_1290_3977_41A5_5F8BB79265B7",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3D7BBE18_1290_3968_418D_E13B1CA414CA",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_308E628C_12F0_C96F_41B2_C85D6B49E504_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4518C0_1290_5AD8_419F_EFA9735A755E",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_0C4588C1_1290_5AD8_4193_D44E96121863",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
},
{
 "rowCount": 3,
 "frameCount": 9,
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_3F751430_12F3_C9B8_41A7_53EBB43B0F79",
 "frameDuration": 100,
 "levels": [
  {
   "url": "media/panorama_18A67B7E_1291_DFAB_41A8_E16F8F3FFB89_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ]
}],
 "width": "100%",
 "layout": "absolute"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
