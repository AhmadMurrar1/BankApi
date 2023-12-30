import STATUS_CODE from "../constants/statusCodes.js";
import { readusersFromFile, writeusersToFile } from "../models/usersModel.js";
import { v4 as uuidv4 } from "uuid";

// ------------------------------------------------------------------------------------------------

export const getAllusers = async (req, res, next) => {
  try {
    const users = readusersFromFile();
    res.send(users);
  } catch (error) {
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------

export const getusersById = async (req, res, next) => {
  try {
    const users = readusersFromFile();
    const user = users.find((m) => m.id === req.params.id);
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("user was not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------

export const createusers = async (req, res, next) => {
  try {
    const { name, cash } = req.body;
    if ( !name || !cash ) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "All fields are required"
      );
    }

    const users = readusersFromFile();
    if (users.some((u) => u.name === name)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("A user with the same name already exists");
    }

    const newUser = { id: uuidv4(), name,cash };
    users.push(newUser);
    writeusersToFile(users);
    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------

export const updateusers = async (req, res, next) => {
  try {
    const { name, cash } = req.body;
    if ( !name || !cash ) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "All fields are required"
      );
    }
    const users = readusersFromFile();
    const index = users.findIndex(u=> u.id === req.params.id)
    if(index === -1){
        res.status(STATUS_CODE.NOT_FOUND)
        throw new Error("user was not found!")
    }
    const lastIndex = users.findLastIndex(u => u.name === name)
    if(lastIndex != -1 && lastIndex != index){
        res.status(STATUS_CODE.BAD_REQUEST)
        throw new Error("cant edit to have similar user name")
    }

    const updatedusers = {...users[index],name,cash}
    users[index] = updatedusers;
    writeusersToFile(users)
    res.send(updatedusers);
  } catch (error) {
    next(error)
  }
};
// ------------------------------------------------------------------------------------------------


export const deleteusers = async (req, res, next) => {
  try {
    const users = readusersFromFile();
    const newusersList = users.filter((user) => user.id !== req.params.id);

    if (newusersList.length === users.length) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("user was not found");
    }
    writeusersToFile(newusersList);
    res
      .status(STATUS_CODE.OK)
      .send(`user with the id of ${req.params.id} was deleted!`);
  } catch (error) {
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------


export const withdrawusers = async (req, res, next) => {
  try {
    const { cash } = req.body;
    if (!cash) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("All fields are required");
    }
    const users = readusersFromFile();
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found!");
    }

    const withdrawAmount = parseFloat(cash); 

    if (users[index].cash < withdrawAmount) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Insufficient funds");
    }

    const updatedCash = users[index].cash - withdrawAmount;
    users[index].cash = updatedCash;

    writeusersToFile(users);
    res.send({ ...users[index], cash: updatedCash });
  } catch (error) {
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------

export const despositusers = async (req, res, next) => {
  try {
    const { cash } = req.body;
    if (!cash) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Cash amount is required for deposit");
    }

    const users = readusersFromFile();
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found!");
    }

    const depositAmount = parseFloat(cash); // Convert to number if it's a string

    if (depositAmount <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Deposit amount must be greater than zero");
    }

    const updatedCash = users[index].cash + depositAmount;
    users[index].cash = updatedCash;

    writeusersToFile(users);
    res.send({ ...users[index], cash: updatedCash });
  } catch (error) {
    next(error);
  }
};
// ------------------------------------------------------------------------------------------------

export const transusers = async (req, res, next) => {
  try {
    const transferAmount = parseFloat(req.body.amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Invalid or zero transfer amount");
    }

    const users = readusersFromFile();
    const senderIndex = users.findIndex((u) => u.id === req.params.id);

    if (senderIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("Sender was not found!");
    }

    if (users[senderIndex].cash < transferAmount) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Insufficient funds");
    }

    const receiver = users.find((user, index) => index !== senderIndex);
    
    if (!receiver) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR);
      throw new Error("No suitable receiver found");
    }

    const receiverIndex = users.indexOf(receiver);

    users[senderIndex].cash -= transferAmount;
    users[receiverIndex].cash += transferAmount;

    writeusersToFile(users);
    res.send({
      receiver: { ...users[receiverIndex] }, // receiver's details
      sender: { ...users[senderIndex] }, // sender's details
    });
  } catch (error) {
    next(error);
  }
};

