// Experiment 1E BLE UUIDs retained. Final protocol: F,<16 comma-separated angles>\n
const serviceUuid='6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const txCharacteristic='6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const rxCharacteristic='6e400003-b5a3-f393-e0a9-e50e24dcca9e';
let myBLE,myCharacteristicTx,myCharacteristicRx,connectButton;
let bleConnected=false,bleBusy=false,pendingFrame=null;
function bleSetup(){myBLE=new p5ble();connectButton=createButton('Connect BLE');connectButton.id('connectBLE');connectButton.mousePressed(()=>myBLE.connect(serviceUuid,gotCharacteristics));}
function gotCharacteristics(error,chars){if(error){console.error(error);return;}for(const ch of chars){const id=ch.uuid.toLowerCase();if(id===txCharacteristic)myCharacteristicTx=ch;if(id===rxCharacteristic)myCharacteristicRx=ch;}bleConnected=!!myCharacteristicTx;if(bleConnected){connectButton.html('BLE Connected');connectButton.addClass('connected');}}
function sendAngles(angles){if(!bleConnected||!myCharacteristicTx)return;pendingFrame='F,'+angles.map(v=>Math.round(v)).join(',')+'\n';flushFrame();}
function flushFrame(){if(bleBusy||!pendingFrame||!bleConnected)return;const msg=pendingFrame;pendingFrame=null;bleBusy=true;try{const result=myBLE.write(myCharacteristicTx,msg);Promise.resolve(result).then(()=>{bleBusy=false;flushFrame();}).catch(e=>{console.error(e);bleBusy=false;});}catch(e){console.error(e);bleBusy=false;}}
function sendResetCommand(){sendAngles(Array(16).fill(90));}
