import React, { useRef, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const CourseEnrollmentsChart = ({ dataSeries = [], categories = [] }) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Efek ini memastikan grafik hanya dirender setelah kontainer memiliki lebar yang valid
  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      setIsReady(true);
    }
  }, []);

  const options = {
    chart: { 
      type: "area", 
      background: "transparent", 
      toolbar: { show: false },
      // 👇 INI ADALAH KUNCI UNTUK MENGHILANGKAN ERROR NULL NODE
      animations: { enabled: false } 
    },
    colors: ["#3b82f6"],
    fill: { 
      type: "gradient", 
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1 } 
    },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    theme: { mode: "dark" },
    xaxis: {
      categories: categories,
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
    name: "Enrollments", 
    data: dataSeries 
  }];

  return (
    <div ref={containerRef} className="w-full h-[250px]">
      {isReady ? (
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
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

export default CourseEnrollmentsChart;