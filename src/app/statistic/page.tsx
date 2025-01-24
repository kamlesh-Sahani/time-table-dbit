"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const StatisticsPage = () => {
  const [statisticsData, setStatisticsData] = useState<any>({
    totalTeacher: 0,
    totalPeriods: 0,
    data: {},
  });
  const { toast } = useToast();
  const fetchSatisticData = async () => {
    try {
      const response = await fetch("/api/statistic");
      const data = await response.json();
      setStatisticsData(data.statisticData);
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the slot.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchSatisticData();
  }, []);

  const teacherClassData = {
    labels: Object.keys(statisticsData?.data),
    datasets: [
      {
        label: "Periods Assigned",
        data: Object.values(statisticsData?.data),
        backgroundColor: "#4B3F72",
      },
    ],
  };

  return (
    <div className="p-5 flex flex-col justify-center items-center gap-5 animeFont">
      <h1 className="text-3xl font-semibold text-center mb-10 animeFont">
        Timetable Statistics
      </h1>
      <div className="flex gap-10 justify-center items-center mb-10 m-auto flex-wrap">
        <div className="w-[300px] p-4 bg-gray-100 rounded-md shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Teachers</h2>
          <p className="text-3xl font-bold">{statisticsData.totalTeacher}</p>
        </div>
        <div className="w-[300px] p-4 bg-gray-100 rounded-md shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Periods</h2>
          <p className="text-3xl font-bold">{statisticsData.totalPeriods}</p>
        </div>
      </div>
      <div className="mb-10 w-full">
        <h2 className="text-2xl font-semibold text-center mb-5">
          Teacher-wise Periods Distribution
        </h2>
        <div className="w-full flex justify-center">
          <Bar data={teacherClassData} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
