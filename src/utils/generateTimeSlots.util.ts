import moment from "moment";
const generateTimeSlots = () => {
    const slots = [];
    let startTime = moment("09:00 AM", "hh:mm A");
  
    for (let i = 0; i < 6; i++) {
      // 6 periods per day
      let endTime = moment(startTime).add(50, "minutes");
  
      slots.push({
        startTime: startTime.format("hh:mm A"),
        endTime: endTime.format("hh:mm A"),
        subject: "no data",
        teacher: [],
      });
  
      // Update start time for next slot (gap of 10 minutes)
      startTime = endTime.add(10, "minutes");
    }
    return slots;
  };


  export default generateTimeSlots;