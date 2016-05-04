///realtime portion re-written by @MichelleSuh
var RT = RT || {};
RT.linked = false;
RT.channel = null;
RT.pusher = null;
RT.peerCom;

RT.link = function() {
  console.log("--------------into RT.link - "+RT.linked);
  // if ( !RT.linked ) {

    peerCom = new peerComm("localhost", "/peerServer", 9000, dataCallback);
    peerCom.initializePeer();
    console.log("initializing peerComm");

    //event listener from peers
    function dataCallback(data){
      if(data.type == 'client-ui-sync'){
        console.log('into client-ui-sync');
        var _old_2d_content = eval('_current_' + data.container + '_content');
        eval('var cont = '+data.rend+'.container');
        showLarge(jQuery(cont), _old_2d_content);

      }else if(data.type == 'client-camera-sync'){
        eval(data.target).camera.view = new Float32Array(data.value);

      }else if(data.type == 'client-volume-sync'){
        if (_data.volume.file.length == 0) {
          return;
        }

        volume[data.target] = data.value;

        // propagate back to UI
        jQuery("#yellow_slider").slider("option", "value", volume.indexLR);
        jQuery("#red_slider").slider("option", "value", volume.indexIS);
        jQuery("#green_slider").slider("option", "value", volume.indexPA);

        if (volume.volumeRendering) {
          jQuery('#slicing').removeClass('ui-state-active');
          jQuery('#volumerendering').addClass('ui-state-active');
          jQuery('#windowlevel-label').hide();
          jQuery('#windowlevel-volume').hide();
          jQuery('#opacity-label').show();
          jQuery('#opacity-volume').show();
        } else {
          jQuery('#slicing').addClass('ui-state-active');
          jQuery('#volumerendering').removeClass('ui-state-active');
          jQuery('#windowlevel-label').show();
          jQuery('#windowlevel-volume').show();
          jQuery('#opacity-label').hide();
          jQuery('#opacity-volume').hide();
        }

        jQuery('#opacity-volume').slider("option", "value", volume.opacity * 100);
        jQuery('#threshold-volume').dragslider("option", "values", [volume.lowerThreshold, volume.upperThreshold]);
        jQuery('#windowlevel-volume').dragslider("option", "values", [volume.windowLow, volume.windowHigh]);

        var bgColor = ((1 << 24) + (volume.minColor[0] * 255 << 16) +
            (volume.minColor[1] * 255 << 8) + volume.minColor[2] * 255)
            .toString(16).substr(1);

        var fgColor = ((1 << 24) + (volume.maxColor[0] * 255 << 16) +
            (volume.maxColor[1] * 255 << 8) + volume.maxColor[2] * 255)
            .toString(16).substr(1);

        jQuery('#bgColorVolume').miniColors("value", bgColor);
        jQuery('#fgColorVolume').miniColors("value", fgColor);

      }else if(data.type == 'client-labelmap-sync'){
        if (_data.labelmap.file.length == 0) {
          return;
        }

        volume.labelmap[data.target] = data.value;

        // propagate back to UI
        if (!volume.labelmap.visible) {
          $('#labelmapvisibility').removeClass('show-icon');
          $('#labelmapvisibility').addClass('hide-icon');
        } else {
          $('#labelmapvisibility').addClass('show-icon');
          $('#labelmapvisibility').removeClass('hide-icon');
        }
        jQuery('#opacity-labelmap').slider("option", "value", volume.labelmap.opacity * 100);

      }else if(data.type == 'client-mesh-sync'){
        if (_data.mesh.file.length == 0) {
          return;
        }

        mesh[data.target] = data.value;

        // propagate back to UI
        if (!mesh.visible) {
          $('#meshvisibility').removeClass('show-icon');
          $('#meshvisibility').addClass('hide-icon');
        } else {
          $('#meshvisibility').addClass('show-icon');
          $('#meshvisibility').removeClass('hide-icon');
        }
        jQuery('#opacity-mesh').slider("option", "value", mesh.opacity * 100);
        var meshColor = ((1 << 24) + (mesh.color[0] * 255 << 16) +
            (mesh.color[1] * 255 << 8) + mesh.color[2] * 255)
            .toString(16).substr(1);
        jQuery('#meshColor').miniColors("value", meshColor);

      }else if(data.type == 'client-scalars-sync'){
        if (_data.scalars.file.length == 0) {
          return;
        }

        mesh.scalars[data.target] = data.value;

        // propagate back to UI
        jQuery("#threshold-scalars").dragslider("option", "values",
            [mesh.scalars.lowerThreshold * 100, mesh.scalars.upperThreshold * 100]);

        var scalarsminColor = ((1 << 24) + (mesh.scalars.minColor[0] * 255 << 16) +
            (mesh.scalars.minColor[1] * 255 << 8) + mesh.scalars.minColor[2] * 255)
            .toString(16).substr(1);
        jQuery('#scalarsMinColor').miniColors("value", scalarsminColor);

        var scalarsmaxColor = ((1 << 24) + (mesh.scalars.maxColor[0] * 255 << 16) +
            (mesh.scalars.maxColor[1] * 255 << 8) + mesh.scalars.maxColor[2] * 255)
            .toString(16).substr(1);
        jQuery('#scalarsMaxColor').miniColors("value", scalarsmaxColor);

        
      }else if(data.type == 'client-fibers-sync'){
        if (_data.fibers.file.length == 0) {
          return;
        }

        fibers[data.target] = data.value;

        if (!fibers.visible) {
          $('#fibersvisibility').removeClass('show-icon');
          $('#fibersvisibility').addClass('hide-icon');
        } else {
          $('#fibersvisibility').addClass('show-icon');
          $('#fibersvisibility').removeClass('hide-icon');
        }

      }else if(data.type == 'client-fibersscalars-sync'){
        if (_data.fibers.file.length == 0) {
          return;
        }

        fibers.scalars[data.target] = data.value;
        jQuery('#threshold-fibers').dragslider("option", "values", [fibers.scalars.lowerThreshold, fibers.scalars.upperThreshold]);

      }
    }

    RT._updater = 1;
    RT._updater2 = 1;
    RT._old_view = [ 1 ];

    // we are online
    RT.linked = true;

    // switch to the blue icon
    $('#linklogo').hide();
    $('#linkselectedlogo').show();

  // } else {
    // console.log("into RT.linked==true");
    // RT.pusher.unsubscribe(RT.channel);

    // RT.linked = false;

    // switch to the gray icon
    // $('#linkselectedlogo').hide();
    // $('#linklogo').show();
  // }
};

RT.pushCamera = function(renderer) {

  var _current_view = Array.apply([], eval(renderer).camera.view);

  if ( !arraysEqual(_current_view, RT._old_view) ) {

    peerCom.sendToPeers({
      type: 'client-camera-sync',
      'target' : renderer,
      'value' : _current_view
    });

    RT._old_view = _current_view;
  }

};

RT.pushVolume = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-volume-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushLabelmap = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-labelmap-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushMesh = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-mesh-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushScalars = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-scalars-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushFibers = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-fibers-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushFibersScalars = function(target, value) {
  peerCom.sendToPeers({
    type: 'client-fibersscalars-sync',
    'target' : target,
    'value' : value
  });
};

RT.pushUI = function(rend, container) {
  peerCom.sendToPeers({
    type: 'client-ui-sync',
    'rend' : rend,
    'container' : container
  });
};

// compare two arrays
function arraysEqual(arr1, arr2) {

  if ( arr1.length !== arr2.length ) {
    return false;
  }
  for ( var i = arr1.length; i--;) {
    if ( arr1[i] !== arr2[i] ) {
      return false;
    }
  }

  return true;
}
