const TRAY = document.getElementById('js-tray-slide');
const swatches = document.querySelectorAll(".tray__swatch");
const DRAG_NOTICE = document.getElementById('js-drag-notice');

var theModel;

const MODEL_PATH = "threejsmodel3.glb";

const colors = [
    {
      color: '131417' },
    
    {
      color: '374047' },
    
    {
      color: '5f6e78' },
    
    {
      color: '7f8a93' },
    
    {
      color: '97a1a7' },
    
    {
      color: 'acb4b9' },
    
    {
      color: 'DF9998' },
    
    {
      color: '7C6862' },
    
    {
      color: 'A3AB84' },
    
    {
      color: 'D6CCB1' },
    
    {
      color: 'F8D5C4' },
    
    {
      color: 'A3AE99' },
    
    {
      color: 'EFF2F2' },
    
    {
      color: 'B0C5C1' },
    
    {
      color: '8B8C8C' },
    
    {
      color: '565F59' },
    
    {
      color: 'CB304A' },
    
    {
      color: 'FED7C8' },
    
    {
      color: 'C7BDBD' },
    
    {
      color: '3DCBBE' },
    
    {
      color: '264B4F' },
    
    {
      color: '389389' },
    
    {
      color: '85BEAE' },
    
    {
      color: 'F2DABA' },
    
    {
      color: 'F2A97F' },
    
    {
      color: 'D85F52' },
    
    {
      color: 'D92E37' },
    
    {
      color: 'FC9736' },
    
    {
      color: 'F7BD69' },
    
    {
      color: 'A4D09C' },
    
    {
      color: '4C8A67' },
    
    {
      color: '25608A' },
    
    {
      color: '75C8C6' },
    
    {
      color: 'F5E4B7' },
    
    {
      color: 'E69041' },
    
    {
      color: 'E56013' },
      
    {
      color: '11101D' },
      
    {
      color: '630609' },
      
    {
      color: 'C9240E' },
      
    {
      color: 'EC4B17' },
      
    {
      color: '281A1C' },
      
    {
      color: '4F556F' },
      
    {
      color: '64739B' },
      
    {
      color: 'CDBAC7' },
      
    {
      color: '946F43' },
      
    {
      color: '66533C' },
      
    {
      color: '173A2F' },
      
    {
      color: '153944' },
      
    {
      color: '27548D' },
      
    {
      color: '438AAC' }];

// Function - Build Colors
function buildColors(colors) {
    for (let [i, color] of colors.entries()) {
      let swatch = document.createElement('div');
      swatch.classList.add('tray__swatch');
  
      if (color.texture)
      {
        swatch.style.backgroundImage = "url(" + color.texture + ")";
      } else
      {
        swatch.style.background = "#" + color.color;
      }
  
      swatch.setAttribute('data-key', i);
      TRAY.append(swatch);
    }
  }
  
  buildColors(colors);

// Swatches
for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {

    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10 });

  } else

  {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10 });


  }

  setMaterial(mesh, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}

// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    mesh.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}

var slider = document.getElementById('js-tray'),sliderItems = document.getElementById('js-tray-slide'),difference;

function slide(wrapper, items) {
  var posX1 = 0,
  posX2 = 0,
  posInitial,
  threshold = 20,
  posFinal,
  slides = items.getElementsByClassName('tray__swatch');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {

    } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = posInitial + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);