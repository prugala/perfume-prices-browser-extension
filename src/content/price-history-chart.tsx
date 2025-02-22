import React, { useEffect, useState } from "react";
import { Perfumehub } from "../provider/perfumehub";
import { Size } from "../model/size";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns';
import {DeepPartial} from "chart.js/types/utils";
import moment from "moment/moment";
import "moment/locale/pl";

import "chartjs-adapter-moment";
import { PeriodRange } from "../enum/period-range";

moment.locale(chrome.i18n.getUILanguage())

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
)

interface PriceHistoryChartProps {
  searchData: Size
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = (props) => {
  const [renderState, setRenderState] = React.useState(Math.random());
  const provider = new Perfumehub
  const period = PeriodRange.year


  useEffect(() => {
    provider.getPriceHistory(props.searchData, period)
      .then((response) => {
        data.datasets[0].data = response;
        setData(data)
        setRenderState(Math.random());
      })
  }, [])

  const options: DeepPartial<any> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.raw.price + provider.getCurrency() + ' ' + context.raw.shopNameReal;
          }
        }
      }
    },
    offset: true,
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'price'
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      }
    }

  };

  const [data, setData] = useState({
    datasets: [{
      label: chrome.i18n.getMessage("price_history"),
      data: [],
      borderColor: '#63bbff',
      backgroundColor: '#63bbff',
    },]
  })

  return (
    <Line key={renderState} options={options} data={data} />
  )
}

export default PriceHistoryChart
