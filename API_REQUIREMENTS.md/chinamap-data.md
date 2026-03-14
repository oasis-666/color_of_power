# 3. 大屏统计：中国建筑色彩地理分布数据

**功能描述**：
用于首页大屏中心中国地图的数据渲染。根据当前选中的朝代，统计全国各大地理区域（如华北、华东、西南等）收录的建筑总数，用于渲染地图的颜色深浅及浮窗显示。

* **请求地址 (URL)**: `/api/dashboard/map-distribution`
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
    "maxCount": 2000,
    "regions": [
      { "name": "西南地区", "value": 1500, "provinces": ["四川省", "云南省", "贵州省", "西藏自治区", "重庆市"] },
      { "name": "华北地区", "value": 1200, "provinces": ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区"] },
      { "name": "华东地区", "value": 850, "provinces": ["上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省"] },
      { "name": "西北地区", "value": 320, "provinces": ["陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区"] },
      { "name": "华南地区", "value": 600, "provinces": ["广东省", "广西壮族自治区", "海南省"] },
      { "name": "华中地区", "value": 750, "provinces": ["河南省", "湖北省", "湖南省"] }
    ]
  }
}

```

### 字段说明 (Fields)

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| `maxCount` | `Integer` | 全局区域中的最大建筑数（用于前端地图色域映射 `visualMap` 的上限设置） |
| `regions` | `Array` | 各大地理区域的数据列表 |
| `regions[].name` | `String` | 区域名称 |
| `regions[].value` | `Integer` | 该区域内的建筑统计总数 |
| `regions[].provinces` | `Array` | 该区域包含的省份名称列表（前端渲染 Echarts 时，会将 `value` 同步映射到这些省份上进行高亮显示） |
