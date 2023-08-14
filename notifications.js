require('dotenv').config();
const { DateTime } = require('luxon');
const { Dose } = require('./models');
const { CourierClient } = require('@trycourier/courier');

const courier = CourierClient({ authorizationToken: process.env.COURIER_KEY });

async function sendNotifications() {
    let doses = await Dose.find({ time: { $lt: new Date() }, taken: false, notified: false }).populate('user').populate('medication').populate('prescription');
    
    for (let i = 0; i < doses.length; i++) {
        let dose = doses[i];
        let email = dose.user.email;
        let name = dose.user.firstName;
        let medication = dose.medication.name;
        let time = DateTime.fromJSDate(dose.time).toFormat('h:mm a');
        let date = DateTime.fromJSDate(dose.time).toFormat('ccc, LLL dd');

        const { requestId } = await courier.send({
            message: {
                to: {
                    email: email,
                },
                template: "SHMMXQBH9JMGYEQ8RA1M9TNTWFNN",
                data: {
                    name: name,
                    medication: medication,
                    time: time,
                    date: date,
                },
            },
        });

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