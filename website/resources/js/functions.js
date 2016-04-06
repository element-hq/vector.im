var ANIMATE_DEVICE_TIME = 1500,
    currentSendTimeout, currentReceiveTimeout;

_.each( perspectives, function( perspective ) {
  _.extend( perspective, {
    header: perspective.device.getElementsByClassName( 'header' )[ 0 ],
    messages: perspective.device.getElementsByClassName( 'messages' )[ 0 ],
    footer: perspective.device.getElementsByClassName( 'footer' )[ 0 ]
  } )
} );

var fadeInContent = function( delay ) {
  var canvases = document.getElementsByClassName( 'canvas' );
  Velocity( canvases, { opacity: 1 }, { duration: 1000, delay: delay, complete: function() {
    writeStep( 0 );
  } } );
}

/**
 * Write each step in our script
 */
var writeStep = function( i ) {
  var currentStep = script[ i ],
      nextStep = i + 1;

  if ( !currentStep ) {
    return;
  }

  var currentPerspective = _.find( perspectives, function( perspective ) {
        return perspective.id === currentStep.perspective;
      } );

  if ( currentSendTimeout ) {
    window.clearTimeout( currentSendTimeout );
  }

  if ( currentReceiveTimeout ) {
    window.clearTimeout( currentReceiveTimeout );
  }

  // Perform the action
  switch( currentStep.action ) {
    case 'post':
      send( currentPerspective, currentStep, i );
      break;
    case 'upload':
      upload( currentPerspective, currentStep, i );
      break;
    case 'call':
      call( currentPerspective, currentStep, i );
      break;
    default:
      console.log( 'No action' );
  }

  // Set timer for the next action
  currentSendTimeout = window.setTimeout( writeStep, currentStep.pause, nextStep );
};

/**
 * Send a message
 */
var send = function( sender, currentStep ) {
  var message = currentStep.value;

  // Show the message in sender's window first
  // TODO: Animate typing
  sendToReceivers( sender, [ sender ], currentStep );

  // Then show on the other perspectives
  var recipients = _.without( perspectives, sender );
  currentReceiveTimeout = window.setTimeout( sendToReceivers, 500, sender, recipients, currentStep );
};

/**
 * Send a message to individual recipients
 */
var sendToReceivers = function( sender, recipients, currentStep ) {
  var message = currentStep.value,
      attachment = currentStep.attachment;

  _.each( recipients, function( perspective ) {
    // Create component
    var component = create( 'div', { className: 'component' } );

    // Create content
    var content = create( 'div', { className: 'content' } );
    var user = create( 'p', { className: 'user', textContent: sender.name } );
    var text = create( 'p', { className: 'message', textContent: message } );
    if ( currentStep.type ) {
      text.className += ' ' + currentStep.type;
    }
    append( content, [ user, text ] );

    // Create attachment if necessary
    if ( attachment ) {
      var file = create( 'div', { className: 'file' } );
      file.style.backgroundImage = 'url( resources/images/' + attachment + ')';
      // Append attachment
      append( content, [ file ] );
    }

    // Create avatar
    var avatar = create( 'img', { className: 'avatar', src: 'resources/images/' + sender.avatar } );
    append( component, [ avatar, content ] );

    // Append message to stream
    append( perspective.messages, [ component ] );
    Velocity( component, { opacity: 1 }, 500 );
  } );
};

/**
 * Upload a file
 */
var upload = function( sender, currentStep, i ) {
  var time = currentStep.pause,
      DRAG_TIME = time / 4,
      UPLOAD_TIME = time / 2,
      FADE_TIME = 100;

  // Create file to upload
  var upload = create( 'div', { id: 'upload', className: 'upload' } );

  // Create content for file upload
  var text = create( 'p', { className: 'filename', textContent: currentStep.value } );
  var image = create( 'img', { className: 'icon', src: 'resources/images/' + currentStep.icon } );
  append( upload, [ image, text ] );

  // "Drag in" the file to upload
  append( sender.device, [ upload ] );

  // Show dropzone
  var dropzone = document.getElementById( 'dropzone' );

  // Create progress bar
  var progressSection = create( 'section', { className: 'progress-section' } );

  var uploadIconWrapper = create( 'div', { className: 'upload-icon-wrapper' } );
  var uploadIcon = create( 'img', { className: 'upload-icon', src: 'resources/images/icon-upload-grey.png' } );
  append( uploadIconWrapper, [ uploadIcon ] );

  var cancelIconWrapper = create( 'div', { className: 'cancel-icon-wrapper' } );
  var cancelIcon = create( 'img', { className: 'cancel-icon', src: 'resources/images/icon-cancel.png' } );
  append( cancelIconWrapper, [ cancelIcon ] );

  var progressBarWrapper = create( 'div', { className: 'progress-bar-wrapper' } );
  var progressFilename = create( 'p', { className: 'progress-filename system', textContent: 'Uploading ' + currentStep.value } );
  var progressBar = create( 'div', { className: 'progress-bar' } );
  var progress = create( 'div', { className: 'progress' } );
  append( progressBarWrapper, [ progressBar, progress, progressFilename ] );

  // Append elements to progress section
  append( progressSection, [ uploadIconWrapper, progressBarWrapper, cancelIconWrapper ] );
  append( sender.device, [ progressSection ] );

  // Animate all the things
  Velocity( dropzone, 'fadeIn', { display: 'flex', duration: FADE_TIME } );
  Velocity( dropzone, 'fadeOut', { delay: DRAG_TIME + 2 * FADE_TIME, duration: FADE_TIME } );

  Velocity( upload, { translateX: '50%', translateY: '61%' }, { easing: 'swing', duration: DRAG_TIME/2 } );
  Velocity( upload, { translateX: '53%', translateY: '59%' }, { easing: 'swing', duration: DRAG_TIME/2 } );
  Velocity( upload, "fadeOut", { duration: FADE_TIME } ); // ?

  Velocity( progressSection, { opacity: 1, translateY: 0 }, { display: 'flex', delay: DRAG_TIME + 2 * FADE_TIME, duration: FADE_TIME } );
  Velocity( progressSection, { opacity: 0, translateY: '100%' }, { display: 'flex', delay: UPLOAD_TIME, duration: FADE_TIME } );

  Velocity( progress, { width: '30%' }, { delay: DRAG_TIME + 2 * FADE_TIME, duration: UPLOAD_TIME/4 } );
  Velocity( progress, { width: '80%' }, { duration: UPLOAD_TIME/4*2 } );
  Velocity( progress, { width: '100%' }, { duration: UPLOAD_TIME/4 } );

  // Insert a new message in queue
  script.splice( i + 1, 0, {
    perspective: sender.id,
    action: 'post',
    value: sender.name + ' uploaded ' + currentStep.value,
    type: 'system',
    attachment: currentStep.icon,
    pause: 2000
  } );
};

/**
 * Call someone
 */
var call = function( sender, currentStep, i ) {
  // Add big pic of recipients
  // Add small pic of sender
  // Add class for device type
  // Show 'calling' animation
  // Remove 'calling' animation
  // Finish…

  var videoSection = create( 'div', { id: 'video-section' } );
  var videoSender = create( 'div', { className: 'video-sender' } );
  videoSender.style.backgroundImage = 'url( resources/images/' + sender.id + '.jpg';
  append( videoSection, [ videoSender ] );

  var recipients = _.without( perspectives, sender );
  _.each( recipients, function( perspective ) {
    var videoRecipient = create( 'div', { className: 'video-recipient' } );
    videoRecipient.style.backgroundImage = 'url( resources/images/' + perspective.id + '.jpg';
    append( videoSection, [ videoRecipient ] );
  } );

  append( sender.device, [ videoSection ] );

  // Insert a new message in queue
  script.splice( i + 1, 0, {
    perspective: sender.id,
    action: 'post',
    value: sender.name + ' calling ' + _.pluck( recipients, 'name' ).join( ', ' ) + '…',
    type: 'system',
    pause: 2000
  } );

//   sendToReceivers( sender, [ sender ], currentStep );

//   // Then show on the other perspectives
//   var recipients = _.without( perspectives, sender );
//   currentReceiveTimeout = window.setTimeout( sendToReceivers, 500, sender, recipients, currentStep );
};

/**
 * Call individual recipients
 */
var callReceivers = function( sender, recipients, currentStep ) {

};

/**
 * Helper function to create dom elements
 */
var create = function( type, params ) {
  var el = document.createElement( type );
  return _.extend( el, params );
};

/**
 * Helper function to append elements
 */
var append = function( parent, elements ) {
  _.each( elements, function( element ) {
    parent.appendChild( element );
  } );
};

// Animate laptop drawing
var animateLaptop = function() {
  // Get paths and convert HTMLCollection to array
  var paths = document.querySelectorAll( 'path' ),
      time = ANIMATE_DEVICE_TIME / 1000,
      path,
      pathLength;

  Velocity( paths, { fillOpacity: 1 }, { duration: 1000, delay: ANIMATE_DEVICE_TIME/8*7 } );
  for ( var i=0; i<paths.length; i++ ) {
    path = paths[ i ];
    pathLength = path.getTotalLength();

    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = 'none';

    // Set up the starting positions
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();

    path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + time + 's ease-in';

    // Go!
    path.style.strokeDashoffset = '0';
  }
}


// Start…
animateLaptop();
fadeInContent( ANIMATE_DEVICE_TIME );