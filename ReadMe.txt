使用方法：

用浏览器打开StatsCalc.html，如果你电脑的HTML文件关联未作乱七八糟的修改，那么双击StatsCalc.html即可。
测试Win10 Edge、IE11、Firefox 60.0.0无问题，别的浏览器我这里没条件测试。理论上安卓的浏览器也可以，但是安卓的HTML查看器是不行的。

计算无修正的性格只需要把↑和↓的性格设为一致就行了。
可选择计算1级或40级的能力值，注意计算1级时仍然可以计算突破后的能力值。
计算包括武器时，1级英雄是计算的原生初始武器，而满级英雄是计算的当前能用的原生最终武器。比如3星男主1级时，是计算的“鋼の剣”，攻击值是8+8，而3星男主满级时，是计算的“銀の剣”，攻击值是31+11，注意不包括炼成后的武器。
选好条件后点击计算按钮即可。
所有数据都是根据资料网站( http://feheroes.gamepedia.com/ )手填的，如果有错请指出。

http://bbs.nga.cn/read.php?&tid=12114331

关于新UI，基本上已经移植了之前所有的功能，现在还差CSV、BBS代码输出。
还有很多选项的位置需要调整。
另外修改Data\StatsCalc.js第22行可以指定默认的语言，这样就不会在打开时询问要使用的语言了（没有办法设置一个选项来保存，因为HTML没有修改本地文件的权限）。
