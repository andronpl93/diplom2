

// Two charts definition
var chart1, chart2,statusDel=1;
var currensy, chart;
var pointChart={
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    plotOptions: {
        series: {
                    showInNavigator: true,
        },
        scatter: {
            marker: {
                radius: 2,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x} cm, {point.y} kg'
            }
        }
    },
    rangeSelector:{
                enabled:false,

    },



};


var settings={
    'graf':{
           chart: {
                type: 'spline',
           },
           plotOptions: {
                series: {
                    showInNavigator: true,
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

    },///конец graf
    'jump': pointChart,
    'crisis': pointChart,
    'couple': pointChart,

};
var objChart={
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} </b><br/>',
            valueDecimals: 2
        },
        yAxis: {
            title: {
            enable: false,
            //        text:'деньга',
                }
        },
        title: {
            enable: false,
            text: ''
        },

        series: []
};
var pointSet=function(jdata){
             objChart.series.push({data: jdata.dat[1]});
             objChart.xAxis= {
                            title: {
                                enabled: true,
                                text: jdata.dat[0],
                            },
                            startOnTick: true,
                            endOnTick: true,
                            showLastLabel: true
             };
            objChart.yAxis= {
                        title: {
                             text: jdata.dat[2],
                        }
            };
             Highcharts.chart('chart_id',objChart);
};
var ajaxSet={
    'graf':function(jdata){
                    objChart.series=[];
                    for (var i=0;i<jdata.len*2;i+=2)
                    {

                        objChart.series.push({name:jdata.dat[i],data:jdata.dat[i+1]});
                    }
                    Highcharts.stockChart('chart_id',objChart);
                },
    'jump':pointSet,
    'crisis':pointSet,
    'couple':pointSet,
};
var objAjax={
                dataType:'json',
                timeout:50000,
                error:function(e){
                    alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз ');
                    },
            };

$(document).ready(function() {///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    work();
    update_select();
    $('header ul li input[name=selector]').bind('click',update_select); /// смена валюты обновляет выпадающие списки попарного сравнения
    $('header ul li input').bind('click',work);                         ///  обновление графика
    $('header ul li select').bind('change',delete_option);             ///   удалять из соседнего выпадающего списка
});

function work(){

    if($('header ul li input#couple:checked').length)
    {
        if($('header ul li input#couple:checked ~ select option[value]:selected').length!=2)
            return
        else
           $('header ul li input#couple').attr('data-index',$('select[name=cur1]').val()+'_'+$('select[name=cur2]').val());   ///couple/RUB+RUB
    }
    currency = $('header input[name=selector]:checked');
    chart = $('header input[name=selector2]:checked');
    var d_i='';
    if(chart.attr('data-index')){
        d_i=chart.attr('data-index')+'/'
    }
    objAjax.url='/'+chart.attr('id')+'/'+d_i+currency.attr('id');

    for(var key in settings[chart.attr('id')]){
        objChart[key]=settings[chart.attr('id')][key];
    }
    objAjax.success=ajaxSet[chart.attr('id')];
    $.ajax(objAjax);

}

function update_select(){
    currency = $('header input[name=selector]:checked');
    var objAjaxSelect={
                timeout:1000,
                async: false,
                error:function(e){
                    alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз ');
                    },
                success: function(data){
                    $('.select_currency').html(data);
                },
            };
    objAjaxSelect.url='/update_select/'+currency.attr('id')
    $.ajax(objAjaxSelect);
}

function delete_option(obj){
    var self=$(this);
    var valSelf=self.val();
    var context=$('header ul li select').not(self);
    var contextVal=context.val();
    update_select();
            self.val(valSelf);
            context.val(contextVal);
            $('option[value='+self.val()+']',context).remove();
    if($('header ul li input#couple:checked ~ select option[value]:selected').length==2)
        work();

}
























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


