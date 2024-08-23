$(document).ready(init);


function displayData() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 21|| hour <= 4) {
        $("body").attr("style", "background: linear-gradient(to bottom, #000033 10%, #444466 100%) !important;");
    }

}

function init() {
    displayData();
}
(function() {
    console.log("hellya");
});