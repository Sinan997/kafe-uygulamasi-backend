# Node.js express server for [Cafe Management](https://github.com/Sinan997/kafe-uygulamasi-frontend)

To run this project MongoDB should be installed in your computer. If it's not installed you can simply download via docker.


## How to Run
- Install mongo. You can install as below.
  - **```docker run --name mongodb --rm -d -p 27017:27017 mongo```**
- run **`yarn run dev`** command.
  - This command will install necessary packages and start the express server.
  - It will create an initial admin user.
    - `username: admin`
    - `password: 123`
