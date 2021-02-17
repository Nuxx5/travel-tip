'use strict';

export const utilService = {
    saveToStorage,
    loadFromStorage
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadFromStorage(key) {
    var value = localStorage.getItem(key);
    return JSON.parse(value);
}

// function clearStorage(key) {
//     localStorage.removeItem(key);
// }
