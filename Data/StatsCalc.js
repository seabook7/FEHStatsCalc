/*global
    feh
*/
/*jslint
    browser, devel, long
*/
// IE不支持Object.values这个方法
if (!Object.values) {
    Object.values = function (o) {
        "use strict";
        return Object.keys(o).map(function (key) {
            return o[key];
        });
    };
}
(function (doc) {
    "use strict";
    // DEBUG
    var debug = false;
    var log;
    var message;
    var indentation;
    if (debug) {
        log = console.log;
        indentation = "    ";
    }
    // 要指定默认的语言，请将下一行langIndex的值修改为langList数组的一个有效索引。
    var langIndex = 3;
    var langList = [
        {text: "日本語", code: "ja", title: "ファイアーエムブレム　ヒーローズ"}, // var langIndex = 0;
        {text: "English (US)", code: "en", title: "Fire Emblem Heroes"},         // var langIndex = 1;
        {text: "繁體中文", code: "zh", title: "Fire Emblem Heroes"}              // var langIndex = 2;
    ];
    var checked = "checked";
    var unchecked = "unchecked";
    var options;
    var buttons = [doc.createElement("button"), doc.createElement("button")];
    var heroesTable = doc.createElement("table");
    var preloadImg = function (files, path, extension, threadNumber) {
        function loadNextImg() {
            if (files.length > 0) {
                var img = doc.createElement("img");
                img.src = path + files.shift() + extension;
                img.alt = "";
                img.onload = loadNextImg;
            }
        }
        while (threadNumber > 0) {
            loadNextImg();
            threadNumber -= 1;
        }
    };
    var getLangIndexes = function () {
        if (debug) {
            log("Available Languages:");
        }
        return langList.map(function (l, i) {
            if (debug) {
                log(indentation + l.text);
            }
            return i;
        });
    };
    var createImg = function (src, alt, width, height, className) {
        var img = doc.createElement("img");
        img.src = src;
        img.alt = alt;
        if (width) {
            img.width = width;
        }
        if (height) {
            img.height = height;
        }
        if (className) {
            img.className = className;
        }
        return img;
    };
    var initialize = function () {
        var tables = (function () {
            function createTable(numberOfColumns) {
                var table = doc.createElement("table");
                var tr = doc.createElement("tr");
                var td;
                while (numberOfColumns > 0) {
                    numberOfColumns -= 1;
                    td = doc.createElement("td");
                    td.className = "option";
                    tr.appendChild(td);
                }
                table.className = "normal";
                table.appendChild(tr);
                return table;
            }
            return [createTable(3), createTable(4), createTable(1)];
        }());
        var createFieldset = function (legendText, className) {
            var fieldset = doc.createElement("fieldset");
            var legend = doc.createElement("legend");
            if (className) {
                fieldset.className = className;
            }
            legend.appendChild(doc.createTextNode(legendText));
            fieldset.appendChild(legend);
            return fieldset;
        };
        var createImgFieldset = function (legendText, imgList, numberOfColumns) {
            var fieldset = createFieldset(legendText, "img");
            var last = imgList.length - 1;
            imgList.forEach(function (e, i) {
                fieldset.appendChild(e);
                if (i % numberOfColumns === numberOfColumns - 1 && i !== last) {
                    fieldset.appendChild(doc.createElement("br"));
                }
            });
            return fieldset;
        };
        var createTableFieldset = function (legendText, elemList, numberOfColumns) {
            var fieldset = createFieldset(legendText);
            var table = doc.createElement("table");
            var tr;
            var td;
            var last = elemList.length - 1;
            table.className = "normal";
            elemList.forEach(function (e, i) {
                if (i % numberOfColumns === 0) {
                    tr = doc.createElement("tr");
                }
                td = doc.createElement("td");
                td.className = "option";
                td.appendChild(e);
                tr.appendChild(td);
                if (i % numberOfColumns === numberOfColumns - 1 || i === last) {
                    table.appendChild(tr);
                }
            });
            fieldset.appendChild(table);
            return fieldset;
        };
        var buttonsText = [
            ["計算", "リセット"],
            ["Calculate", "Reset"],
            ["計算", "重置"]
        ];
        doc.documentElement.lang = langList[langIndex].code;
        doc.title = langList[langIndex].title;
        doc.body.className = "normal";
        options = (function () {
            function createTypeImg(fehType) {
                var typeImg = [];
                function haveUnchecked() {
                    return typeImg.some(function (value) {
                        return value.className === unchecked;
                    });
                }
                typeImg = Object.values(fehType).map(function (type, index) {
                    var img = createImg("Data/Icon/" + type.id + ".png", type.name[langIndex], false, false, checked);
                    img.title = img.alt;
                    img.onclick = function () {
                        if (haveUnchecked()) {
                            if (img.className === unchecked) {
                                img.className = checked;
                            } else {
                                img.className = unchecked;
                            }
                        } else {
                            typeImg.forEach(function (value) {
                                value.className = unchecked;
                            });
                            img.className = checked;
                        }
                    };
                    type.imgIndex = index;
                    return img;
                });
                return typeImg;
            }
            function createRarityImg(rarityList) {
                var rarityImg = [];
                rarityImg = rarityList.map(function (value) {
                    var img = createImg("Data/Icon/Star_" + value + "_Left.png", "★" + value, 90, 22, unchecked);
                    if (value === 5) {
                        img.className = checked;
                    }
                    img.onclick = function () {
                        if (img.className === unchecked) {
                            rarityImg.forEach(function (v) {
                                v.className = unchecked;
                            });
                            img.className = checked;
                        }
                    };
                    return img;
                });
                return rarityImg;
            }
            function createRadio(textList, name) {
                return textList.map(function (text, i) {
                    var label = doc.createElement("label");
                    var radio = doc.createElement("input");
                    radio.type = "radio";
                    radio.name = name;
                    if (i === 0) {
                        radio.checked = true;
                    }
                    label.appendChild(radio);
                    label.appendChild(doc.createTextNode(text));
                    return label;
                });
            }
            function createMergeAlliesSelect() {
                var select = doc.createElement("select");
                var option = doc.createElement("option");
                var i = 0;
                select.appendChild(option);
                while (i < 10) {
                    option = doc.createElement("option");
                    i += 1;
                    option.appendChild(doc.createTextNode(i));
                    select.appendChild(option);
                }
                return select;
            }
            function createSummonerSupportImg() {
                var summonerSupportImg = [];
                var supportLevel = ["C", "B", "A", "S"];
                summonerSupportImg = supportLevel.map(function (level) {
                    var img = createImg("Data/Icon/Icon_ReliancePlayer" + level + "_L.png", level, 55, 60, unchecked);
                    img.onclick = function () {
                        if (img.className === checked) {
                            img.className = unchecked;
                        } else {
                            summonerSupportImg.forEach(function (value) {
                                value.className = unchecked;
                            });
                            img.className = checked;
                        }
                    };
                    return img;
                });
                return summonerSupportImg;
            }
            function createWeaponImg() {
                var img = createImg("Data/Icon/Weapon.png", feh.text.weapon[langIndex], 60, 60, checked);
                img.onclick = function () {
                    if (img.className === checked) {
                        img.className = unchecked;
                    } else {
                        img.className = checked;
                    }
                };
                return img;
            }
            function createCheckbox(text, checked) {
                var label = doc.createElement("label");
                var checkbox = doc.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = checked;
                label.appendChild(checkbox);
                label.appendChild(doc.createTextNode(text));
                return label;
            }
            function createSortSelect() {
                var select = doc.createElement("select");
                var optionText = ["Origin", "Type & Weapon Type", "Date"];
                optionText.forEach(function (text) {
                    var option = doc.createElement("option");
                    option.appendChild(doc.createTextNode(text));
                    select.appendChild(option);
                });
                select.onchange = function () {
                    switch (select.selectedIndex) {
                    case 0:
                        feh.heroes.sort(function (hero1, hero2) {
                            return hero1.index - hero2.index;
                        });
                        break;
                    case 1:
                        feh.heroes.sort(function (hero1, hero2) {
                            return hero1.weaponType.index - hero2.weaponType.index;
                        });
                        break;
                    case 2:
                        feh.heroes.sort(function (hero1, hero2) {
                            return hero1.date.getTime() - hero2.date.getTime();
                        });
                        break;
                    }
                    if (debug) {
                        log("Sort " + select.selectedIndex + ": OK");
                    }
                };
                return select;
            }
            return {
                weaponTypeImg: createTypeImg(feh.weaponType),
                moveTypeImg: createTypeImg(feh.moveType),
                rarityImg: createRarityImg([1, 2, 3, 4, 5]),
                increaseStatRadio: createRadio(feh.text.stats[langIndex], "increaseStat"),
                decreaseStatRadio: createRadio(feh.text.stats[langIndex], "decreaseStat"),
                levelRadio: createRadio(["1", "40"], "level"),
                mergeAlliesSelect: createMergeAlliesSelect(),
                summonerSupportImg: createSummonerSupportImg(),
                weaponImg: createWeaponImg(),
                onlySummonCheckbox: createCheckbox("Show only summonable heroes", false),
                bigCheckbox: createCheckbox("Big Picture", true),
                sortSelect: createSortSelect()
            };
        }());
        buttons.forEach(function (button, index) {
            button.appendChild(doc.createTextNode(buttonsText[langIndex][index]));
        });
        tables[0].rows[0].cells[0].appendChild(createImgFieldset(feh.text.weaponType[langIndex], options.weaponTypeImg, 8));
        tables[0].rows[0].cells[1].appendChild(createImgFieldset(feh.text.weaponType[langIndex], options.moveTypeImg, 2));
        options.rarityImg[0].style.marginTop = "1px";
        options.rarityImg[4].style.marginBottom = "1px";
        options.rarityImg[4].style.marginRight = "20px";
        tables[0].rows[0].cells[2].appendChild(createImgFieldset(feh.text.rarity[langIndex], options.rarityImg, 1));
        tables[1].rows[0].cells[0].appendChild(createTableFieldset(feh.text.stat[langIndex], [createImg("Data/Icon/Increase.png", "↑", 30, 30)].concat(options.increaseStatRadio, createImg("Data/Icon/Decrease.png", "↓", 30, 30), options.decreaseStatRadio), 6));
        tables[1].rows[0].cells[1].appendChild(createTableFieldset(feh.text.level[langIndex], options.levelRadio.concat(createImg("Data/Icon/Plus.png", "+", 17, 21), options.mergeAlliesSelect), 2));
        tables[1].rows[0].cells[2].appendChild(createImgFieldset(feh.text.summonerSupport[langIndex], options.summonerSupportImg, 4));
        tables[1].rows[0].cells[3].appendChild(createImgFieldset(feh.text.weapon[langIndex], [options.weaponImg], 1));
        tables[2].rows[0].cells[0].appendChild(createImgFieldset("Options", [options.onlySummonCheckbox, options.bigCheckbox, doc.createTextNode(" Sort: "), options.sortSelect, buttons[0], buttons[1]], 9));
        tables.forEach(function (table) {
            doc.body.appendChild(table);
        });
        if (location.protocol !== "file:") {
            preloadImg(
                feh.heroes.map(function (hero) {
                    return hero.id;
                }),
                "Data/Face/",
                ".png",
                4
            );
        }
        if (debug) {
            log("Initialize: OK");
        }
    };
    var selectLanguage = function () {
        var div = doc.createElement("div");
        var table = doc.createElement("table");
        div.className = "language";
        table.className = "language";
        langList.forEach(function (language, index) {
            var tr = doc.createElement("tr");
            var td = doc.createElement("td");
            td.lang = language.code;
            td.className = "language";
            td.appendChild(doc.createTextNode(language.text));
            td.onclick = function () {
                langIndex = index;
                if (debug) {
                    log("Select Language: " + langList[langIndex].text);
                }
                initialize();
                div.className = "language remove";
            };
            tr.appendChild(td);
            table.appendChild(tr);
        });
        div.appendChild(table);
        doc.body.appendChild(div);
        if (location.protocol !== "file:") {
            preloadImg(
                [
                    "Sword", "Lance", "Axe", "RedBow", "BlueBow", "GreenBow", "Bow", "Dagger", "RedTome", "BlueTome", "GreenTome", "Staff", "RedBreath", "BlueBreath", "GreenBreath", "ColorlessBreath",
                    "Infantry", "Armored", "Cavalry", "Flying",
                    "Star_1_Left", "Star_2_Left", "Star_3_Left", "Star_4_Left", "Star_5_Left",
                    "Increase", "Decrease", "Plus", "Weapon",
                    "Icon_ReliancePlayerA_L", "Icon_ReliancePlayerB_L", "Icon_ReliancePlayerC_L", "Icon_ReliancePlayerS_L"
                ],
                "Data/Icon/",
                ".png",
                4
            );
        }
    };
    var clearHeroesTable = function () {
        if (heroesTable.hasChildNodes()) {
            doc.body.removeChild(heroesTable);
            while (heroesTable.hasChildNodes()) {
                heroesTable.removeChild(heroesTable.firstChild);
            }
            if (debug) {
                log("Clear Heroes Table: OK");
            }
        }
    };
    heroesTable.className = "normal";
    if (getLangIndexes().indexOf(langIndex) > -1) {
        if (debug) {
            log("Default Language: " + langList[langIndex].text);
        }
        initialize();
    } else {
        selectLanguage();
    }
    buttons[0].onclick = function () {
        var isBig = options.bigCheckbox.firstChild.checked;
        var head = (function () {
            var shortText = (function () {
                if (isBig) {
                    return {
                        weaponType: ["武器種", "Weapon T.", "武器類型"],
                        moveType: ["移動タ...", "Move T.", "移動方式"]
                    };
                } else {
                    return {
                        weaponType: ["武", "W", "武"],
                        moveType: ["移", "M", "移"]
                    };
                }
            }());
            var textList = ["", ""].concat(shortText.weaponType[langIndex], shortText.moveType[langIndex], feh.text.stats[langIndex], feh.text.rating[langIndex]);
            var tr = doc.createElement("tr");
            var td;
            textList.forEach(function (text, index) {
                td = doc.createElement("td");
                switch (index) {
                case 0:
                case 2:
                case 3:
                    if (isBig) {
                        td.className = "imgBigHead";
                    } else {
                        td.className = "imgHead";
                    }
                    break;
                case 1:
                    if (isBig) {
                        td.className = "nameBig";
                    } else {
                        td.className = "name";
                    }
                    break;
                default:
                    td.className = "stat";
                }
                td.appendChild(doc.createTextNode(text));
                tr.appendChild(td);
            });
            return tr;
        }());
        var rarity;
        var increaseStatIndex;
        var decreaseStatIndex;
        var hasGrown;
        var mergeAlliesCount;
        var summonerSupportLevel;
        var haveWeapon;
        var onlySummon;
        var count = 0;
        // IE不支持Array.prototype.findIndex
        // var rarity = options.rarityImg.findIndex(function (img) {
        //     return img.className === checked;
        // });
        function getCheckedIndex(imgList) {
            var i = 0;
            var len = imgList.length;
            while (i < len) {
                if (imgList[i].className === checked) {
                    return i;
                }
                i += 1;
            }
            return -1;
        }
        function getRadioIndex(lableList) {
            var i = 0;
            var len = lableList.length;
            while (i < len) {
                if (lableList[i].firstChild.checked) {
                    return i;
                }
                i += 1;
            }
            return -1;
        }
        function filter(hero) {
            var heroRarity;
            if (options.weaponTypeImg[hero.weaponType.imgIndex].className === unchecked) {
                return false;
            }
            if (options.moveTypeImg[hero.moveType.imgIndex].className === unchecked) {
                return false;
            }
            if (onlySummon) {
                heroRarity = hero.minSummonRarity;
            } else {
                heroRarity = hero.minRarity;
            }
            if (heroRarity > rarity) {
                return false;
            }
            return true;
        }
        function createFaceTd(id) {
            var td = doc.createElement("td");
            var img;
            if (isBig) {
                td.className = "imgBig";
                img = createImg("Data/Face/" + id + ".png", id, 79, 79);
            } else {
                td.className = "img";
                img = createImg("Data/Face/" + id + ".png", id, 30, 30);
            }
            td.appendChild(img);
            return td;
        }
        function createNameTd(title, name) {
            var td = doc.createElement("td");
            if (isBig) {
                td.className = "nameBig";
                td.appendChild(doc.createTextNode(title));
                td.appendChild(doc.createElement("br"));
                td.appendChild(doc.createTextNode(name));
            } else {
                td.className = "name";
                td.appendChild(doc.createTextNode(name + " (" + title + ")"));
            }
            return td;
        }
        function createTypeTd(id, title) {
            var td = doc.createElement("td");
            var img;
            if (isBig) {
                td.className = "imgBig";
                img = createImg("Data/Icon/" + id + ".png", id, 56, 56);
            } else {
                td.className = "img";
                img = createImg("Data/Icon/" + id + ".png", id, 28, 28);
            }
            img.title = title;
            td.appendChild(img);
            return td;
        }
        function buildstatTd(tr, stats) {
            var td;
            var s = stats.concat(stats.sum());
            s.forEach(function (v) {
                td = doc.createElement("td");
                if (isBig) {
                    td.className = "statBig";
                } else {
                    td.className = "stat";
                }
                td.appendChild(doc.createTextNode(v));
                tr.appendChild(td);
            });
        }
        clearHeroesTable();
        heroesTable.appendChild(head);
        rarity = getCheckedIndex(options.rarityImg);
        increaseStatIndex = getRadioIndex(options.increaseStatRadio);
        decreaseStatIndex = getRadioIndex(options.decreaseStatRadio);
        hasGrown = getRadioIndex(options.levelRadio);
        mergeAlliesCount = options.mergeAlliesSelect.selectedIndex;
        summonerSupportLevel = getCheckedIndex(options.summonerSupportImg);
        haveWeapon = options.weaponImg.className === checked;
        onlySummon = options.onlySummonCheckbox.firstChild.checked;
        if (debug) {
            log("Get Filters:");
            message = [];
            options.weaponTypeImg.forEach(function (img) {
                if (img.className === checked) {
                    message.push(img.title);
                }
            });
            log(indentation + "Weapon Type Checked: " + message.join(", "));
            message = [];
            options.moveTypeImg.forEach(function (img) {
                if (img.className === checked) {
                    message.push(img.title);
                }
            });
            log(indentation + "Move Type Checked: " + message.join(", "));
            log(indentation + "Rarity: " + rarity);
            log(indentation + "Only Summon: " + onlySummon);
            log("Get Parameters:");
            log(indentation + "Increase Stat Index: " + increaseStatIndex);
            log(indentation + "Decrease Stat Index: " + decreaseStatIndex);
            log(indentation + "Level: " + hasGrown);
            log(indentation + "Merge Allies: " + mergeAlliesCount);
            log(indentation + "Summoner Support: " + summonerSupportLevel);
            log(indentation + "Weapon: " + haveWeapon);
            log("Get Options:");
            log(indentation + "Big: " + isBig);
        }
        feh.heroes.forEach(function (hero) {
            if (filter(hero)) {
                var tr = doc.createElement("tr");
                tr.appendChild(createFaceTd(hero.id));
                tr.appendChild(createNameTd(hero.title[langIndex], hero.name[langIndex]));
                tr.appendChild(createTypeTd(hero.weaponType.id, hero.weaponType.name[langIndex]));
                tr.appendChild(createTypeTd(hero.moveType.id, hero.moveType.name[langIndex]));
                buildstatTd(tr, hero.calcStats(rarity, increaseStatIndex, decreaseStatIndex, hasGrown, mergeAlliesCount, summonerSupportLevel, haveWeapon));
                heroesTable.appendChild(tr);
                count += 1;
            }
        });
        heroesTable.rows[0].cells[1].appendChild(doc.createTextNode("Count: " + count));
        doc.body.appendChild(heroesTable);
        if (debug) {
            log("Build Heroes Table: " + count + " Heroes Loaded");
        }
    };
    buttons[1].onclick = function () {
        options.weaponTypeImg.forEach(function (img) {
            img.className = checked;
        });
        options.moveTypeImg.forEach(function (img) {
            img.className = checked;
        });
        options.rarityImg.forEach(function (img, index) {
            if (index === 4) {
                img.className = checked;
            } else {
                img.className = unchecked;
            }
        });
        options.increaseStatRadio[0].firstChild.checked = true;
        options.decreaseStatRadio[0].firstChild.checked = true;
        options.levelRadio[0].firstChild.checked = true;
        options.mergeAlliesSelect.selectedIndex = 0;
        options.summonerSupportImg.forEach(function (img) {
            img.className = unchecked;
        });
        options.weaponImg.className = checked;
        clearHeroesTable();
        if (debug) {
            log("Reset: OK");
        }
    };
}(document));
