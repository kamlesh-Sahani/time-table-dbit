import { NextResponse } from "next/server";
import Timetable from "@/models/Timetable";
export async function GET() {
  try {
    const timetable: any = await Timetable.find({}).select(
      "data.teacher data.subject"
    );

    const statisticData = new Map();

    for (let k = 0; k < timetable?.length; k++) {
      for (let i = 0; i < timetable[k]?.data?.length; i++) {
        for (let j = 0; j < timetable[k]?.data[i].length; j++) {
          const classData = timetable[k]?.data[i][j];

          if (statisticData.has(classData.teacher)) {
            const periods = statisticData.get(classData.teacher);
            statisticData.set(classData.teacher, periods + 1);
          } else {
            statisticData.set(classData.teacher, 1);
          }
        }
      }
    }

    const statistic: any = {};
    const ObjData: any = Object.fromEntries(statisticData);
    statistic.data = ObjData;

    statistic.totalTeacher = Object.keys(ObjData).length;
    let totalPeriods = 0;
    Object.values(ObjData).forEach((p) => {
      totalPeriods += p as number;
    });
    statistic.totalPeriods = totalPeriods;
    return NextResponse.json({
      statisticData: statistic,
      message: "successfuly  get",
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
