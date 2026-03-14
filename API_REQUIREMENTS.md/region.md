# 9. 大屏统计：主要区域建筑等级分布 (混合图表)

**功能描述**：
用于首页大屏底部“主要区域建筑等级分布”图表的渲染。该接口返回五个核心历史省份（北京、陕西、江苏、浙江、山西）下，不同建筑等级（皇家、王公、官员、民居）的分布数据，支持前端渲染柱状图与折线图的混合布局。

* **请求地址 (URL)**: `/api/dashboard/region-rank-dist`
* **请求方式 (Method)**: `GET`
* **请求参数 (Query)**: 无（固定返回重点省份对比数据）

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "provinces": ["北京", "陕西", "江苏", "浙江", "山西"],
    "series": [
      {
        "name": "皇家",
        "type": "bar",
        "data": [180, 50, 80, 20, 40],
        "color": "#f3b746"
      },
      {
        "name": "王公",
        "type": "bar",
        "data": [220, 150, 240, 180, 200],
        "color": "#5e9c45"
      },
      {
        "name": "官员",
        "type": "line",
        "data": [300, 300, 520, 450, 600],
        "color": "#3c8dbc"
      },
      {
        "name": "民居",
        "type": "line",
        "data": [600, 850, 1250, 1050, 1500],
        "color": "#666666",
        "lineStyle": "dashed"
      }
    ],
    "description": "对比北京、陕西、江苏、浙江、山西五个重要历史区域的建筑等级分布特点。"
  }
}

```

### 字段说明 (Fields)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `provinces` | `Array` | X 轴类目数据，即对比的省份列表 |
| `series` | `Array` | 混合数据系列列表 |
| `series[].name` | `String` | 系列名称（如：皇家、民居） |
| `series[].type` | `String` | 图表类型。`bar` 表示柱状图，`line` 表示折线图 |
| `series[].data` | `Array` | 数值数组，长度需与 `provinces` 一致 |
| `series[].color` | `String` | 该系列的 UI 渲染颜色 |
| `series[].lineStyle` | `String` | 特殊样式标识。`dashed` 表示虚线（常用于代表基准线或大宗数据的民居折线） |
| `description` | `String` | 底部的数据说明文本 |
