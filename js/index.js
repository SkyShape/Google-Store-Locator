let map;
let nurmberg = {
    lat: 49.460983,
    lng: 11.061859
};
let infoWindow;
let markers=[];


function initMap() {  
    map = new google.maps.Map(document.getElementById("map"), {
    center: nurmberg,
    zoom: 11,
    });    
    infoWindow = new google.maps.InfoWindow();
};

const onEnter = (e) =>{
    if(e.key == "Enter") {
        getStores();
    }
}

const getStores = () => {
    const zipCode = document.getElementById('zip-code').value;
    zipCodeAlert(zipCode);
  
    const API_URL= 'http://localhost:3000/api/stores';
    const fullURL = `${API_URL}?zip_code=${zipCode}`;
    fetch(fullURL)
    .then((res) =>{
        if(res.status == 200) {
            return res.json();
        } else {
            throw new Error (res.status);
        }
        
    }).then((data)=>{
        if(data.length > 0 ) {
            clearLocation(); 
            searchLocationsNear(data);
            setStoresList(data);
            setOnClickListener();
        } else {
            clearLocation();
            noStoresFound();
        };
       
       
    })
};

const zipCodeAlert = (zipCode) => {
    if(!zipCode){
        return;
    }else if( !(zipCode.length == 5)){
        clearLocation();
        noStoresFound();
        return swal('Sorry, the Zip Code must to have just 5 characters!!!', 'Try 90048 !', 'error');
    }
}

const clearLocation = () => {
    infoWindow.close();
    for(let i = 0; i<markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

const noStoresFound = () => {
    const html = `
        <div class="no-stores-found">
            No Stores Found
        </div>
    `
    document.querySelector('.stores-list').innerHTML = html;
}

const setOnClickListener = () => {
    const storeElements = document.querySelectorAll('.store-container');  
    storeElements.forEach((elem, index)=>{
        elem.addEventListener('click', ()=>{
            google.maps.event.trigger(markers[index], 'click');            
        })
    })
};

const setStoresList = (stores) =>{
    let storesList = '';
    stores.forEach((store, index) =>{
        storesList +=`
        <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                            <span>${store.addressLines[0]}</span><br>
                            <span>${store.addressLines[1]}</span>
                        </div>
                        <div class="store-phone-number">
                            <img src="./style/img/34777.jpg" alt="">
                            <span>${store.phoneNumber}</span>
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            <span>${index + 1}</span>
                        </div>
                </div>
            </div>
        </div>
        `
    })
    document.querySelector('.stores-list').innerHTML = storesList;
}

const searchLocationsNear = (stores) => {
    let bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) =>{
        let latlng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0]
        );
        let name = store.storeName;
        let address = store.addressLines[0];
        let openStatusText = store.openStatusText;
        let phone = store.phoneNumber;
    
        bounds.extend(latlng);
    
        createMarker(latlng, name, address, openStatusText,phone, index+1);
    });
    map.fitBounds(bounds);
};




const createMarker = (latlng, name, address,openStatusText,phone, storeNumber) => {

    let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="icon">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <span>
                    ${address}
                </span>
            </div>
            <div class="store-info-phone">
                <div class="icon">
                    <i class="fas fa-phone-volume"></i>
                </div>
                <span>
                    <a href="tel:${phone}">${phone}</a>
                </span>
            </div>
        
        </div>
    `;
    const marker = new google.maps.Marker({
        position: latlng,
        map: map,
        label: `${storeNumber}`
      });
    
    google.maps.event.addListener(marker, 'click', function() {
        document.querySelector('.title').style.display = "none";
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
};