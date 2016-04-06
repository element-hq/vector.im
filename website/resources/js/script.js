var perspectives = [ {
      id: 'x',
      name: 'Valerie',
      avatar: 'x.jpg',
      type: 'mobile',
      device: document.getElementById( 'canvas-x' ),
    },
    {
      id: 'y',
      name: 'Stephi',
      avatar: 'y.jpg',
      type: 'laptop',
      device: document.getElementById( 'canvas-y' ),
    },
    {
      id: 'z',
      name: 'Rob',
      avatar: 'z.jpg',
      type: 'tablet',
      device: document.getElementById( 'canvas-z' ),
    } ];

var script = [{
      perspective: 'x',
      action: 'post',
      to: [ 'y', 'z' ],
      value: 'Hi, anyone here?',
      pause: 2000
    }, {
      perspective: 'y',
      action: 'post',
      value: 'Yep, I\'m here. How you doing?',
      pause: 3000
    }, {
      perspective: 'x',
      action: 'post',
      value: 'Yeah, doing well. And you?',
      pause: 1500
    }, {
      perspective: 'x',
      action: 'post',
      value: 'Have you got that file I was after?',
      pause: 1500
    }, {
      perspective: 'y',
      action: 'post',
      value: 'Yep, let me dig it out…',
      pause: 2000
    }, {
      perspective: 'y',
      action: 'upload',
      value: 'vector-logo.png',
      icon: 'vector-logo.png',
      pause: 3000
    }, {
      perspective: 'x',
      action: 'post',
      value: 'Thanks!',
      pause: 1000
    }, {
      perspective: 'y',
      action: 'post',
      value: 'Do you want to talk through it quickly?',
      pause: 2000
    }, {
      perspective: 'x',
      action: 'post',
      value: 'Yeah, should we pull ' + perspectives[ 2 ].name + ' in?',
      pause: 1000
    }, {
      perspective: 'y',
      action: 'post',
      type: 'system',
      value: perspectives[ 1 ].name + ' added ' + perspectives[ 2 ].name + ' to the conversation',
      pause: 1000
    }, {
      perspective: 'z',
      action: 'post',
      value: 'Hey all, what\'s up?',
      pause: 2000
    }, {
      perspective: 'x',
      action: 'post',
      value: 'Just wanted to look at this file. Do you have time for quick call?',
      pause: 3000
    }, {
      perspective: 'z',
      action: 'post',
      value: 'Sure, hit me.',
      pause: 2000
    }, {
      perspective: 'y',
      action: 'call',
      pause: 500
    }, {
      action: 'finish'
    }];

