# 6. 大屏统计：社会等级建筑数量统计

**功能描述**：
用于首页大屏左侧“等级数据统计”横向柱状图的渲染。展示不同社会阶层（皇家、王公、官员、富户、平民）对应的建筑收录数量。该数据随朝代切换而联动，体现不同历史时期礼制对建筑规模的影响。

* **请求地址 (URL)**: `/api/dashboard/level-stats`
* **请求方式 (Method)**: `GET`
* **请求参数 (Query)**:
    | 参数名 | 类型 | 必填 | 说明 | 示例 |
    | :--- | :--- | :--- | :--- | :--- |
    | `dynasty` | `String` | 是 | 朝代标识符 | `tang` / `qing` |

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "dynastyName": "清朝",
    "levels": [
      { "label": "皇家建筑", "value": 127, "ratio": 0.10 },
      { "label": "王公建筑", "value": 389, "ratio": 0.25 },
      { "label": "官员建筑", "value": 892, "ratio": 0.45 },
      { "label": "富户建筑", "value": 1567, "ratio": 0.70 },
      { "label": "平民建筑", "value": 4523, "ratio": 1.00 }
    ]
  }
}

```

### 字段说明 (Fields)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `dynastyName` | `String` | 当前选中的朝代名称 |
| `levels` | `Array` | 等级数据列表，按社会地位从高到低排序 |
| `levels[].label` | `String` | 等级标签名称（用于 Y 轴显示） |
| `levels[].value` | `Integer` | 该等级下的建筑总数（用于柱状图右侧数值显示） |
| `levels[].ratio` | `Float` | 长度比例（0.0 - 1.0）。计算逻辑：当前 value / 所有等级中的最大 value。前端直接用此比例控制柱状图填充宽度 |

