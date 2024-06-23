function TestCase() {
    this.txtName = '';
    this.txtDes = '';
    this.txtType = '';
    this.txtDate = '';
    this.txtHour = 0;
    this.txtCost = 0;
}

var arrTestCase = []

var arrInput = [
    "txtName", "txtHour", "txtDes", "txtType", "txtDate", "txtCost"
]

var arrNoti = [
    "notiName", "notiHour", "notiDes", "notiType", "notiDate", "notiCost"
]

function addTestCase() {
    event.preventDefault();
    var tc = new TestCase();
    var valid = true;
    for (var i = 0; i < arrInput.length; i++) {
        valid &= checkInputRong(arrInput[i], arrNoti[i]);
        var value = document.getElementById(arrInput[i]).value;
        tc[arrInput[i]] = value;
    }

    if (valid == true) {
        arrTestCase.push(tc);
        renderTestCase();
        document.getElementById("formTestCase").reset();
        saveLocal();
    }
}

document.getElementById("btnAddTest").onclick = addTestCase;

function renderTestCase() {
    var content = "";
    for (var i = 0; i < arrTestCase.length; i++) {
        var testCase = arrTestCase[i];
        var newTestCase = new TestCase();
        Object.assign(newTestCase, testCase);
        content += `
      <tr>
        <td>${newTestCase.txtName}</td>
        <td>${newTestCase.txtType}</td>
        <td>${newTestCase.txtDes}</td>
        <td>${newTestCase.txtHour}</td>
        <td>${newTestCase.txtDate}</td>
        <td>${newTestCase.txtCost}</td>
      </tr>
      `;
    }
    document.getElementById("tbodyTestCase").innerHTML = content;
}

function saveLocal() {
    localStorage.setItem("arrTestCase", JSON.stringify(arrTestCase));
}

function getLocalToDisplay() {
    var data = localStorage.getItem("arrTestCase");
    if (data != null) {
        arrTestCase = JSON.parse(data);
        renderTestCase();
    }
}

//để ở ngoài do khi user bấm reload lại trang thì ta cần phải lấy dữ liệu đã được lưu ở localStorage lên lại để hiển thị user (tránh bị mất data)
getLocalToDisplay();
