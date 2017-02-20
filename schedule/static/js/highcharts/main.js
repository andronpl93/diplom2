

// Two charts definition
var chart1, chart2;
var objChart={
        plotOptions: {
            series: {
                showInNavigator: true,
                /*marker: {
                    enabled: true,
                    lineWidth:5,
                    lineColor: 'blue',
                },

                lineWidth: 0*/
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} </b><br/>',
            valueDecimals: 2
        },
        yAxis: {
            title: {
                text: 'Деньги'
                }
        },
        rangeSelector:{
            enabled:true,
            buttons: [{
                type: 'month',
                count: 1,
                text: 'Месяц'
            }, {
                type: 'month',
                count: 3,
                text: 'Квартал'
            }, {
                type: 'month',
                count: 6,
                text: 'Пол года'
            }, {
                type: 'year',
                count: 1,
                text: 'Год'
            },{
                type: 'year',
                count: 3,
                text: '3 Года'
            },
            {
                type: 'year',
                count: 5,
                text: '5 Лет'
            },{
                type: 'year',
                count: 10,
                text: '10 Лет'
            },
            {
                type: 'all',
                text: 'Все'
            }],
            buttonTheme: {
                    width: 60
            },
     },
        series: []
};
var objAjax={
                dataType:'json',
                timeout:50000,
                error:function(e){
                    alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз ');
                    },
                success: function(jdata){
                    for (var i=0;i<jdata.len*2;i+=2)
                    {
                        objChart.series.push({name:jdata.dat[i],data:jdata.dat[i+1]});
                    }
                     Highcharts.stockChart('chart_id',objChart);
                },
                url: '/graf/rub'
            };
// Once DOM (document) is finished loading
$(document).ready(function() {

// $.ajax(objAjax);

 $('header li:not(:first-child)').bind('click ',function(){
    $(' header li').removeClass('selected');
    $(this).addClass('selected');
    objAjax.url='/graf/'+$(this).attr('id');
 });

});




/*csrf_token */

 function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });


