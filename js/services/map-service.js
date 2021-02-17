'use strict';

import { storageService } from './storage-service.js';
import { utilService } from './util-service.js';

export const mapService = {
    getLocs,
    search,
    addPlace,
    removePlace,
    getPlaces,
    getPlaceById,
    _createPlaces,
    _createPlace,
    _savePlacesToStorage
}

var gPlaces = [];
var locs = [{ lat: 133.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function search(txt) {

    const API_KEY = 'AIzaSyBKNzA6QOseiFzbYwYbN2GTcWylPtUsdfQ';

    https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address='${txt}'&key=${API_KEY}`)
        .then(res => {
            res.results
            console.log('res.results', res)
        })
        // .then(ytVideos => ytVideos.map(ytVideo => ({
        //     id: ytVideo.id.videoId,
        //     title: ytVideo.snippet.title,
        //     img: {
        //         url: ytVideo.snippet.thumbnails.default.url,
        //         width: ytVideo.snippet.thumbnails.default.width,
        //         height: ytVideo.snippet.thumbnails.default.height,
        //     }
        // })))
        // .then(videos => {
        //     termVideosMap[term] = videos;
        //     utilService.saveToStorage(KEY, termVideosMap)
        //     return videos;
        // })

}

function addPlace(lat, lng, locationName) {
    var place = _createPlace(lat, lng, locationName);
    gPlaces.unshift(place);

    _savePlacesToStorage();
}

function removePlace(placeId) {
    var placeIdx = gPlaces.findIndex(function (place) {
        return (placeId === place.id);
    })
    if (placeIdx === -1) return;
    gPlaces.splice(placeIdx, 1);
    _savePlacesToStorage();
}

function getPlaces() {
    return gPlaces;
}

function getPlaceById(placeId) {
    var place = gPlaces.find(function (place) {
        return (placeId === place.id);
    })
    return place;
}

function _createPlaces() {
    const STORAGE_KEY = 'places';
    var places = storageService.loadFromStorage(STORAGE_KEY);
    if (!places || !places.length) {
        places = [];
    }
    gPlaces = places;
    _savePlacesToStorage();
}

function _createPlace(lat, lng, locationName) {
    return {
        id: utilService.makeId(),
        lat: lat,
        lng: lng,
        name: locationName,
    }
}

function _savePlacesToStorage() {
    const STORAGE_KEY = 'places';
    storageService.saveToStorage(STORAGE_KEY, gPlaces);
}
