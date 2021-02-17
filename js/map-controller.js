'use strict';

import { mapService } from './services/map-service.js';

// window.onSearch = onSearch;
window.onGoToPlace = onGoToPlace;
window.onRemovePlace = onRemovePlace;
window.onShowMyLocation = onShowMyLocation;

var gMap;
console.log('Main!');


mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })

    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
    mapService._createPlaces();
    renderPlaces();
}

function renderPlaces() {
    var places = mapService.getPlaces();
    console.log('places', places);
    var strHTMLs = places.map(function (place) {
        return `<tr>
                    <td>${places.indexOf(place) + 1}</td>
                    <td>${place.name}</td>
                    <td>${place.lat.toFixed(6)}</td>
                    <td>${place.lng.toFixed(6)}</td>
                    <td><button type="button" class="goto-btn" onclick="onGoToPlace('${place.id}')">Go To</button></td>
                    <td><button type="button" class="dalete-btn" onclick="onRemovePlace('${place.id}')">Delete</button></td>
                </tr>`;
    })
    var elBoard = document.querySelector('.table-data');
    elBoard.innerHTML = strHTMLs.join('');
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function onRemovePlace(placeId) {
    mapService.removePlace(placeId);
    renderPlaces();
}

function onGoToPlace(placeId) {
    var place = mapService.getPlaceById(placeId)
    initMap(place.lat, place.lng);
}

function onShowMyLocation(){
    if (!navigator.geolocation) {
        alert("HTML5 Geolocation is not supported in your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(onShowLocation, onHandleLocationError);
}

function onShowLocation(position) {
    initMap(position.coords.latitude, position.coords.longitude);
}

function onHandleLocationError(error) {
    var locationError = document.getElementById("locationError");
    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyBKNzA6QOseiFzbYwYbN2GTcWylPtUsdfQ'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



