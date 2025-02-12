"use strict";
require("dotenv").config();
// const port2 = process.env.PORT2 || 3001;
// const io = require("socket.io-client");
// let host = `http://localhost:${port2}/`;
// const userConnection = io.connect(host);
// const base64 = require('base-64');
const { userModel } = require('../models/index');


//_____________________
const express = require('express');
const dataModules = require('../models');
const {users,posts,jobcomments,jobs,comments}=require('../models/index')
//-------------
// const esraa=(`this is a new notification from.....${users.id} `)
// let fun =async (req, res, next) => {

  // if (!req.headers.authorization) { return _authError(); }

//   let basic = req.headers.authorization.split(' ').pop();
//   let [user, pass] = base64.decode(basic).split(':');
//   req.user = await userModel.authenticateBasic(user, pass)
//   console.log(req.user)
// }
// fun()

// io.on('new_comment',() => {
//   console.log("New comment on post");
// });











const router = express.Router();

router.param("model", (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next("Invalid Model");
  }
});

router.get('/:model',handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);
router.get('/jobs/:id/jobcomments', jobComments);
router.get('/posts/:id/comments', postComments);
router.get("/users/:id/:model", userRecords);

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

}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}



module.exports = router;
