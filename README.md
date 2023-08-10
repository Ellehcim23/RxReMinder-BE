# RxReMinder 
## Authentication

RxReMinder Backend provides authentication mechanisms to secure the API and ensure that only authorized users can access certain routes. Currently, the API uses JSON Web Tokens (JWT) for authentication.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/RxReMinder-BE.git
   cd RxReMinder-BE
   ```

2. Configure environment variables:

    Create a `.env` file in the root directory with any necessary variables.

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

## Dependencies
- mongodb: MongoDB Driver `npm install mongodb`

- moment: Date and time manipulation `npm install moment`

- notification API

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