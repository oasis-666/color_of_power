# 2. 大屏统计：朝代基础数据面板

**功能描述**：
用于首页大屏左下角“朝代数据”卡片的动态渲染。当用户在时间轴点击切换不同朝代（如唐、宋、元、明、清）时，前端调用此接口获取该朝代下收录的建筑总数及核心色彩的使用分布。

* **请求地址 (URL)**: `/api/dashboard/dynasty-stats`
* **请求方式 (Method)**: `GET`
* **请求参数 (Query)**:
    | 参数名 | 类型 | 必填 | 说明 | 示例 |
    | :--- | :--- | :--- | :--- | :--- |
    | `dynasty` | `String` | 是 | 朝代唯一标识符（建议小写拼音或英文） | `tang` / `qing` |

### 返回数据示例 (Response JSON)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "dynastyName": "唐朝",
    "totalBuildings": 3100,
    "yellowCount": 40,
    "redCount": 450,
    "greenCount": 800
  }
}