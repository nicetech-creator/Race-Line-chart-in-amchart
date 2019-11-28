import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import dark from "@amcharts/amcharts4/themes/dark"
//am4core.useTheme(am4themes_animated);
am4core.useTheme(dark);

class App extends Component {
  componentDidMount() {

    var data = {
        70: [40, 50],
        71: [50, 50],
        72: [49, 40],
        73: [48, 52],
        74: [47, 53],
        75: [46, 54],
        76: [45, 55],
        77: [50, 50]
    }

    var vmax = Number.MIN_VALUE
    var vmin = Number.MAX_VALUE
    var ymax = Number.MIN_VALUE
    var ymin = Number.MAX_VALUE

    Object.entries(data).forEach(([key, value]) => {
        let y = parseInt(key)
        if (y < ymin) ymin = y
        if (y > ymax) ymax = y
        if (value[0] < vmin) vmin = value[0]
        if (value[1] < vmin) vmin = value[1]
        if (value[0] > vmax) vmax = value[0]
        if (value[1] > vmax) vmax = value[1]
    });

    //constants
    var delta1 = -0.02
    var delta2 = 0.02
    var deltax = 0.025



    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.colors.list = [
      am4core.color("#2b68a1"),
      am4core.color("#deaf5b"),
    ];

    chart.data = [{
        "year" : ymin,
        "vote1" : data[ymin][0],
        "vote2" : data[ymin][1]
    }
    ]

    let yearAxis = chart.xAxes.push(new am4charts.ValueAxis());
    yearAxis.min = ymin
    yearAxis.max = ymax
    // yearAxis.strictMinMax = true
    // yearAxis.renderer.grid.template.disabled = true
    let voteAxis = chart.yAxes.push(new am4charts.ValueAxis());
    voteAxis.min = vmin
    voteAxis.max = vmax
    // voteAxis.strictMinMax = true;
    voteAxis.renderer.labels.template.adapter.add("text", function(text) {
      return text + "%";
    });

    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "vote1";
    series1.dataFields.valueX = "year";
    series1.strokeWidth = 4;
    series1.tensionX = 1;
    series1.tensionY = 1;
    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "vote2";
    series2.dataFields.valueX = "year";
    series2.strokeWidth = 4;
    series2.tensionX = 1;
    series2.tensionY = 1;

    // bullet at the front of the line
    let bullet = series1.createChild(am4charts.Bullet);
    let image = bullet.createChild(am4core.Image);
    image.href = "1.png";
    image.width = 30;
    image.height = 30;
    image.horizontalCenter = "right";
    image.verticalCenter = "middle";
    let label = bullet.createChild(am4core.Label);
    label.text = "d"
    label.width = 60
    label.height = 30
    label.strokeColor = "#fff"
    label.fontSize = 20
    label.strokeWidth = 1

    let bullet2 = series2.createChild(am4charts.Bullet);
    let image2 = bullet2.createChild(am4core.Image);
    image2.href = "1.png";
    image2.width = 30;
    image2.height = 30;
    image2.horizontalCenter = "right";
    image2.verticalCenter = "middle";
    let label2 = bullet2.createChild(am4core.Label);
    label2.text = "d"
    label2.width = 60
    label2.height = 30
    label2.strokeColor = "#fff"
    label2.fontSize = 20
    label2.strokeWidth = 1


    label.horizontalCenter = "left";
    label.verticalCenter = "middle";

    console.log('lable', label)
    // var valueLabel = series1.bullets.push(new am4charts.LabelBullet());
    // valueLabel.label.text = "Hello";
    // valueLabel.label.fontSize = 20;

    series1.events.on("validated", function() {
        label.text = "" + Math.round(series1.dataItems.last.valueY) + " CDU"
        bullet.moveTo(series1.dataItems.last.point);
        bullet.validatePosition();
    });

    series2.events.on("validated", function() {
        label2.text = "" + Math.round(series2.dataItems.last.valueY) + " SPD"
        bullet2.moveTo(series2.dataItems.last.point);
        bullet2.validatePosition();
    });


    var interval;



    function startInterval() {
        interval = setInterval(function() {
            var lastdataItem = series1.dataItems.getIndex(series1.dataItems.length - 1);
            var lastdataItem2 = series2.dataItems.getIndex(series1.dataItems.length - 1);
            if (lastdataItem.valueX >= ymax) {
                chart.data = [{
                    "year" : ymin,
                    "vote1" : data[ymin][0],
                    "vote2" : data[ymin][1]
                }
                ]
                delta1 = (data[ymin + 1][0] - data[ymin][0]) / 40;
                delta2 = (data[ymin + 1][1] - data[ymin][1]) / 40;
                return
            }
            delta1 = (data[Math.floor(lastdataItem.valueX) + 1][0] - data[Math.floor(lastdataItem.valueX)][0]) / 40
            delta2 = (data[Math.floor(lastdataItem.valueX) + 1][1] - data[Math.floor(lastdataItem.valueX)][1]) / 40
            let newVal1 = lastdataItem.valueY + delta1
            let newVal2 = lastdataItem2.valueY + delta2
            chart.addData(
                { year: lastdataItem.valueX + 0.025, vote1: newVal1, vote2: newVal2 },
                0
            );
        }, 40);
    }

    startInterval();

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default App;