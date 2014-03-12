---
layout: post
title: "互联网金融"
categories:
- articles
comments: true
tags: [finance]
---

余额宝
-----
- 基金代码: 000198
- 基金简称: 天虹增利宝
- 最新净值趋势: 

<div id="alipay_trend_container" style="width:100%; height:400px;"></div>

百度百发
------
- 基金代码: 000486
- 基金简称：嘉实1个月理财债券E
- 累计净值趋势: (定期基金无最新净值)

<div id="baidu_trend_container" style="width:100%; height:400px;"></div>

<script src="http://code.highcharts.com/stock/highstock.js"></script>
<script src="http://code.highcharts.com/stock/modules/exporting.js"></script>
<script type="text/javascript" >
<!--//
$(function() {
	var fundTrendChart = function(container,funds,col){
		var seriesOptions = [],
			 yAxisOptions = [],
			 seriesCounter = 0
			// names = ['MSFT', 'AAPL', 'GOOG'],
			// funds = [
			// 		{code:'000198',name:"余额宝",fund_name:"天虹增利宝"},
			// 		//{code: '000486',name:"百度百发",fund_name:"嘉实1个月理财债券E"}
			// 	]
			
			colors = Highcharts.getOptions().colors;
			$.each(funds, function(i, fund) {
				$.getJSON('http://wbshub.herokuapp.com/proxy?callback=?&url=http%3A%2F%2Fwiapi.hexun.com%2Ffund%2Ffundtrend.php%3Fcode%3D'+fund.code+'%26c%3D100000',	function(data) {
		             seriesOptions[i] = {
						name: fund.name+"("+fund.fund_name+":"+fund.code+")",
						data: []
					};
					// reorder
		         var len = data.doc.data.length;
		         for(var _i=len-1;_i>=0;_i--){
		             seriesOptions[i].data[len-1-_i]=[new Date(data.doc.data[_i].enddate).getTime(),parseFloat(data.doc.data[_i][col])];
		         }    
					seriesCounter++;
					if (seriesCounter == funds.length) {
						createChart(container);
					}
				});
			});

		// create the chart when all data is loaded
		function createChart(container) {
	        console.log(seriesOptions);
			$(container).highcharts('StockChart', {
			    chart: {
			    },
			    rangeSelector: {
			        selected: 4
			    },
			    yAxis: {
			    	labels: {
			    		formatter: function() {
			    			return "<br/>"+this.value;	
	               }
			    	},
			    	plotLines: [{
			    		value: 0,
			    		width: 2,
			    		color: 'silver'
			    	}]
			    },
			    plotOptions: {
			    	series: {
			    		// compare: 'percent'
			    	}
			    },
			    tooltip: {
			    	pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',
			    	valueDecimals: 4
			    },
			    series: seriesOptions
			});
		}
	}
	fundTrendChart("#alipay_trend_container",[{code:'000198',name:"余额宝",fund_name:"天虹增利宝"}],"netvalue");
	fundTrendChart("#baidu_trend_container",[{code: '000486',name:"百度百发",fund_name:"嘉实1个月理财债券E"}],'unitnetvalue');
});
-->
</script>