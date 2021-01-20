var node = [];
var markersArray = [];
async function initMap() 
{
    map = await new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: { lat: 14.0367, lng: 100.728958 },
    });
    getnode();
}

async function getnode()
{
  node = [];
  await fetch("https://fierce-harbor-59590.herokuapp.com/api")
  .then(res => res.json())
  .then(e => e.map(({lat,lng,nameNode,status})=>({lat,lng,nameNode,status})))
  .then(e => e.map(e => (node.push(e))))
  console.log(node);
  checknode();
}

function checknode()
{
  for (let i=0;i<node.length;i++)
  {
    if(node[i].status)
    {
      addOnMarker(node[i],i);
    }
    else
    {
      addOffMarker(node[i],i);
    }
    const infowindow = new google.maps.InfoWindow({
      content: "<h7>"+node[i].nameNode.toString()+"<br>"+"lat,lng"+node[i].lat.toString()+node[i].lng.toString()+"</h7>",
    });
    markersArray[i].addListener("click", function() 
    {
      infowindow.open(map, markersArray[i]);
    });
  }
  var t = document.getElementById("timestamp");
  t.innerHTML = ""
  t.innerHTML = "Last Checked : " + Date();
  document.getElementById("main").appendChild(t);
}

function addOffMarker(position,order)
{
  markersArray[order] = new google.maps.Marker({
    position: position,
    map,
    draggable: false,
    animation: google.maps.Animation.DROP,
  })
  
}

function addOnMarker(position,order)
{
  markersArray[order] = new google.maps.Marker({
    position: position,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
}

function clearMap()
{
  for(let i=0;i<node.length;i++)
  {
    markersArray[i].setMap(null);
  }
  getnode();
}

async function openForm() 
{
  closeTime();
  document.getElementById("popup").style.display = "block";
  timein = document.getElementById("tbTimeInterval");
  pack = document.getElementById("tbPackage");
  await fetch("https://fierce-harbor-59590.herokuapp.com/setting")
  .then(res=>res.json())
  .then(function(data)
  {
    timein.value = data["time"];
    pack.value = data["package"];
  })
  document.getElementById("btSetTime").setAttribute("onclick","closeForm()");
}

function closeForm() 
{
  document.getElementById("popup").style.display = "none";
  document.getElementById("btSetTime").setAttribute("onclick","openForm()");
}

async function postdata(url='',data = {})
{
  const response = await fetch(url,
  {
    method: "POST",
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body:JSON.stringify(data)
          
  });
  return response
}

async function setTime()
{
  if((timein.value != null) && (pack.value != null) && (Number.isInteger(parseInt(timein.value))) && (Number.isInteger(parseInt(pack.value))))
  {
    await postdata("https://fierce-harbor-59590.herokuapp.com/setting",{"timeinterval":parseInt(timein.value),"package":parseInt(pack.value)});
    alert("Complete");
    closeForm();
  }
  else
  {
    alert("Please Enter Number");
  }
}

async function changeNoti()
{
  noti = document.getElementById("cbNoti");
  if(noti.checked)
  {
    await fetch("https://fierce-harbor-59590.herokuapp.com/enablenotify");
    console.log("1");
  }
  else
  {
    await fetch("https://fierce-harbor-59590.herokuapp.com/disablenotify")
    console.log("0");
  }
}
async function openTime() 
{
  closeForm();
  document.getElementById("popuptime").style.display = "block";
  await fetch("https://fierce-harbor-59590.herokuapp.com/statusnotify")
    .then(res=>res.json())
    .then(function(data)
    {
      notibox=document.getElementById("cbNoti");
      if(data["notify"]==0)
      {
        notibox.checked=false;
      }
      else
      {
        notibox.checked=true;
      }
      notibox.setAttribute("onchange","changeNoti()");
    })
  document.getElementById("btNoti").setAttribute("onclick","closeTime()");
}

function closeTime() 
{
  document.getElementById("popuptime").style.display = "none";
  document.getElementById("btNoti").setAttribute("onclick","openTime()");
}