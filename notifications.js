require('dotenv').config();
const { DateTime } = require('luxon');
const { Dose } = require('./models');
const { CourierClient } = require('@trycourier/courier');

const courier = CourierClient({ authorizationToken: process.env.COURIER_KEY });

async function sendNotifications() {
    let doses = await Dose.find({ time: { $lt: new Date() }, taken: false, notified: false }).populate('user').populate('medication').sort({ time: 1 });
    
    console.log(doses.length);

    for (let i = 0; i < doses.length; i++) {
    // for (let i = 0; i < 5; i++) {
        let dose = doses[i];
        let email = dose.user.email;
        let name = dose.user.firstName;
        let medication = dose.medication.name;
        let time = DateTime.fromJSDate(dose.time).toFormat('h:mm a');
        let date = DateTime.fromJSDate(dose.time).toFormat('ccc, LLL dd');
        let offset = DateTime.fromJSDate(dose.time).offset;

        console.log(email, name, medication, time, date, offset);

        // const { requestId } = await courier.send({
        //     message: {
        //         to: {
        //             email: email,
        //         },
        //         template: "SHMMXQBH9JMGYEQ8RA1M9TNTWFNN",
        //         data: {
        //             name: name,
        //             medication: medication,
        //             time: time,
        //             date: date,
        //         },
        //     },
        // });

        // const { requestId } = await courier.send({
        //     message: {
        //         to: {
        //             data: {
        //                 name: name,
        //                 medication: medication,
        //                 time: time,
        //                 date: date,
        //             },
        //             email: email,
        //         },
        //         content: {
        //             title: "RxReminder Notification",
        //             body: `Hi ${name}, it's ${time} on ${date}, time to take your ${medication}.\n\nhttps://rx-reminder.netlify.app`,
        //         },
        //         routing: {
        //             method: "single",
        //             channels: ["email"],
        //         },
        //     },
        // });

        // console.log(requestId);

        // if(requestId) {
        //     console.log('Notification sent successfully');
        //     dose.notified = true;
        //     await dose.save();
        // } else {
        //     console.log('Notification failed to send');
        // }
    }
    process.exit(0);
}

sendNotifications();