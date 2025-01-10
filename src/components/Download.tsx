"use client";
import { FileDown } from "lucide-react";
import { MutableRefObject, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Define props for the component
interface DownloadProps {
  timeTableRef: MutableRefObject<HTMLDivElement | null>;
}

const Download: React.FC<DownloadProps> = ({ timeTableRef }) => {

  const [loading,setLoading]=useState<boolean>(false);
  const downloadPDF = useCallback(() => {
    setLoading(true)
    const element = timeTableRef.current;
    if (typeof window !== "undefined" && element) {
      const html2pdf = require("html2pdf.js");
      const options = {
        margin: [4, 4, 4, 4], // Set margin if needed
        filename: "timetable.pdf",
        image: { type: "png", quality: 1 },
        html2canvas: { scale: 2 }, // Increase scale for better quality
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      html2pdf()
        .from(element) // Convert the content from the ref
        .set(options) // Apply settings
        .save(); // Download the PDF
    }

    setLoading(false);
  }, [timeTableRef]);

  return (
    <button
      className="w-[160px] h-[40px] flex justify-center items-center gap-2 font-semibold bg-[#031b4e] text-white rounded-md hover:bg-[#031b4eaf] cursor-pointer"
      aria-label="Download timetable as PDF"
      onClick={downloadPDF}
    >
      <FileDown /> <p>{loading?"Downloading...":"Download"}</p>
    </button>
  );
};
export default dynamic(() => Promise.resolve(Download), { ssr: false });
