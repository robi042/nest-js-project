import fs from 'fs'
const publicDir = process.env.publicDir
export const SecondDiffBetweenToDates = ( date1, date2 = Date.now()) =>{

    var t2 = new Date(date1);
    var t1 = new Date(date2);
    var dif = t2.getTime() - t1.getTime();
    var Seconds_from_T1_to_T2 = dif / 1000;

   return Math.floor(Seconds_from_T1_to_T2);

}



export const base64fileUpload= (image, ext) => {
        let data = image.split(';base64,')
        let buff = Buffer.from(data[1], 'base64')
        let initialUrl = `/file${Date.now()}.${ext}`
        fs.writeFileSync(`./${publicDir}/${initialUrl}`, buff)
        return `${process.env.host}/${initialUrl}`
      }

export const validateEmail= (email) => {
        var re = /\S+@\S+\.\S+/
        return re.test(email)
}
      

export const secondDiffBetweenTwoDateTimes = (dateTimes) => (( new Date(dateTimes).getTime() - new Date().getTime()) / 1000)
    
export const  validateNumber= (MSISDN) => {
        var length = MSISDN.toString().length
        if (length == 11) {
          return true
        } else {
          return false
        }
      }