require('dotenv').config();
const { DateTime } = require('luxon');
const { Dose } = require('./models');
const { CourierClient } = require('@trycourier/courier');

const courier = CourierClient({ authorizationToken: process.env.COURIER_KEY });

async function sendNotifications() {
    let doses = await Dose.find({ time: { $lt: new Date() }, taken: false, notified: false }).populate('user').populate('medication').sort({ time: 1 });
    
    console.log(doses.length);

    for (let i = 0; i < doses.length; i++) {
        let dose = doses[i];
        let email = dose.user.email;
        let name = dose.user.firstName;
        let medication = dose.medication.name;
        let userOffset = dose.user.timezone;
        let serverOffset = DateTime.local().offset / -60;
        let myOffset = serverOffset - userOffset;
        let time = DateTime.fromJSDate(dose.time).plus({ hours: myOffset }).toFormat('h:mm a');
        let date = DateTime.fromJSDate(dose.time).toFormat('ccc, LLL dd');

        console.log(email, name, medication, time, date, userOffset, serverOffset, myOffset);

        const { requestId } = await courier.send({
            message: {
                to: {
                    data: {
                        name: name,
                        medication: medication,
                        time: time,
                        date: date,
                    },
                    email: email,
                },
                content: {
                    title: "RxReminder Notification",
                    body: `Hi ${name}, it's ${time} on ${date}, time to take your ${medication}.\n\nhttps://rx-reminder.netlify.app`,
                },
                routing: {
                    method: "single",
                    channels: ["email"],
                },
            },
        });

        console.log(requestId);

        if(requestId) {
            console.log('Notification sent successfully');
            dose.notified = true;
            await dose.save();
        } else {
            console.log('Notification failed to send');
        }
    }
    process.exit(0);
}

sendNotifications();