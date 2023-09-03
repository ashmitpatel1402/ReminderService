const cron=require('node-cron');
const emailService=require('../services/email-service');
const sender=require('../config/email-config');

const setupJobs=()=>{
    cron.schedule('*/2 * * * *',async ()=>{
         const response=await emailService.fetchPendingEmails();
         response.forEach((email) => {
            sender.sendMailMail({
                from:"reminderService@gmail.com",
                to:email.recepientEmail,
                subject:email.subject,
                text:email.content,
            },async(err,data)=>{
                   if(err){
                    console.log("err");
                   }
                   else{
                    console.log(data);
                    await emailService.updateTicket(email.id,{status:"Success"});
                   }
            
            });
            
         });
         //console.log(response);
    });
}

module.exports=setupJobs;