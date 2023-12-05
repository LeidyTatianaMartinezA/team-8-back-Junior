import mongoose from 'mongoose';

class Database {

  constructor() {
    //mongodb connection
    this.db = mongoose
      .connect(process.env.DB_URI)
      .then(() => console.log('Connected to MongoDB Atlas'))
      .catch((error) => console.error(error));
  }

}

export { Database as default }