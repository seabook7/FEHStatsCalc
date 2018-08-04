/*jslint
    long, this
*/
"use strict";
// 构建武器类型对象
function createWeaponType(index, name, type, damageType, range) {
    return {index, name, type, damageType, range};
}
const red = 0;
const blue = 1;
const green = 2;
const colorless = 3;
const physical = false;
const magical = true;
const weaponType = {
    sword: createWeaponType(0, ["剣", "Sword", "劍"], red, physical, 1),
    lance: createWeaponType(4, ["槍", "Lance", "槍"], blue, physical, 1),
    axe: createWeaponType(8, ["斧", "Axe", "斧"], green, physical, 1),
    redBow: createWeaponType(1, ["赤の弓", "Red Bow", "赤弓"], red, physical, 2),
    blueBow: createWeaponType(5, ["青の弓", "Blue Bow", "青弓"], blue, physical, 2),
    greenBow: createWeaponType(9, ["緑の弓", "Green Bow", "綠弓"], green, physical, 2),
    bow: createWeaponType(12, ["弓", "Bow", "弓"], colorless, physical, 2),
    dagger: createWeaponType(13, ["暗器", "Dagger", "暗器"], colorless, physical, 2),
    redTome: createWeaponType(2, ["赤の魔道", "Red Tome", "赤之魔道"], red, magical, 2),
    blueTome: createWeaponType(6, ["青の魔道", "Blue Tome", "青之魔道"], blue, magical, 2),
    greenTome: createWeaponType(10, ["緑の魔道", "Green Tome", "綠之魔道"], green, magical, 2),
    staff: createWeaponType(14, ["杖(攻撃時)", "Staff", "杖(攻擊時)"], colorless, magical, 2),
    redBreath: createWeaponType(3, ["赤の竜", "Red Breath", "赤龍"], red, magical, 1),
    blueBreath: createWeaponType(7, ["青の竜", "Blue Breath", "青龍"], blue, magical, 1),
    greenBreath: createWeaponType(11, ["緑の竜", "Green Breath", "綠龍"], green, magical, 1),
    colorlessBreath: createWeaponType(15, ["無竜", "Colorless Breath", "無龍"], colorless, magical, 1)
};
Object.defineProperty(weaponType, "text", {
    value: ["武器種", "Weapon Type", "武器類型"]
});
// 构建移动方式对象
function createMoveType(name, move) {
    return {name, move};
}
const moveType = {
    infantry: createMoveType(["歩行", "Infantry", "步行"], 2),
    armored: createMoveType(["重装", "Armored", "重裝"], 1),
    cavalry: createMoveType(["騎馬", "Cavalry", "騎馬"], 3),
    flying: createMoveType(["飛行", "Flying", "飛行"], 2)
};
Object.defineProperty(moveType, "text", {
    value: ["移動タイプ", "Move Type", "移動方式"]
});
// 计算能力值要用到的几个操作数组的函数
// 获取数组内最大值的索引，空数组上操作固定返回-1，只有一个元素的数组固定返回0
function getIndexOfMax(array) {
    return array.reduce(function (indexOfMax, value, index) {
        if (index === 0) {
            return index;
        } else {
            if (array[indexOfMax] < value) {
                return index;
            } else {
                return indexOfMax;
            }
        }
    }, -1);
}
// 获取数组内的值按降序排列时的索引，返回的索引是一个新数组
function getDescIndexes(array) {
    let temp = array.slice();
    let i = 0;
    let len = temp.length;
    let descIndexes = [];
    while (i < len) {
        descIndexes[i] = getIndexOfMax(temp);
        temp[descIndexes[i]] = -Infinity;
        i += 1;
    }
    return descIndexes;
}
// 将传入的数组array内的值全部增加increaseValue，不返回新数组，会直接更改数组array内元素的值
function increase(array, increaseValue) {
    let i = 0;
    let len = array.length;
    while (i < len) {
        array[i] += increaseValue;
    }
    // map方法会返回新的数组，这样就只能返回新的数组
    // return array.map((value) => value + increaseValue);
}
// 将传入的两个数组array和increaseArray内元素的值分别相加，结果会直接保存在数组array内，不返回新的数组
function increaseArray(array, increaseArray) {
    let i = 0;
    let len = array.length;
    while (i < len) {
        array[i] += increaseArray[i];
    }
    // map方法会返回新的数组，这样就只能返回新的数组来保存结果
    // return array.map((value, index) => value + increaseArray[index]);
}
// 各种计算能力值的方法
// 觉醒算法
function unlockPotential(stats, rarity) {
    while (rarity > 1) {
        increase(stats, 1);
        rarity -= 2;
    }
    if (rarity === 1) {
        let hp = stats.shift();
        let descIndexes = getDescIndexes(stats);
        stats[descIndexes.shift()] += 1;
        stats[descIndexes.shift()] += 1;
        stats.unshift(hp);
    }
}
// 计算性格
function calcNature(stats, growthType, increaseStatIndex, decreaseStatIndex) {
    stats[increaseStatIndex] += 1;
    growthType[increaseStatIndex] += 1;
    stats[decreaseStatIndex] -= 1;
    growthType[decreaseStatIndex] -= 1;
}
// 突破算法
function mergeAllies(stats, count) {
    while (count > 4) {
        increase(stats, 2);
        count -= 5;
    }
    if (count > 0) {
        let descIndexes = getDescIndexes(stats);
        descIndexes = descIndexes.concat(descIndexes);
        while (count > 0) {
            stats[descIndexes.shift()] += 1;
            stats[descIndexes.shift()] += 1;
            count -= 1;
        }
    }
}
// 计算成长后的能力值
const growthValueTable = [ // rarity [0, 1, 2, 3, 4]
    [6, 7, 7, 8, 8],       // 0
    [8, 8, 9, 10, 10],     // 1
    [9, 10, 11, 12, 13],   // 2
    [11, 12, 13, 14, 15],  // 3
    [13, 14, 15, 16, 17],  // 4
    [14, 15, 17, 18, 19],  // 5
    [16, 17, 19, 20, 22],  // 6
    [18, 19, 21, 22, 24],  // 7
    [19, 21, 23, 24, 26],  // 8
    [21, 23, 25, 26, 28],  // 9
    [23, 25, 27, 28, 30],  // 10
    [24, 26, 29, 31, 33],  // 11
    [26, 28, 31, 33, 35],  // 12
    [0, 0, 33, 35, 37]     // 13
];
function levelUp(stats, growthType, rarity) {
    increaseArray(stats, growthType.map((value) => growthValueTable[value][rarity]));
}
// 与召唤师的羁绊契约算法
const summonerSupportTable = [ // stats [hp, atk, spd, def, res]
    [3, 0, 0, 0, 2],           // level 0
    [4, 0, 0, 2, 2],           // level 1
    [4, 0, 2, 2, 2],           // level 2
    [5, 2, 2, 2, 2]            // level 3
];
function summonerSupport(stats, level) {
    increaseArray(stats, summonerSupportTable[level]);
}
// 计算武器
const weaponIndexesTable = [ // rarity [0, 1, 2, 3, 4]
    [0, 0, 1, 2, 3],         // LV. 1
    [0, 1, 2, 2, 3]          // LV.40
];
function calcWeaponMt(stats, hasGrown, rarity, weaponMt) {
        let mtValue;
        if (hasGrown) {
            if (rarity === 4 && weaponMt[4]) {
                mtValue = weaponMt[4];
            } else {
                stats = addWeaponMt(stats, this.weaponMt[weaponIndexes[0][rarity]]);
            }
        } else {
            stats = addWeaponMt(stats, this.weaponMt[weaponIndexes[1][rarity]]);
        }
}
const staffIndexesTable = [
    ["Jenny_F_Normal", "Lin_F_Wedding17"], // LV. 1 hero id
    [0, 0, 1, 1, 2]                        // LV.40 rarity [0, 1, 2, 3, 4]
]


class Hero {
    constructor(index, id, date, title, name, weaponType, moveType, baseStats, growthType, weaponMt, minRarity, minSummonRarity) {
        this.index = index;
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
    }
}

const feh = {
    text: {
        
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
    weaponType,
    moveType,
    heroes: []
};
export default feh;