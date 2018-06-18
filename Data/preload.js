(function (doc) {
    "use strict";
    var iconPath = "Data/Icon";
    var extensionName = "png";
    var iconFileName = ["Sword", "Lance", "Axe", "RedBow", "BlueBow", "GreenBow", "Bow", "Dagger", "RedTome", "BlueTome", "GreenTome", "Staff", "RedBreath", "BlueBreath", "GreenBreath", "ColorlessBreath"];
    var length = iconFileName.length;
    var i = 0;
    var div1 = doc.createElement("div");
    var div2 = doc.createElement("div");
    var preload = function loadImg() {
        var img = doc.createElement("img");
        img.src = iconPath + "/" + iconFileName[i] + "." + extensionName;
        img.alt = iconFileName[i];
        //img.style.display = "none";
        //doc.body.appendChild(img);
        img.onload = function () {
            i += 1;
            //console.log(Math.floor(i / length * 100) + "%");
            div2.style.width = Math.floor(i / length * 100) + "%";
            if (i < length) {
                loadImg();
            }
        };
    };
    div1.style.width = "320px";
    div1.style.height = "20px";
    div1.style.border = "2px solid black";
    div2.style.width = "0";
    div2.style.height = "100%";
    div2.style.backgroundColor = "blue";
    div1.appendChild(div2);
    doc.body.appendChild(div1);
    preload();
}(document));
(function (doc) {
    "use strict";
    var iconPath = "Data/Icon";
    var extensionName = "png";
    var iconFileName = ["Sword", "Lance", "Axe", "RedBow", "BlueBow", "GreenBow", "Bow", "Dagger", "RedTome", "BlueTome", "GreenTome", "Staff", "RedBreath", "BlueBreath", "GreenBreath", "ColorlessBreath"];
    var button = doc.createElement("button");
    button.appendChild(doc.createTextNode("Skip"));
    button.onclick = function () {
        iconFileName.forEach(function (fileName) {
            var img = doc.createElement("img");
            img.src = iconPath + "/" + fileName + "." + extensionName;
            img.alt = fileName;
            doc.body.appendChild(img);
        });
    };
    doc.body.appendChild(button);
}(document));
