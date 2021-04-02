let map;
let nurmberg = {
    lat: 49.460983,
    lng: 11.061859
};
let infoWindow;


function initMap() {
    
    map = new google.maps.Map(document.getElementById("map"), {
    center: nurmberg,
    zoom: 10,
    });
    
    infoWindow = new google.maps.InfoWindow();
    
    getStores();   
};

const getStores = () => {
    const API_URL= 'http://localhost:3000/api/stores';
    fetch(API_URL)
    .then((res) =>{
        if(res.status == 200) {
            return res.json();
        } else {
            throw new Error (res.status);
        }
    }).then((data)=>{
        searchLocationsNear(data);
        setStoresList(data);
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
        `;
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
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    })
};