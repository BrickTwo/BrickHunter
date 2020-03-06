$(document).ready(function () {
    localStorage.removeItem('colors-table:/home.html.kt:::filters');

    $(function () {
        $("#dialogCountry").dialog({
        //    $("#dialogProgress").dialog({
            dialogClass: "no-close",
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false
        });

    });

    $("#country").on("click", function (event, ui) {
        $("#dialogCountry").dialog("close");
        $("#dialogWantedList").dialog({
            dialogClass: "no-close",
            modal: true,
            closeOnEscape: false,
            draggable: false,
            resizable: false
        });        
    });

    document.getElementById('upload').addEventListener('change', handleFileSelect, false);

    document.getElementById('ageCountry').addEventListener('click', startLoadPrice);
    $("#ageCountry").on("click", function (event, ui) {
        $("#dialogSteineTeile").dialog("close");
        //startLoadPrice();
    });
});