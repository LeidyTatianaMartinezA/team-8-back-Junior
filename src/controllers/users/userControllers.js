import mongoose from 'mongoose';
import Users from '../../models/userModels.js'

const MONGO_DUPLICATED_ERROR = 11000;

//Create user
export const createUsers = async (request, response) => {
  try {
    const {name, lastName, email, rol} = request.body;
    const newUser= new Users({name, lastName, email, rol});
    const userSaved = await newUser.save();
    return response.status(200).json(userSaved);
  } catch (error) {
    if (error.code === MONGO_DUPLICATED_ERROR) {
      return response.status(400).json({message: "Email is already in use"})
    }
  }
  return response.status(500).json({message: "Internal Server Error"})
}

//Get all users
export const getUsers = async (request, response) => {
  try {
    const { email, rol } = request.query;
  const filters = {
    ...email && { email },
    ...rol && { rol }
  }
  const userGet = await Users.find(filters);
  return response.status(200).json(userGet);
  } catch (error) {
    return response.status(500).json({message: "Internal Server Error"})
  }
}

//Get user
export const getUsersById = async (request, response) => {
  let userGetById = {};
  try {
    userGetById = await Users.findById(request.params.usersId);    
    if (mongoose.isValidObjectId(userGetById)) {
      return response.status(200).json(userGetById);  
    } else {
      return response.status(422).json({message: "Invalid Id"});
    }
  } catch (error) {
    if (error || !userGetById) {
      return response.status(400).json({message: "Invalid Id or Id does not exist"});
    }
  }
}

//Update user
export const updateUsersById = async (request, response) => {
  let userUpdate = {};
  try {
    userUpdate = await Users.findByIdAndUpdate(request.params.usersId, request.body, {
      new: true
    });
    if (mongoose.isValidObjectId(userUpdate)) {
      return response.status(200).json(userUpdate);
    } else {
      return response.status(422).json({message: "Invalid Id"});
    }
  } catch (error) {
    if (error || !userUpdate) {
      return response.status(400).json({message: "Invalid Id or Id does not exist"});
    }
  }
}

//Delete user
export const deleteUsersById = async (request, response) => {
  try {
    const userDelete = await Users.findByIdAndDelete(request.params.userId);
    return response.status(200).json("user deleted");
  } catch (error ) {
    if (error || !userDelete) {
      return response.status(400).json({message: "Invalid Id or Id does not exist"});
    }
  }
}