/*jslint
    long, this
*/
"use strict";
// 给数组添加一个获取按降序排列时的原索引列表的方法
Array.prototype.getMaxIndex = function () {
    var a = this;
    return a.reduce(function (maxIndex, value, index) {
        if (value > a[maxIndex]) {
            return index;
        } else {
            return maxIndex;
        }
    }, 0);
};
Array.prototype.getDescendingIndexes = function () {
    var a = this.slice();
    var i = 0;
    var l = a.length;
    var descendingIndexes = [];
    while (i < l) {
        descendingIndexes[i] = a.getMaxIndex();
        a[descendingIndexes[i]] = -Infinity;
        i += 1;
    }
    return descendingIndexes;
};
// 给数组添加一个获取合计值的方法
Array.prototype.sum = function () {
    return this.reduce(function (total, value) {
        return total + value;
    });
};
// 创建唯一的全局变量以及一些要用到的文本
var feh = {
    text: {
        weaponType: ["武器種", "Weapon Type", "武器類型"],
        moveType: ["移動タイプ", "Move Type", "移動方式"],
        rarity: ["レアリティ", "Rarity", "稀有度"],
        summonerSupport: ["召喚師との絆の契り", "Summoner Support", "與召喚師的羈絆契約"],
        weapon: ["武器", "Weapon", "武器"],
        stats: [
            ["ＨＰ", "攻撃", "速さ", "守備", "魔防"],
            ["HP", "ATK", "SPD", "DEF", "RES"],
            ["ＨＰ", "攻擊", "速度", "防守", "魔防"]
        ],
        stat: ["能力値", "Stat", "能力值"],
        rating: ["合計", "Rating", "合計"],
        level: ["レベル", "Level", "等級"]
    },
    heroes: []
};
(function () {
    // 英雄武器类型的构造函数
    var red = 0;
    var blue = 1;
    var green = 2;
    var colorless = 3;
    var physical = false;
    var magical = true;
    function WeaponType(index, name, type, damageType, range) {
        this.id = name[1].replace(/\s/g, "");
        this.index = index;
        this.name = name;
        this.type = type;
        this.damageType = damageType;
        this.range = range;
    }
    // 英雄武器类型的实例
    feh.weaponType = {
        sword: new WeaponType(0, ["剣", "Sword", "劍"], red, physical, 1),
        lance: new WeaponType(4, ["槍", "Lance", "槍"], blue, physical, 1),
        axe: new WeaponType(8, ["斧", "Axe", "斧"], green, physical, 1),
        redBow: new WeaponType(1, ["赤の弓", "Red Bow", "赤弓"], red, physical, 2),
        blueBow: new WeaponType(5, ["青の弓", "Blue Bow", "青弓"], blue, physical, 2),
        greenBow: new WeaponType(9, ["緑の弓", "Green Bow", "綠弓"], green, physical, 2),
        bow: new WeaponType(12, ["弓", "Bow", "弓"], colorless, physical, 2),
        dagger: new WeaponType(13, ["暗器", "Dagger", "暗器"], colorless, physical, 2),
        redTome: new WeaponType(2, ["赤の魔道", "Red Tome", "赤之魔道"], red, magical, 2),
        blueTome: new WeaponType(6, ["青の魔道", "Blue Tome", "青之魔道"], blue, magical, 2),
        greenTome: new WeaponType(10, ["緑の魔道", "Green Tome", "綠之魔道"], green, magical, 2),
        staff: new WeaponType(14, ["杖(攻撃時)", "Staff", "杖(攻擊時)"], colorless, magical, 2),
        redBreath: new WeaponType(3, ["赤の竜", "Red Breath", "赤龍"], red, magical, 1),
        blueBreath: new WeaponType(7, ["青の竜", "Blue Breath", "青龍"], blue, magical, 1),
        greenBreath: new WeaponType(11, ["緑の竜", "Green Breath", "綠龍"], green, magical, 1),
        colorlessBreath: new WeaponType(15, ["無竜", "Colorless Breath", "無龍"], colorless, magical, 1)
    };
    // 英雄移动方式的构造函数
    function MoveType(name, move) {
        this.id = name[1];
        this.name = name;
        this.move = move;
    }
    // 英雄移动方式的实例
    feh.moveType = {
        infantry: new MoveType(["歩行", "Infantry", "步行"], 2),
        armored: new MoveType(["重装", "Armored", "重裝"], 1),
        cavalry: new MoveType(["騎馬", "Cavalry", "騎馬"], 3),
        flying: new MoveType(["飛行", "Flying", "飛行"], 2)
    };
    // 英雄的构造函数
    function Hero(id, date, title, name, weaponType, moveType, baseStats, growthType, weaponMt, minRarity, minSummonRarity, index) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.name = name;
        this.weaponType = weaponType;
        this.moveType = moveType;
        this.baseStats = baseStats;
        this.growthType = growthType;
        this.weaponMt = weaponMt;
        this.minRarity = minRarity;
        this.minSummonRarity = minSummonRarity;
        this.index = index;
    }
    // 成长类型值表
    var growthTypeValue = [
        [6, 7, 7, 8, 8],      // 0
        [8, 8, 9, 10, 10],    // 1
        [9, 10, 11, 12, 13],  // 2
        [11, 12, 13, 14, 15], // 3
        [13, 14, 15, 16, 17], // 4
        [14, 15, 17, 18, 19], // 5
        [16, 17, 19, 20, 22], // 6
        [18, 19, 21, 22, 24], // 7
        [19, 21, 23, 24, 26], // 8
        [21, 23, 25, 26, 28], // 9
        [23, 25, 27, 28, 30], // 10
        [24, 26, 29, 31, 33], // 11
        [26, 28, 31, 33, 35], // 12
        [0, 0, 33, 35, 37]    // 13
    ];
    // 稀有度对应的初始武器和最终武器索引
    var weaponIndexes = [
        [0, 1, 2, 2, 3],
        [0, 0, 1, 2, 3]
    ];
    var staffIndexes = [
        [0, 0, 1, 1, 2],
        ["Genny_F", "Lyn_F_Wedding"]
    ];
    // 创建Array.prototype.map方法使用的函数，JSLint不允许在循环中创建函数
    var makeIncreaseFunction = function (increaseValue) {
        return function (value) {
            return value + increaseValue;
        };
    };
    // 觉醒算法
    var unlockPotential = function (stats, rarity) {
        var hp;
        var descendingIndexes;
        while (rarity > 1) {
            stats = stats.map(makeIncreaseFunction(1));
            rarity -= 2;
        }
        if (rarity === 1) {
            hp = stats.shift();
            descendingIndexes = stats.getDescendingIndexes();
            stats[descendingIndexes.shift()] += 1;
            stats[descendingIndexes.shift()] += 1;
            stats.unshift(hp);
        }
        return stats;
    };
    // 突破算法
    var mergeAllies = function (stats, count) {
        var descendingIndexes;
        while (count > 4) {
            stats = stats.map(makeIncreaseFunction(2));
            count -= 5;
        }
        if (count > 0) {
            descendingIndexes = stats.getDescendingIndexes();
            descendingIndexes = descendingIndexes.concat(descendingIndexes);
            while (count > 0) {
                stats[descendingIndexes.shift()] += 1;
                stats[descendingIndexes.shift()] += 1;
                count -= 1;
            }
        }
        return stats;
    };
    // 与召唤师的羁绊契约算法
    var summonerSupport = function (stats, level) {
        var increaseValue = [
            [3, 0, 0, 0, 2],
            [4, 0, 0, 2, 2],
            [4, 0, 2, 2, 2],
            [5, 2, 2, 2, 2]
        ];
        return stats.map(function (v, i) {
            return v + increaseValue[level][i];
        });
    };
    // 计算武器
    var addWeaponMt = function (stats, weaponMt) {
        if (typeof weaponMt === "number") {
            stats[1] += weaponMt;
        } else {
            stats = stats.map(function (v, i) {
                return v + weaponMt[i];
            });
        }
        return stats;
    };
    // 计算能力值的方法
    Hero.prototype.calcStats = function (rarity, increaseStatIndex, decreaseStatIndex, hasGrown, mergeAlliesCount, summonerSupportLevel, haveWeapon) {
        // 复制数组，避免原始值被修改
        var stats = this.baseStats.slice();
        var growthType = this.growthType.slice();
        // 计算稀有度
        stats = unlockPotential(stats, rarity);
        // 如果可以有性格计算性格
        if (this.minSummonRarity <= rarity && increaseStatIndex !== decreaseStatIndex) {
            stats[increaseStatIndex] += 1;
            growthType[increaseStatIndex] += 1;
            stats[decreaseStatIndex] -= 1;
            growthType[decreaseStatIndex] -= 1;
        }
        // 如果有突破计算突破，注意计算突破要先于满级和契约，具体原因参考突破规则
        if (mergeAlliesCount) {
            stats = mergeAllies(stats, mergeAlliesCount);
        }
        // 如果需要，计算满级能力值
        if (hasGrown) {
            stats = stats.map(function (value, index) {
                return value + growthTypeValue[growthType[index]][rarity];
            });
        }
        // 如果有契约则计算
        if (summonerSupportLevel > -1) {
            stats = summonerSupport(stats, summonerSupportLevel);
        }
        // 计算武器
        if (haveWeapon) {
            if (this.weaponType === feh.weaponType.staff) {
                if (hasGrown) {
                    stats = addWeaponMt(stats, this.weaponMt[staffIndexes[0][rarity]]);
                } else if (staffIndexes[1].indexOf(this.id) > -1) {
                    stats = addWeaponMt(stats, this.weaponMt[1]);
                }
            } else {
                if (hasGrown) {
                    if (rarity === 4 && this.weaponMt[4]) {
                        stats = addWeaponMt(stats, this.weaponMt[4]);
                    } else {
                        stats = addWeaponMt(stats, this.weaponMt[weaponIndexes[0][rarity]]);
                    }
                } else {
                    stats = addWeaponMt(stats, this.weaponMt[weaponIndexes[1][rarity]]);
                }
            }
        }
        // 返回计算后的能力值
        return stats;
    };
    /* 实验性的功能
    Hero.prototype.calcIVs = function () {
        var i = 0;
        var len = feh.text.stats[1].length;
        var s = "★5 IVs\n";
        while (i < len) {
            s += feh.text.stats[1][i] + (growthTypeValue[this.growthType[i] - 1][4] - growthTypeValue[this.growthType[i]][4] - 1) + " ";
            s += feh.text.stats[1][i] + "+" + (growthTypeValue[this.growthType[i] + 1][4] - growthTypeValue[this.growthType[i]][4] + 1) + "\n";
            i += 1;
        }
        return s;
    };
    */
    // 创建一个比较容易的方法添加英雄，而且英雄的构造函数在外部没法直接访问
    // 实际的稀有度要-1才是内部数据的稀有度值，这里已经作了处理，所以数据文件内和这里是实际的稀有度
    feh.createHero = function (id, date, title, name, weaponType, moveType, baseStats, growthType, weaponMt, minRarity, minSummonRarity) {
        // 如果没有指定英雄的最低稀有度，则最低稀有度设为5星
        if (minRarity === undefined) {
            minRarity = 5;
        }
        // 如果没有指定英雄能召唤的最低稀有度
        // 最低稀有度小于3星时，则能召唤的最低稀有度设为3星
        // 最低稀有度大于等于3星时，则能召唤的最低稀有度设为等于最低稀有度
        if (minSummonRarity === undefined) {
            if (minRarity < 3) {
                minSummonRarity = 3;
            } else {
                minSummonRarity = minRarity;
            }
        }
        feh.heroes.push(new Hero(id, new Date(date[0], date[1] - 1, date[2]), title, name, weaponType, moveType, baseStats, growthType, weaponMt, minRarity - 1, minSummonRarity - 1, feh.heroes.length));
    };
}());
