const express=require('express');
const bodyParser=require('body-parser');
const {PORT}=require('./config/serverConfig');
const jobs=require('./utils/job');
const TicketController=require('./controllers/ticket-controller');
const {createChannel,subscribeMessage}=require('./utils/messageQueue');
const {REMINDER_BINDING_KEY}=require('./config/serverConfig');
const EmailService=require('./services/email-service');
const setupAndStartServer=async ()=>{
    const channel=await createChannel();
    subscribeMessage(channel,EmailService.subscribeEvents,REMINDER_BINDING_KEY);
    const app=express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.post('/api/v1/tickets',TicketController.create);
    app.listen(PORT,()=>{
        console.log(`Server started at PORT ${PORT}`);
        jobs();
       /* sendBasicEmail(
            "support@admin.com",
            'reminderservice14@gmail.com',
            "this is a testing email",
            "how are you"
        );
        */
    });
}

setupAndStartServer();
