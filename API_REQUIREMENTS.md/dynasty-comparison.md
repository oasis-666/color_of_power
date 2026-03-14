# 7. 大屏统计：多朝代建筑等级分布对比 (堆叠柱状图)

**功能描述**：
用于首页大屏底部“各朝代建筑等级分布对比”图表的渲染。该接口返回唐、宋、元、明、清五个朝代的纵向对比数据，每个朝代包含五个等级（皇家、王公、官员、富户、平民）的建筑数量，前端使用堆叠柱状图（Stacked Bar Chart）进行展示。

* **请求地址 (URL)**: `/api/dashboard/dynasty-comparison`
* **请求方式 (Method)**: `GET`
* **请求参数 (Query)**: 无（固定返回主流五个朝代的全量对比数据）

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "timeline": ["唐", "宋", "元", "明", "清"],
    "series": [
      {
        "rankName": "皇家",
        "data": [900, 950, 901, 1100, 1400],
        "color": "#f3b746"
      },
      {
        "rankName": "王公",
        "data": [200, 220, 201, 250, 280],
        "color": "#5e9c45"
      },
      {
        "rankName": "平民",
        "data": [180, 190, 191, 210, 230],
        "color": "#333333"
      },
      {
        "rankName": "富户",
        "data": [110, 120, 101, 130, 150],
        "color": "#666666"
      },
      {
        "rankName": "官员",
        "data": [300, 320, 301, 350, 400],
        "color": "#3c8dbc"
      }
    ],
    "description": "展示唐、宋、元、明、清五个朝代的建筑等级分布情况，数据基于历史文献记载和现存建筑统计。"
  }
}

```

### 字段说明 (Fields)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `timeline` | `Array` | X 轴类目数据，即对比的朝代列表 |
| `series` | `Array` | 堆叠数据系列，每个对象代表一个社会等级 |
| `series[].rankName` | `String` | 等级名称（对应图例 Legend） |
| `series[].data` | `Array` | 数值数组，长度必须与 `timeline` 一致（依次对应唐、宋、元、明、清的数值） |
| `series[].color` | `String` | 建议后端返回该等级对应的固定 UI 色值，确保大屏视觉统一 |
| `description` | `String` | 底部的数据说明文本 |


---

### 💡 给后端队友的逻辑指引：
这个接口的 SQL 逻辑大概是：
`SELECT dynasty, level, COUNT(*) FROM buildings GROUP BY dynasty, level`
然后后端需要把查询到的结果，按照朝代顺序拆解并重新组装成上面这种按“等级”分类的 `series` 结构。


