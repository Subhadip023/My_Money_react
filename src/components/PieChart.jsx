import { useEffect, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function PieChart({ data = [], title = "Account Breakdown" ,showTotal = true }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const chartData = data.length > 0 ? data : [{ name: 'No Data', y: 1 }];

  const options = {
    chart: {
      backgroundColor: "transparent",
      type: "pie",
      custom: {},
      events: {
        render() {
          const chart = this;
          const series = chart.series[0];

          let customLabel = chart.options.chart.custom.label;

          const total = data.reduce((sum, p) => sum + p.y, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

          if (!customLabel ) {
            customLabel = chart.options.chart.custom.label =
              chart.renderer
                .label(`Total<br/><strong>${data.length > 0 && showTotal ? total : '₹0'}</strong>`)
                .css({
                  color: "#888",
                  textAnchor: "middle",
                })
                .add();
          } else {
             customLabel.attr({
               text: `Total<br/><strong>${data.length > 0 && showTotal ? total : '₹0'}</strong>`
             });
          }

          const x = series.center[0] + chart.plotLeft;
          const y =
            series.center[1] +
            chart.plotTop -
            customLabel.attr("height") / 2;

          customLabel.attr({ x, y });

          customLabel.css({
            fontSize: `${Math.max(12, series.center[2] / 10)}px`,
          });
        },
      },
    },

    title: {
      text: title,
      style: {
          color: '#888',
          fontWeight: 'bold'
      }
    },

    tooltip: {
      pointFormat: "{series.name}: <b>₹{point.y}</b> ({point.percentage:.0f}%)",
    },

    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
            style: {
                color: '#888',
                textOutline: 'none'
            }
          },
          {
            enabled: true,
            distance: -20,
            format: "{point.percentage:.0f}%",
            style: {
                color: '#fff',
                textOutline: 'none'
            }
          },
        ],
      },
    },

    series: [
      {
        name: "Balance",
        colorByPoint: true,
        data: chartData,
      },
    ],
    credits: {
        enabled: false
    }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}