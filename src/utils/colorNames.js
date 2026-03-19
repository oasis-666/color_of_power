// src/utils/colorNames.js
const CLASSICAL_COLOR_MAP = {
  'tang': { '黄': '柘黄', '红': '朱砂', '青': '靛青', '绿': '碧绿', '灰': '黛灰', '白': '月白', '褐': '檀褐' },
  'song': { '黄': '缃色', '红': '绯红', '青': '天青', '绿': '翠微', '灰': '瓦灰', '白': '素白', '褐': '秋香褐' },
  'yuan': { '黄': '黄栌', '红': '丹朱', '青': '群青', '绿': '石绿', '灰': '蟹壳青', '白': '鱼肚白', '褐': '驼褐' },
  'ming': { '黄': '明黄', '红': '大红', '青': '孔雀蓝', '绿': '官绿', '灰': '青灰', '白': '铅白', '褐': '酱褐' },
  'qing': { '黄': '琉璃黄', '红': '洋红', '青': '石青', '绿': '琉璃绿', '灰': '砖灰', '白': '霜白', '黑': '墨色' }
};

export const getClassicalName = (rawColor, dynasty = 'qing') => {
  const dynastyMap = CLASSICAL_COLOR_MAP[dynasty] || CLASSICAL_COLOR_MAP['qing'];
  
  // 核心魔法：模糊匹配。只要后端传来的词（比如"土黄色"）包含字典里的字（"黄"），就映射！
  for (let key in dynastyMap) {
    if (rawColor.includes(key)) {
      return dynastyMap[key];
    }
  }
  
  // 如果实在匹配不上（比如后端传了个奇怪的颜色），就原样返回
  return rawColor;
};