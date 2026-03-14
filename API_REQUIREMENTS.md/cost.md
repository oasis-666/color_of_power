# 10. 大屏统计：建筑材料成本与工艺分析（分组柱状图）

**功能描述**：
用于首页大屏底部“材料成本”图表的渲染。通过“工艺难度”、“成本指数”、“稀有度”三个维度，量化展示不同色彩建筑材料（如琉璃瓦、朱红漆、青砖等）的经济与技术属性，体现材料背后的社会等级象征。

* **请求地址 (URL)**: `/api/dashboard/material-analysis`
* **请求方式 (Method)**: `GET`
* **请求参数 (Query)**: 无（返回核心材料的全量对比数据）

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "dimensions": ["工艺难度", "成本指数", "稀有度"],
    "materials": [
      {
        "name": "黄色琉璃瓦",
        "values": [95, 98, 92],
        "colors": ["#f3b746", "#e65d25", "#3c8dbc"]
      },
      {
        "name": "绿色琉璃瓦",
        "values": [78, 65, 55],
        "colors": ["#f3b746", "#e65d25", "#3c8dbc"]
      },
      {
        "name": "朱红漆料",
        "values": [88, 85, 82],
        "colors": ["#f3b746", "#e65d25", "#3c8dbc"]
      },
      {
        "name": "青色瓦片",
        "values": [45, 45, 30],
        "colors": ["#f3b746", "#e65d25", "#3c8dbc"]
      },
      {
        "name": "灰黑瓦片",
        "values": [25, 15, 10],
        "colors": ["#f3b746", "#e65d25", "#3c8dbc"]
      }
    ],
    "description": "分析不同色彩建筑材料的经济成本、制作工艺难度和材料稀有程度（指数化表示）。"
  }
}

```

### 字段说明 (Fields)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `dimensions` | `Array` | 指标维度名称列表（对应图例 Legend：工艺、成本、稀有度） |
| `materials` | `Array` | 材料数据列表（对应 Y 轴类目） |
| `materials[].name` | `String` | 材料名称（如：黄色琉璃瓦） |
| `materials[].values` | `Array` | 数值数组。长度固定为 3，顺序需与 `dimensions` 严格对应 |
| `materials[].colors` | `Array` | 该材料三根柱子的渲染色值（建议由后端统一返回，保持大屏 UI 一致） |
| `description` | `String` | 底部的数据说明文本 |
