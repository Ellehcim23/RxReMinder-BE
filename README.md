# RxReMinder

Please see the [RxReMinder-FrontEnd repo](https://github.com/kacyphan7/RxReMinder-FrontEnd) for full project details.
## Authentication

RxReMinder Backend provides authentication mechanisms to secure the API and ensure that only authorized users can access sensitive routes. Currently, the API uses JSON Web Tokens (JWT) for authentication.

***

## Installation

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

***

## Usage

### Routes
- `/users` - User management routes (authentication, registration, etc.)
- `/prescriptions` - CRUD operations for prescriptions
- `/medications` - CRUD operations for doses
- `/doses` - CRUD operations for doses

#### Sample Array of Medications List for Database
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

### Project Structure
- `/controllers` - Route handlers
- `/models` - Mongoose schema models
- `/config` - Configuration files
- `/routes` - API route definitions

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