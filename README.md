# date-time-picker
设置日期和时间的jQuery插件

### 介绍

date-time-picker 是基于jQuery的一款日期和时间选择插件，主要应用于PC端，只要将 input 元素设置 `data-picker` 属性且值为 `date` 或者 `time` 即可。

### 如何使用

- 首先引入jquery.datetimepicker.js和基础库

```html
<script src="src/jquery-1.8.0.min.js"></script>
<script src="src/jquery.datetimepicker.js"></script>
```

- 然后再引入插件的样式

```html
<link rel="stylesheet" href="src/jquery.datetimepicker.css">
```

- 最后在页面里，为需要的元素添加 `data-picker` 属性。当然，这里日期和时间设置是分开的，若你想要选取日期，可通过以下代码：

```html
<input type="text" class="date01" data-picker="date"/>
```

```javascript
$('.date01').dateTimePicker({});
```


date-time-picker演示：[点击查看](http://joy-yi0905.github.io/date-time-picker/demo/demo.html)

