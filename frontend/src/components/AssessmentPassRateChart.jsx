import React, { useRef, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const AssessmentPassRateChart = ({ dataSeries = [], categories = [] }) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Mencegah error "negative width"
  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      setIsReady(true);
    }
  }, []);

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      //INI ADALAH KUNCI UNTUK MENGHILANGKAN ERROR NULL NODE
      animations: { enabled: false }
    },
    colors: ["#10b981"], // Warna hijau
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "40%" },
    },
    dataLabels: { enabled: false },
    theme: { mode: "dark" },
    xaxis: {
      // Menggunakan data dari Backend (props) jika ada, jika tidak pakai fallback
      categories: categories.length > 0 ? categories : ["Exam A", "Exam B", "Exam C", "Exam D"],
      labels: { style: { colors: "#94a3b8" } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: "#94a3b8" } }
    },
    grid: { 
      borderColor: "#1e293b",
      strokeDashArray: 4 
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const series = [{ 
    name: "Pass Rate (%)", 
    // Menggunakan data dari Backend (props) jika ada
    data: dataSeries.length > 0 ? dataSeries : [85, 72, 90, 65] 
  }];

  return (
    <div ref={containerRef} className="w-full h-[250px]">
      {isReady ? (
        <ReactApexChart 
          options={options} 
          series={series} 
          type="bar" 
          height={250} 
        />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
          Menyiapkan chart...
        </div>
      )}
    </div>
  );
};

export default AssessmentPassRateChart;