
$.fn.dateTimePicker = function(options) {
    var dateObj = new Date(),
        yyyy = dateObj.getFullYear(),
        MM = dateObj.getMonth() + 1,
        dd = dateObj.getDate(),
        hh = dateObj.getHours(),
        mm = dateObj.getMinutes(),
        ss = dateObj.getSeconds();

    var fillZero = function(str, digit) {
        var str = str + '';
        while(str.length < digit){
            str = '0' + str;
        }
        return str;
    };

    var defaults = {
        date: yyyy + '-' + fillZero(MM, 2) + '-' + fillZero(dd, 2),
        time: fillZero(hh, 2) + '：' + fillZero(mm, 2) + '：' + fillZero(ss, 2),
        eventType : 'mousedown'
    };

    var options = $.extend( defaults, options);

    // 日期选择器
    function datePicker(ele) {
        this.ele = ele;
        this.opts = options;
        this.init();
    }

    datePicker.prototype = {
        init: function() {
            var self = this,
                ele = self.ele;

            ele.on('mousedown, click', function(e) {
                if ($('.calendar').length) {
                    $('.calendar').remove();
                }
                self.createDate(ele);
                e.stopPropagation();
            });

            // self.createDate(ele);
        },
        createDate: function(ele) {
            var left = ele.offset().left,
                top = ele.offset().top + ele.outerHeight() + 2,
                width = 210,
                height = 254;

            var calendar = $('<div>', {
                'class': 'calendar',
                'onselectstart': 'return false'
            }).css({
                position: 'absolute',
                top: top,
                left: left,
                zIndex: 100000,
                width: width,
                height: height,
                margin: 0,
                border: '1px solid #ccc',
                background: '#fff'
            });

            var calendarHdHtml = '',
                calendarBdHtml = '',
                dayStr = '一二三四五六日';

            calendarHdHtml += '<div class="calendar-hd">';
            calendarHdHtml += '<a class="btn-switch year-prev" href="javascript:;"><</a>';
            calendarHdHtml += '<a class="btn-switch year-next" href="javascript:;">></a>';
            calendarHdHtml += '<a class="btn-switch month-prev" href="javascript:;"><</a>';
            calendarHdHtml += '<a class="btn-switch month-next" href="javascript:;">></a>';
            calendarHdHtml += '<span class="year-view"></span>-<span class="month-view"></span>';
            calendarHdHtml += '<input type="hidden" value="" class="year-backward"/>';
            calendarHdHtml += '<input type="hidden" value="" class="month-backward"/>';
            calendarHdHtml += '<input type="hidden" value="" class="year-forward"/>';
            calendarHdHtml += '<input type="hidden" value="" class="month-forward"/>';
            calendarHdHtml += '</div>';

            calendarBdHtml += '<div class="calendar-bd">';
            calendarBdHtml += '<div class="calendar-day">';
            calendarBdHtml += '<ul class="clearfix day-list">';
            $.each(dayStr.split(''), function(index, item) {
                calendarBdHtml += '<li class="day-item">'+ item + '</li>';
            });
            calendarBdHtml += '</ul>';
            calendarBdHtml += '</div>';
            calendarBdHtml += '<div class="calendar-date">';
            calendarBdHtml += '<ul class="clearfix date-list">';
            calendarBdHtml += '</ul>';
            calendarBdHtml += '</div>';
            calendarBdHtml += '</div>';

            calendar.html(calendarHdHtml + calendarBdHtml);

            $('body').append(calendar);

            calendar.on('click', function(e) {
                e.stopPropagation();
            });

            $(document).on('click', function() {
                calendar.remove();
            });

            var calendarEle = {
                    ele: ele,
                    calendar: calendar,
                    yearView: calendar.find('.year-view'),
                    monthView: calendar.find('.month-view'),
                    yearPrev: calendar.find('.year-prev'),
                    yearNext: calendar.find('.year-next'),
                    monthPrev: calendar.find('.month-prev'),
                    monthNext: calendar.find('.month-next'),
                    yearBackward: calendar.find('.year-backward'),
                    monthBackward: calendar.find('.month-backward'),
                    yearForward: calendar.find('.year-forward'),
                    monthForward: calendar.find('.month-forward'),
                    dateList: calendar.find('.date-list')
                },
                calendarPara = {
                    yearViewVal: 0,
                    monthViewVal: 0,
                    yearBackwardVal: 0,
                    monthBackwardVal: 0,
                    yearForwardVal: 0,
                    monthForwardVal: 0
                };

            var self = this;

            // 设置当前年月
            calendarEle.yearView.html(self.opts.date.split('-')[0]);
            calendarEle.monthView.html(self.opts.date.split('-')[1]);

            // 切换日期
            calendarEle.yearPrev.on("click", function() {
                self.switchYearPrev(calendarEle, calendarPara);
            });
            calendarEle.yearNext.on("click", function() {
                self.switchYearNext(calendarEle, calendarPara);
            });
            calendarEle.monthPrev.on("click", function() {
                self.switchMonthPrev(calendarEle, calendarPara);
            });
            calendarEle.monthNext.on("click", function() {
                self.switchMonthNext(calendarEle, calendarPara);
            });

            self.renderData(calendarEle, calendarPara);
        },
        renderData: function(calendarEle, calendarPara) {

            var nowMonthInitDay = 0, // 当月1号星期几
                nowMonthDays = 0, // 当月天数
                prevMonthDays = 0, // 上月天数
                nowMonthShowDays = 0, // 当月显示天数
                prevMonthShowDays = 0, // 上月显示天数
                nextMonthShowDays = 0; // 下月显示天数

            var self = this;

            calendarPara.yearViewVal = Number(calendarEle.yearView.html()),
            calendarPara.monthViewVal = Number(calendarEle.monthView.html());

            if (calendarPara.monthViewVal === 1) {
                calendarEle.yearBackward.val(calendarPara.yearViewVal - 1);
                calendarEle.monthBackward.val(12);
            } else if(calendarPara.monthViewVal === 12){
                calendarEle.yearForward.val(calendarPara.yearViewVal + 1);
                calendarEle.monthForward.val(1);
            } else {
                calendarEle.yearBackward.val(calendarPara.yearViewVal);
                calendarEle.monthBackward.val(calendarPara.monthViewVal - 1);
                calendarEle.yearForward.val(calendarPara.yearViewVal);
                calendarEle.monthForward.val(calendarPara.monthViewVal + 1);
            }

            calendarPara.yearBackwardVal = Number(calendarEle.yearBackward.val());
            calendarPara.monthBackwardVal = Number(calendarEle.monthBackward.val());
            calendarPara.yearForwardVal = Number(calendarEle.yearForward.val());
            calendarPara.monthForwardVal = Number(calendarEle.monthForward.val());

            //获得当月1号在星期几
            nowMonthInitDay = new Date(calendarPara.yearViewVal + '/' + calendarPara.monthViewVal + '/' + '01').getDay();
            nowMonthInitDay = nowMonthInitDay == 0 ? 7 : nowMonthInitDay;

            // 本月，上月天数
            nowMonthDays = this.getMonthDays(calendarPara.yearViewVal, calendarPara.monthViewVal);
            prevMonthDays = this.getMonthDays(calendarPara.yearBackwardVal, calendarPara.monthBackwardVal);

            // 上月显示天数
            prevMonthShowDays = prevMonthDays - nowMonthInitDay + 1;

            var dataListHtml = '';

            for(var i = 0; i < 42; i += 1){
                var dateClass = 'date-item',
                    dateVal = '',
                    dateData = '';

                if (i >= nowMonthInitDay - 1 && i < nowMonthDays + (nowMonthInitDay - 1)) { 

                    nowMonthShowDays += 1;
                    // 今天
                    var today = calendarPara.yearViewVal + '-' + fillZero(calendarPara.monthViewVal, 2) + '-' + fillZero(nowMonthShowDays, 2);
                    if (today === self.opts.date) {
                        dateClass = 'date-item date-now';
                    }
                    dateVal = nowMonthShowDays;
                    dateData = calendarPara.yearViewVal + '-' + fillZero(calendarPara.monthViewVal, 2) + '-' + fillZero(dateVal, 2);
                } else if (i < nowMonthInitDay - 1) {
                    // 上月最后几天
                    prevMonthShowDays += 1;
                    dateClass = 'date-item date-gray';
                    dateVal = prevMonthShowDays;
                    dateData = calendarPara.yearBackwardVal + '-' + fillZero(calendarPara.monthBackwardVal, 2) + '-' + fillZero(dateVal, 2);
                } else {
                    // 下月最前几天
                    nextMonthShowDays += 1;
                    dateClass = 'date-item date-gray';
                    dateVal = nextMonthShowDays;
                    dateData = calendarPara.yearForwardVal + '-' + fillZero(calendarPara.monthForwardVal, 2) + '-' + fillZero(dateVal, 2);
                }

                dataListHtml += '<li class="'+ dateClass +'" data-date="'+ dateData +'"><a class="date-single" href="javascript:;">';
                dataListHtml += '<span class="solar">' + dateVal + '</span>';
                dataListHtml += '</a></li>';
            }

            calendarEle.dateList.html(dataListHtml);

            var dateItem = calendarEle.dateList.find('.date-item');

            dateItem.on('click', function() {
                calendarEle.ele.val($(this).attr('data-date'));
                calendarEle.calendar.remove();
            });

        },
        getMonthDays: function(year, month) {
            var nowMonth = 0,
                nextMonth = 0;

            nowMonth = new Date(year + '/' + parseInt(month) + '/' + 1);

            if (month === 12) {
                // 如果当月是12月，则年份加1，月份为0; 2013-12 -> 2013-13? 注意判断
                year += 1;
                month = 0;
            }

            nextMonth = new Date(year + '/' + (parseInt(month)+1) + '/' + 1);

            return parseInt(nextMonth - nowMonth)/(24*60*60*1000);
        },
        // 切换至上年
        switchYearPrev: function(calendarEle, calendarPara) {
            calendarPara.yearViewVal -= 1;
            this.switchMonth(calendarEle, calendarPara);
            calendarEle.dateList.css('left', '-30px').animate({'left': 0}, 'fast');
        },
        // 切换至下年
        switchYearNext: function(calendarEle, calendarPara) {
            calendarPara.yearViewVal += 1;
            this.switchMonth(calendarEle, calendarPara);
            calendarEle.dateList.css('left', '30px').animate({'left': 0}, 'fast');
        },
        // 切换至上月
        switchMonthPrev: function(calendarEle, calendarPara) {
            calendarPara.monthViewVal -= 1;
            if (calendarPara.monthViewVal === 0) {
                calendarPara.yearViewVal -= 1;
                calendarPara.monthViewVal = 12;
            }
            this.switchMonth(calendarEle, calendarPara);
            calendarEle.dateList.css('left', '-30px').animate({'left': 0}, 'fast');
        },
        // 切换至下月
        switchMonthNext: function(calendarEle, calendarPara) {
            calendarPara.monthViewVal += 1;
            if (calendarPara.monthViewVal === 13) {
                calendarPara.yearViewVal += 1;
                calendarPara.monthViewVal = 1;
            }
            this.switchMonth(calendarEle, calendarPara);
            calendarEle.dateList.css('left', '30px').animate({'left': 0}, 'fast');
        },
        // 切换月份
        switchMonth: function(calendarEle, calendarPara) {
            calendarPara.yearBackwardVal = calendarPara.yearViewVal;
            calendarPara.monthBackwardVal = calendarPara.monthViewVal - 1;
            if (calendarPara.monthViewVal === 1) {
                // 判断当月是否为一月，如果是，则上个月的数据切换到上一年，且月份为12月
                calendarPara.yearBackwardVal -= 1;
                calendarPara.monthBackwardVal = 12;
            }
            calendarEle.yearView.html(calendarPara.yearViewVal);
            calendarEle.monthView.html(fillZero(calendarPara.monthViewVal, 2));
            calendarEle.yearBackward.val(calendarPara.yearBackwardVal);
            calendarEle.monthBackward.val(calendarPara.monthBackwardVal);
            this.renderData(calendarEle, calendarPara);
        }
    };

    // 时间选择器
    function timePicker(ele) {
        this.ele = ele;
        this.opts = options;
        this.init();
    }

    timePicker.prototype = {
        init: function() {
            var self = this,
                ele = self.ele;
            self.createTime(ele);
        },
        createTime: function(ele) {
            var left = ele.offset().left + 2,
                top = ele.offset().top + 2,
                width = ele.outerWidth() - 4,
                height = ele.outerHeight() - 4;

            var timeBox = $('<div>', {
                'class': 'time-box',
                'onselectstart': 'return false'
            }).css({
                position: 'absolute',
                top: top,
                left: left,
                zIndex: 100000,
                width: width,
                height: height,
                margin: 0,
                lineHeight: height + 'px',
                background: '#fff'
            });

            var self = this;

            var timeBoxHtml = '';

            timeBoxHtml += '<div class="time-show">';
            timeBoxHtml += '<span class="show-item hh" data-type="hh">' + self.opts.time.split('：')[0] + '</span>';
            timeBoxHtml += '：';
            timeBoxHtml += '<span class="show-item mm" data-type="mm">' + self.opts.time.split('：')[1] + '</span>';
            timeBoxHtml += '：';
            timeBoxHtml += '<span class="show-item ss" data-type="ss">' + self.opts.time.split('：')[2] + '</span>';
            timeBoxHtml += '</div>';
            timeBoxHtml += '<div class="time-action">';
            timeBoxHtml += '<span class="btn-action btn-add"></span>';
            timeBoxHtml += '<span class="btn-action btn-reduce"></span>';
            timeBoxHtml += '</div>';

            timeBox.html(timeBoxHtml);

            $('body').append(timeBox);

            var time = {
                show: timeBox.find('.time-show'),
                hh: timeBox.find('.hh'),
                mm: timeBox.find('.mm'),
                ss: timeBox.find('.ss'),
                action: timeBox.find('.time-action'),
                btnAdd: timeBox.find('.btn-add'),
                btnReduce: timeBox.find('.btn-reduce'),
                type: ''
            };

            time.hh.add(time.mm).add(time.ss).on('click', function(e) {
                var tempType = $(this).attr('data-type');
                $(this).addClass('active').siblings().removeClass('active');
                time.type = tempType;
                e.stopPropagation();
            });

            $(document).on('click', function() {
                time.hh.add(time.mm).add(time.ss).removeClass('active');
            });

            time.btnAdd.hover(
                function(){
                    $(this).addClass('btn-active');
                },
                function(){
                    $(this).removeClass('btn-active');
                }
            ).on('click', function(e) {
                self.timeSet(ele, time, 1);
                e.stopPropagation();
            });

            time.btnReduce.hover(
                function(){
                    $(this).addClass('btn-active');
                },
                function(){
                    $(this).removeClass('btn-active');
                }
            ).on('click', function(e) {
                self.timeSet(ele, time, -1);
                e.stopPropagation();
            });

        },
        timeSet: function(ele, time, scale) {
            if (time.type === 'mm') {
                this.timeChange(time.mm, 59, scale);
            } else if (time.type === 'ss'){
                this.timeChange(time.ss, 59, scale);
            } else {
                this.timeChange(time.hh, 23, scale);
            }
            ele.val(time.show.text());
        },
        timeChange: function(timeTypeEle, max, scale) {
            var ssVal = parseInt(timeTypeEle.html());
            
            ssVal += scale;
            if (ssVal === max + 1) {
                ssVal = 0;
            } else if (ssVal === -1) {
                ssVal = max;
            }
            timeTypeEle.html(fillZero(ssVal, 2));
        }
    };

    this.each(function(){
        var self = $(this),
            type = self.attr('data-picker');

       if (type === 'date') {
            self.val(options.date);
            new datePicker(self);
        } else if (type === 'time') {
            self.val(options.time);
            new timePicker(self);
        }
    })
};