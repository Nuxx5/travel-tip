'use strict';

import { storageService } from './storage-service.js';
import { utilService } from './util-service.js';

export const mapService = {
    getLocs,
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
