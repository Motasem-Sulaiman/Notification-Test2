"use strict";
require("dotenv").config();
const SECRET = process.env.SECRET || 'secretstring';
const port2 = process.env.PORT2 || 3001;
const io = require("socket.io-client");
let host = `http://localhost:${port2}/`;
const userConnection = io.connect(host);
// const base64 = require('base-64');
const jwt = require("jsonwebtoken");

// const { userModel } = require('../models/index');
////////////////////////////////////////////

const express = require("express");
const dataModules = require("../models");
const bearerAuth = require("../auth/middleware/bearer");
const permissions = require("../auth/middleware/acl");
const {
  users,
  user,
  posts,
  jobcomments,
  jobs,
  comments,
} = require("../models/index");
// const checkId = require("../auth/middleware/checkId");

const router = express.Router();

// async function  get(req,res){
//   const postId = await posts.get(req.params.id);
//   console.log(postId)
// }
// get()
// let fun =async (req, res, next) => {

//   if (!req.headers.authorization) { return _authError(); }

//   let basic = req.headers.authorization.split(' ').pop();
//   let [user, pass] = base64.decode(basic).split(':');
//   req.user = await userModel.authenticateBasic(user, pass)
//   console.log(req.user)
// }
// fun()
// checkId()

router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next("Invalid Model");
  }
});

router.get("/:model", bearerAuth, permissions("read"), handleGetAll);
router.get("/:model/:id", bearerAuth, permissions("read"), handleGetOne);
router.post("/:model", bearerAuth, permissions("create"), handleCreate);
router.put("/:model/:id", bearerAuth, permissions("update"), handleUpdate);
router.delete("/:model/:id", bearerAuth, permissions("delete"), handleDelete);
router.get(
  "/jobs/:id/jobcomments",
  bearerAuth,
  permissions("read"),
  jobComments
);
router.get(
  "/posts/:id/comments",
  bearerAuth,
  permissions("read"),
  postComments
);
router.get("/jobs/:id/jobcomments", bearerAuth, jobComments);
router.get("/posts/:id/comments", bearerAuth, postComments);

async function jobComments(req, res) {
  const jobId = parseInt(req.params.id);
  let jcomments = await jobs.getUserPosts(jobId, jobcomments.model);
  res.status(200).json(jcomments);
}
async function postComments(req, res) {
  const postId = parseInt(req.params.id);
  let pcomments = await posts.getUserPosts(postId, comments.model);
  res.status(200).json(pcomments);
}

router.get("/users/:id/:model", bearerAuth, permissions("read"), userRecords);

async function userRecords(req, res) {
  const userId = parseInt(req.params.id);
  let userRecord = await users.getUserPosts(userId, req.model.model);
  res.status(200).json(userRecord);
}

async function jobComments(req, res) {
  const jobId = parseInt(req.params.id);
  let jcomments = await jobs.getUserPosts(jobId, jobcomments.model);
  res.status(200).json(jcomments);
}
async function postComments(req, res) {
  const postId = parseInt(req.params.id);
  let pcomments = await posts.getUserPosts(postId, comments.model);
  res.status(200).json(pcomments);
}

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
  // userConnection.emit('esraa',esraa)
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
  const token = req.headers.authorization.split(" ").pop();

  const parsedToken = jwt.verify(token, SECRET);
  // const user1 = await users.get(req.body.user_id);

  console.log(parsedToken.username);
  // console.log("---------------------------------------->",user1['dataValues'].username)
  const test=(`this is new notification from ${parsedToken.username}`)
  userConnection.emit("test", test);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
  // const postId = await posts.get(req.params.id);
  // const postUserId = postId["dataValues"].user_id;
  // // const userId = req.user.dataValues.id;
  // const username=await users.get({where:{user_id:obj.user_id}})

  // const esraa=(postUserId)
 
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
