<p align="center">
<img src="./assets/logo2.png">
</p>

# About
RxReMinder is a web application that helps users manage their medications. The application provides a variety of features, including:

- A prescription management system that allows users to track their prescriptions and set recurring reminders for medication doses.
- A user-driven medication database that provides classification and directions specific to medications.
- A dose tracking system that allows users to track upcoming, taken, and missed doses.
- A notification system that reminds users via email when it's time to take their medications.

RxReMinder is under development, but has the potential to be a valuable tool for anyone who takes medications. The application is easy to use and provides a variety of features that can help users stay on top of their medication.

## **Built With**
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NODE.JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## Deployment
- Frontend deployed on [Netlify](https://rx-reminder.netlify.app/)
- Backend deployed on [Heroku](https://rxreminder-5f38ebd3ad7c.herokuapp.com/)
- Frontend Github Repo [Github](https://github.com/kacyphan7/RxReMinder-FrontEnd)
- Backend Github Repo [Github](https://github.com/Ellehcim23/RxReMinder-BE)

***

## Getting Started

### Prerequisites
* Node.js
* MongoDB database - local install or [Mongo Atlas](http://mongodb.com/atlas)
* A [Courier](https://app.courier.com/) API key

### Backend
1. `fork` and `clone` the [RxReMinder-BE](https://github.com/Ellehcim23/RxReMinder-BE) repository.
```zsh
git clone https://github.com/your-username/RxReMinder-BE.git
cd RxReMinder-BE
```
2. Install dependencies.
```zsh
npm install
```
3. Create a `.env` file in the repository root and add the follow environment variables:
```
MONGO_URI=insert-your-database-uri-here
JWT_SECRET=secret-key-of-your-choice
COURIER_KEY=your-courier-api-key-here
```
4. Start the backend server.
```zsh
npm run dev
```

### Database seeding (optional)
* Use the following command to pre-load your database with a provided collection of common medications.
```zsh
node seeders/medications.js
```

### Frontend
1. `fork` and `clone` the [RxReMinder-FrontEnd](https://github.com/kacyphan7/RxReMinder-FrontEnd) repository.
```zsh
git clone https://github.com/your-username/RxReMinder-FrontEnd
cd RxReMinder-FrontEnd
```
2. Install dependencies.
```zsh
npm install
```
3. Create a `.env` file in the repository root and add the following environment variable:
```
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```
4. Start the frontend server.
```zsh
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) with your web browser to experience the app.

### Notification Engine
* Set up a recurring engine to run `node notifications.js` on the backend server.
* The deployed version of RxReMinder uses `Heroku Scheduler` for this purpose.
* Alternatives include `Netlify Functions` or simply `cron` where allowed.

***

## Routes
- `/users` - User management routes (authentication, registration, etc.)
- `/prescriptions` - CRUD operations for prescriptions
- `/medications` - CRUD operations for doses
- `/doses` - CRUD operations for doses

## Project Structure
- `/controllers` - Route handlers
- `/models` - Mongoose schema models
- `/config` - Configuration files
- `/routes` - API route definitions

***

# Code Snippets

## Seeding Database with Medications
```
const painRelievers = [
  {
    medicationName: "Ibuprofen",
    directions: "Take with food to avoid stomach upset."
  },
  {
    medicationName: "Acetaminophen",
    directions: "Do not exceed recommended dose. Avoid alcohol."
  },
  ...
];
...
async function seedMedications() {
    await Medication.deleteMany({});

    for (let i = 0; i < painRelievers.length; i++) {
        const newMedication = new Medication({
            name: painRelievers[i].name,
            directions: painRelievers[i].directions,
            category: "Pain Reliever"
        });
        await newMedication.save();
    }
...
}
```

## Notification Engine
```
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
```

## Creating a New Prescription
```
router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        const { medId, freq, time1, time2, quantity, startDate, endDate, notes, timezone } = req.body;

        let firstTime1, firstTime2;
        const dose1Times = [];
        const dose2Times = [];
        const numDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').toObject().days;

        firstTime1 = DateTime.fromISO(`${startDate}T${time1}-0${timezone}:00`);
        if (freq === 'twice') firstTime2 = DateTime.fromISO(`${startDate}T${time2}-0${timezone}:00`);

        switch (freq) {
            case 'twice':
                for (let i = 0; i < numDays; i++) {
                    dose2Times.push(DateTime.fromISO(firstTime2).plus({ days: i }).toISO());
                }
            case 'once':
                for (let i = 0; i < numDays; i++) {
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
            case 'alternate':
                for (let i = 0; i < numDays; i += 2) {
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
            case 'weekly':
                for (let i = 0; i < numDays; i += 7) {
                    dose1Times.push(DateTime.fromISO(firstTime1).plus({ days: i }).toISO());
                }
                break;
        }

        let user = await User.findById(userId);
        let med = await Medication.findById(medId);

        const newPrescription = new Prescription({
            user: user,
            medication: med,
            quantity: quantity,
            notes: notes,
        });
        user.prescriptions.push(newPrescription);
        await user.save();


        for (let i = 0; i < dose1Times.length; i++) {
            const newDose = new Dose({
                user: user,
                prescription: newPrescription,
                medication: med,
                time: dose1Times[i],
            });
            await newDose.save();
            newPrescription.doses.push(newDose);

            if(freq === 'twice') {
                const newDose = new Dose({
                    user: user,
                    prescription: newPrescription,
                    medication: med,
                    time: dose2Times[i],
                });
                await newDose.save();
                newPrescription.doses.push(newDose);
            }
        }

        const savedPrescription = await newPrescription.save();
        const lookupPrescription = await Prescription.findById(savedPrescription._id);

        res.status(201).json({ message: 'Prescription created successfully.', prescription: lookupPrescription });
    } catch (error) {
        res.status(500).json({ message: 'Error creating prescription.', error });
    }
});
```

***

# License 
The source code for the site is licensed under the MIT license, which you can find in the MIT-LICENSE.txt file.

<h2 align="center">Authors</h2>

<div align="center">
  <a href="https://github.com/darkartaudio">
    <img src="https://avatars.githubusercontent.com/u/122388609?v=4"
      alt="Contributors"
      width="15%" />
  </a>
   <a href="https://github.com/Ellehcim23">
    <img src="https://avatars.githubusercontent.com/u/125413734?v=4"
      alt="Contributors"
      width="15%" />
  </a>
    <a href="https://github.com/kacyphan7">
    <img src="https://avatars.githubusercontent.com/u/125235721?v=4"
      alt="Contributors"
      width="15%" />
  </a>
   <a href="https://github.com/sp1441">
    <img src="https://avatars.githubusercontent.com/u/125446289?v=4"
      alt="Contributors"
      width="15%" />
  </a>
</div>