

// Two charts definition
var chart1, chart2,statusDel=1, objChart;
var loader=$('#preloader');
loader.fadeOut(); ////////////////////////// это важно
$('.bred').fadeOut();

var currensy, chart;
var pointChart={
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    legend:{
        color:'white',
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
                backgroundColor: 'rgba(0,0,0,0.5)',
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: ' {point.y} '
            }
        }
    },
    rangeSelector:{
                enabled:false,

    },
      tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            pointFormat: '<span style="color:{series.color}">{series.name}</span>:<b> {point.y} </b><br/>',
            valueDecimals: 2
        },
                series: [],



};
var pointChart20;
for(var key in pointChart)
    pointChart20[key]=pointChart[key];
pointChart20.chart={
        type: 'line',
        zoomType: 'xy'
    };


var dateChart={
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
           tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
           color:'black',
            pointFormat: '<span style="color:{series.color}">{series.name}</span>:<b> {point.y} </b><br/>',
            valueDecimals: 2
        },
                series: [],
}

var settings={
    'graf': dateChart,
    'jump': pointChart,
    'crisis': pointChart,
    'couple': pointChart20,

};

var objChart2=objChart;
var pointSet=function(jdata){
            loader.fadeOut(300);
            objChart.series=[];
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
            objChart.title={text:''};

             Highcharts.chart('chart_id',objChart);
};
var dateSet=function(jdata){
                    loader.fadeOut(300);
                    objChart.series=[];
                    for (var i=0;i<jdata.len*2;i+=2)
                    {
                        objChart.series.push({name:jdata.dat[i],data:jdata.dat[i+1]});
                    }
                    Highcharts.stockChart('chart_id',objChart);
};
var ajaxSet={
    'graf':dateSet,
    'jump':dateSet,
    'crisis':function(jdata){
                    loader.fadeOut(300);
                    objChart.series=[];
                    for (var i=0;i<jdata.len*2;i+=2)
                    {
                        objChart.series.push({name:jdata.dat[i],data:jdata.dat[i+1]});
                    }
                    var color='rgba(0,172,204,1)';
                    var sp=''
                    var interval=$('footer div:first-child p:last-child');
                    for (var i=0; i<jdata.dat[2].length;i++){
                        sp+='<span style="background-color:'+color+';">';
                        color == 'rgba(0,172,204,1)' ? color='rgba(0,172,0,1)': color='rgba(0,172,204,1)';
                        for (var j=0;j<jdata.dat[2][i].length;j++){
                            sp+=jdata.dat[2][i][j]+', ';
                        }
                        sp+='</span>';
                        interval.append(sp);
                        sp='';
                    }

                    for (i=0;i< jdata.dat[3].length;i++){
                        sp+=jdata.dat[3][i][0]+'-'+jdata.dat[3][i][1]+"="+jdata.dat[3][i][2]+'<br/> ';
                    }
                    $('footer div:last-child p:last-child').html(sp);
                    Highcharts.stockChart('chart_id',objChart);
    },
    'couple':pointSet,
};
var objAjax={
                dataType:'json',
                timeout:50000,
                error:function(e){
                    loader.fadeOut(300);
                    alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз ');
                    },
                async: false,
            };

$(document).ready(function() {///////////////////////////////////////////////////////////////////////////////////////////////////////////////

   var a=[1,2,3,4,5,6,7,8,7,5,5,3,3,5,65];

  // dateChart.series=[];
  // dateChart.series.push({data:a});
 //  Highcharts.stockChart('chart_id',dateChart);
 //  bredota();
 //  $('nav ul li input').bind('click',bredota);

    work();
    update_select(); // Засунуть в выпадающее списки доступные валюты
    $('nav ul li input[name=selector]').bind('click',update_select); /// смена валюты обновляет выпадающие списки попарного сравнения
    $('nav ul li input').bind('click',work);                         ///  обновление графика
    $('nav ul select').bind('change',delete_option);             ///   удалять из соседнего выпадающего списка


});
//
function work(){

    restructuring();   // выдвигает панель слева для кризиса
    bredota();
    $('footer div:first-child p:last-child').html(''); // удаляет говно  с левой панели кризиса
    $('footer div:last-child p:last-child').html(''); // удаляет говно  с левой панели кризиса
    if($('nav ul li input.para:checked').length)
    {
        if($('select option[value]:selected').length!=2) // На тот случай если мы кликнули только по одному в. списку(деньги или график), то игнорим, пока не появится второй
            return
        else
           $('nav ul li input.para').attr('data-index',$('select[name=cur1]').val()+'_'+$('select[name=cur2]').val());   ///couple/RUB+RUB
    }
    currency = $('nav input[name=selector]:checked');
    chart = $('nav input[name=selector2]:checked');
    var d_i='';
    if(chart.attr('data-index')){
        d_i=chart.attr('data-index')+'/'
    }
    objAjax.url='/'+chart.attr('id')+'/'+d_i+currency.attr('id');
    objChart={}
    for(var key in settings[chart.attr('id')]){
        objChart[key]=settings[chart.attr('id')][key];
    }
    objAjax.success=ajaxSet[chart.attr('id')];

  loader.fadeIn(300,function(){
                   $.ajax(objAjax)});
    update_select();


}

function update_select(){
    currency = $('nav input[name=selector]:checked');
    var objAjaxSelect={
                timeout:1000,
                async: false,
                error:function(e){
                    alert('Произошла какая-то ошибка. Ну хз, попробуйте еще раз2 ');
                    },
                success: function(data){

                    $('.select_currency').html(data);
                },
            };
    objAjaxSelect.url='/update_select/'+currency.attr('id');
    $.ajax(objAjaxSelect);
}

function delete_option(obj){

    var self=$(this);
    var valSelf=self.val();
    var context=$('nav ul select').not(self);
    var contextVal=context.val();
    update_select();
            self.val(valSelf);
            context.val(contextVal);
            $('option[value='+self.val()+']',context).remove();
    if($('select option[value]:selected').length==2 && $('nav ul li input.para:checked').length)
        work();
    $('select').css('background-color','white');
    $('select option[value]:selected').each(function(){
        $(this).parent('select').css('background-color','#FFDD00');
    });
}



    function restructuring(){
                if($('#crisis:checked').length==0 )
                {
                    $('footer').css({'width':'0%'});
                    $('#chart_id').css({'width':'100%'});

                    $('footer div:first-child p:last-child').html('');
                    $('footer div:last-child p:last-child').html('');
                }else{
                    $('footer').css({'width':'20%'});
                    $('#chart_id').css({'width':'80%'});
                }

    }


function bredota(){
    $('.bred').fadeOut(300);
    var i=$('nav ul li input[name="selector2"]:checked');
    $('nav ul li ').removeClass('actv');   // это нужно для перемещения  выпадающих списков
    i.parent('li').addClass('actv');
    $('.bred[id="B'+i.attr('id')+'"]').fadeIn(700);


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


