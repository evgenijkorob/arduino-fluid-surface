const DeviceController = require('./device-controller');

let device = new DeviceController(
  '75638303237351B03151',
  9600
);

device
.on('data', console.log)
.on('close', function() {
  alert('Девайс отключён!');
})
.on('open', function() {
  alert('Девайс подключён!');
});

document.body.addEventListener('click', (ev) => {
  const actAttr = 'data-action';
  let target = ev.target.closest(`*[${actAttr}]`);
  if (!target) {
    return;
  }
  let action = target.getAttribute(actAttr);
  switch(action) {
    case 'connect':
      device.connect();
      break;
  }
});

class AppController {
  
}
