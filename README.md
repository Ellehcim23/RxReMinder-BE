<p align="center">
<img src="assets/logo2.png">
</p>

## Authentication

RxReMinder Backend provides authentication mechanisms to secure the API and ensure that only authorized users can access certain routes. Currently, the API uses JSON Web Tokens (JWT) for authentication.

## Deployment
- Frontend deployed on [Netlify](https://rx-reminder.netlify.app/)
- Frontend Repo [Github](https://github.com/kacyphan7/RxReMinder-FrontEnd)
- Backend deployed on [Heroku](https://rxreminder-5f38ebd3ad7c.herokuapp.com/)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/RxReMinder-BE.git
   cd RxReMinder-BE
   ```

2. Configure environment variables:

    Create a `.env` file in the root directory with any necessary variables.

### Dependencies
- mongodb: MongoDB Driver `npm install mongodb`

- moment: Date and time manipulation `npm install moment`

- npm: `npm install`

- Luxon `npm install luxon`

- Courier API `npm install @trycourier/courier`

## Usage
### Starting the Server

To start the server, run the following command: `npm start`

## Routes
- `/users` - User management routes (authentication, registration, etc.)
- `/prescriptions` - CRUD operations for prescriptions
- `/medications` - CRUD operations for doses
- `/doses` - CRUD operations for doses

### Sample Array of Medications List for Database
```
const painRelievers = [
  {
    medicationName: "Ibuprofen",
    directions: "Take with food to avoid stomach upset."
  },
  {
    medicationName: "Acetaminophen",
    directions: "Do not exceed recommended dose. Avoid alcohol."
  }
];

console.log(painRelievers);
```

### Code Snip for Notifications 
```
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
        let userOffset = dose.user.timezone;
        let serverOffset = DateTime.local().offset / -60;
        let myOffset = serverOffset - userOffset;
        let time = DateTime.fromJSDate(dose.time).plus({ days: myOffset}).toFormat('h:mm a');
        let date = DateTime.fromJSDate(dose.time).toFormat('ccc, LLL dd');

        console.log(email, name, medication, time, date, userOffset, serverOffset, myOffset);
       }
      process.exit(0);
    }
}

sendNotifications();
```

### Doses
```
async function randomlyTakeDoses() {
    let doses = await Dose.find({ user: '64d47c661806b140baabaf0c'});
    console.log(doses.length);

    let oldDoses = doses.filter(dose => dose.time < new Date());
    console.log(oldDoses.length);

    
    for (let i = 0; i < oldDoses.length; i++) {
        const random = Math.random();
        if (random > 0.5) {
            oldDoses[i].taken = true;
            await oldDoses[i].save();
        }
    }

    for (let i = 0; i < oldDoses.length; i++) {
        console.log(oldDoses[i].taken);
    }
}
```

## Project Structure
- `/controllers` - Route handlers
- `/models` - Mongoose schema models
- `/config` - Configuration files
- `/routes` - API route definitions

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