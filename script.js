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
      content: "<h7>"+node[i].nameNode.toString()+"<br>"+"lat,lng"+node[i].lat.toString()+","+node[i].lng.toString()+"</h7>",
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
    icon: "https://www.img.in.th/images/ef56d54d4111bb8e9a9d12df78c48b8e.png"
  })
  
}

function addOnMarker(position,order)
{
  markersArray[order] = new google.maps.Marker({
    position: position,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    icon: 'https://www.img.in.th/images/e461f9fb1a861216a7bfdb7e5cd977df.png'
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
  closeFormNode();
  document.getElementById("popup").style.display = "block";
  timein = document.getElementById("tbTimeInterval");
  pack = document.getElementById("tbPackage");
  setmail = document.getElementById("tbEmail");
  linetoken = document.getElementById("tbLineToken")
  await fetch("https://fierce-harbor-59590.herokuapp.com/setting")
  .then(res=>res.json())
  .then(function(data)
  {
    timein.value = data["time"];
    pack.value = data["package"];
  })
  await fetch("https://fierce-harbor-59590.herokuapp.com/settingstatus")
    .then(res=>res.json())
    .then(function(data)
    {
      notibox=document.getElementById("cbNoti");
      if(data["statusNotify"]==0)
      {
        notibox.checked=false;
      }
      else
      {
        notibox.checked=true;
      }
      setmail.value = data["setEmail"];
      linetoken.value = data["setTokenLine"];
      notibox.setAttribute("onchange","changeNoti()");

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
    if(setmail.value != null)
    {
      setEmail();
      if(linetoken.value != null)
      {
        setLine();
        closeForm();
      }
      else
      {
        alert("Please Enter Line Token")
      }
    }
    else
    {
      alert("Please Enter Email");
    }
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


async function setEmail()
{
  await postdata("https://fierce-harbor-59590.herokuapp.com/setEmail",{"setEmail":document.getElementById("tbEmail").value});
}

function openFormNode() 
{
  closeForm();
  document.getElementById("popup-node").style.display = "block";
  document.getElementById("btReset").setAttribute("onclick","closeFormNode()");
}

function closeFormNode() 
{
  document.getElementById("popup-node").style.display = "none";
  document.getElementById("btReset").setAttribute("onclick","openFormNode()");
}

async function resetdevice()
{
  node = document.getElementById("tbNode");
  if(node.value!="")
  {
    if(Number.isInteger(parseInt(node.value)))
    {
      await postdata("https://fierce-harbor-59590.herokuapp.com/resetnode",{"node":node.value});
      alert("Device is reseting");
      closeFormNode();
    }
    else
    {
      alert("Only Integer Number is allow");
    }
  }
  else
  {
    alert("Please Enter Node Number");
  }
}
async function setLine()
{
  await postdata("https://fierce-harbor-59590.herokuapp.com/setTokenLine",{"setLineToken":document.getElementById("tbLineToken").value});
  alert("Setting Complete");
}
