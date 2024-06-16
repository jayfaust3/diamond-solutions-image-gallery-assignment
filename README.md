# Photo Gallery App

This is a simple photo gallery app where you can manage and browse your photo collection.

## Installation

To run the Photo Gallery App locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/jayfaust3/diamond-solutions-image-gallery-assignment.git
   cd diamond-solutions-image-gallery-assignment
   ```

2. Install dependencies:

    ```bash
    npm run install:all
    ```

3. Run the App:

    ```bash
    npm run start:all
    ```

Once the servers are started, you can access the app at:

Front-end (Remix): http://localhost:5173
Back-end (Express API): http://localhost:3789

**NOTE:**
The backend uses [Uploadcare](https://uploadcare.com/) and [MongoDb](https://www.mongodb.com/).

You will need to create an Uploadcare project and configure the the backend environment with UPLOADCARE_PUBLIC_KEY and UPLOADCARE_SECRET_KEY.

You will also need to create a MongoDb cluster, database and collection to hold the image metadata and configure the the backend environment with MONGODB_CLUSTER_URI, MONGODB_DB_NAME, and MONGODB_COLLECTION_NAME.

You will also need to configure the backend environment with PORT=3789, else you will need to set the backend service url in the front end proxy to hit `localhost` at port 80 (the default.)