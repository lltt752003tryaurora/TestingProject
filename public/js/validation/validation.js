function checkInputRong(idInput, idNoti) {
    var valInput = document.getElementById(idInput).value;
    if (valInput == "") {
        document.getElementById(idNoti).innerHTML = "Please do not empty this field.";
        return false;
    } else {
        document.getElementById(idNoti).innerHTML = "";
        return true;
    }
}