import axios from "axios";



export default async function recalculatePrescription (req, res) {
    console.log('recalculatePrescription--------backend')
const prescriptionDTO = {...req.body};
// const result = await axios.post("api/excelRecalculator", prescriptionDTO)
const result1 = await axios.post(
  /* 'https://kleanxslm.herokuapp.com/file_process_v2', */
  /* 'http://localhost:3005/file_process_v2', */
    'https://kleanxslm.herokuapp.com/file_process_v2',
    { prescriptionDTO },
    {
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        // See: http://bit.ly/text-json
        "content-type": "application/json",
      },
    }
  );
  console.log("Seerver Excel Answer ");
  let data = await result1.data;
  let week1original = data.week1.split(" ")
  let week2original = data.week2.split(" ")
  let week3original = data.week3.split(" ")
  let week4original = data.week4.split(" ")
  let week1 = data.week1.split(" ").splice(6, data.week1.split(" ").length);
  console.log('length',week1.length)
  if(week1.length===10){
    week1.unshift("Durante")
  }
  week1[4]="suministrar"
  if(week1[5]>1){
    week1[6]="gotas"

  }
  let week2 = data.week2.split(" ").splice(6, data.week2.split(" ").length);
  if(week2.length===10){
    week2.unshift("Durante")
  }
  week2[4]="suministrar"
  if(week2[5]>1){
    week2[6]="gotas"
  }
  
  let week3 = data.week3.split(" ").splice(6, data.week3.split(" ").length);
  if(week3.length===10){
    week3.unshift("Durante")
  }

  week3[4]="suministrar"
  if(week3[5]>1){
    week3[6]="gotas"
  }
  
  let week4 = data.week4.split(" ").splice(6, data.week4.split(" ").length);
  if(week4.length===10){
    week4.unshift("Durante")
  }
  week4[4]="suministrar"
  if(week4[5]>1){
    week4[6]="gotas"
  }
  console.log("original 1",week1original,"edited",week1)
  console.log("original 2",week2original,"edited",week2)
  console.log("original 3",week3original,"edited",week3)
  console.log("original 4",week4original,"edited",week4)
  week1.unshift("Suministrar")
  week2.unshift("Suministrar")
  week3.unshift("Suministrar")
  week4.unshift("Suministrar")
  week1[5]=""
  week2[5]=""
  week3[5]=""
  week4[5]=""
  week1[1]="durante"
  week2[1]="durante"
  week3[1]="durante"
  week4[1]="durante"
  data.week1 = week1.join(" ")
  data.week2 = week2.join(" ")
  data.week3 = week3.join(" ")
  data.week4 = week4.join(" ")

return res.status(200).json({data});
}

