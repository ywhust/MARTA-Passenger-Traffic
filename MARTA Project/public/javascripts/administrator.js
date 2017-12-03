$(document).ready(function () {

    $('#SM').on('click', () => {
        window.location.href = '/stationsListing.html';
    })

    $('#SC').on('click', () => {
        window.location.href = '/suspendedCards.html';
    })

    $('#BCM').on('click', () => {
        window.location.href = '/breezecard.html';
    })

    $('#PFR').on('click', () => {
        window.location.href = '/flowReport.html';
    })

    $('#logout').on('click', () => {
        console.log(1);
        window.location.href = '/';
    });

});
