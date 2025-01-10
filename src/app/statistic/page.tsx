"use client";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from "chart.js";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const StatisticsPage = () => {
  const [statisticsData, setStatisticsData] = useState<any>({
    totalTeachers: 0,
    totalClasses: 0,
    teacherClassDistribution: {},
  });

  useEffect(() => {
    setStatisticsData({
      totalTeachers: 10, // Total teachers
      totalClasses: 40,  // Total classes
      teacherClassDistribution: {
        "John Doe": 8,
        "Jane Smith": 6,
        "Sam Brown": 4,
        "Lisa White": 5,
        "Mark Black": 3,
        "Arun Sharma": 7,
        "Priya Patel": 6,
        "Rajesh Kumar": 5,
        "Sita Iyer": 4,
        "Vikram Gupta": 6,
        "Aarti Desai": 3,
        "Naveen Reddy": 7,
        "Anjali Singh": 6,
        "Sunil Joshi": 4,
        "Ravi Mehta": 5,
        "Neha Bhatia": 4,
        "Karan Kapoor": 6,
        "Ritu Verma": 5,
        "Mohit Agarwal": 3,
    }
    
    });
  }, []);




  // Data for Bar Chart (Teacher-wise class distribution)
  const teacherClassData = {
    labels: Object.keys(statisticsData.teacherClassDistribution),
    datasets: [
      {
        label: "Classes Assigned",
        data: Object.values(statisticsData.teacherClassDistribution),
        backgroundColor: "#4B3F72",
      },
    ],
  };


  return (
    <div className="p-5 flex flex-col justify-center items-center gap-5 animeFont">
      <h1 className="text-3xl font-semibold text-center mb-10 animeFont">Timetable Statistics</h1>
      <div className="flex gap-10 justify-center items-center mb-10 m-auto flex-wrap">
        <div className="w-[300px] p-4 bg-gray-100 rounded-md shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Teachers</h2>
          <p className="text-3xl font-bold">{statisticsData.totalTeachers}</p>
        </div>
        <div className="w-[300px] p-4 bg-gray-100 rounded-md shadow-md text-center">
          <h2 className="text-xl font-semibold">Total Classes</h2>
          <p className="text-3xl font-bold">{statisticsData.totalClasses}</p>
        </div>
      </div>
      <div className="mb-10 w-full">
        <h2 className="text-2xl font-semibold text-center mb-5">Teacher-wise Class Distribution</h2>
        <div className="w-full flex justify-center">
          <Bar data={teacherClassData} />
        </div>
      </div>


    
      
    </div>
  );
};

export default StatisticsPage;
