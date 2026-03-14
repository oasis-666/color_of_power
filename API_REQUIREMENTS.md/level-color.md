# 1. 大屏统计：建筑色彩等级数据

**功能描述**：
用于前端首页大屏左上角“建筑色彩等级”卡片的数据渲染。统计当前数据库中，各个社会阶级对应的建筑总数量，并按数量从小到大（或等级从高到低）排序。

* **请求地址 (URL)**: `/api/dashboard/color-levels`
* **请求方式 (Method)**: `GET`
* **请求参数 (Params)**: 无

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "colorLevels": [
      { 
        "name": "皇家", 
        "value": 127, 
        "percent": "10%", 
        "color": "#ffbb00" 
      },
      { 
        "name": "王公", 
        "value": 389, 
        "percent": "25%", 
        "color": "#2ca02c" 
      },
      { 
        "name": "官员", 
        "value": 892, 
        "percent": "50%", 
        "color": "#0088cc" 
      },
      { 
        "name": "富户", 
        "value": 1567, 
        "percent": "75%", 
        "color": "#666666" 
      },
      { 
        "name": "平民", 
        "value": 4523, 
        "percent": "100%", 
        "color": "#333333" 
      }
    ]
  }
}
```
