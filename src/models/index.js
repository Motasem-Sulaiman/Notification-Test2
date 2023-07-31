"use strict";
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const Collection = require("./data-collection.js");
const postsModel = require("./posts/model.js");
const commentsModel = require("./comments/model.js");
const userModel = require("../../src/auth/models/users.js");
const JobsModel = require("./jobs/model");
const jobComments = require("./jobcomments/model.js");
const notificationModel=require('./notifications/model.js')

const POSTGRESS_URI =
  process.env.NODE_ENV === "test"
    ? "sqlite::memory:"
    : process.env.DATABASE_URL;

let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
 console.log(POSTGRESS_URI)
 console.log(sequelizeOptions)
let sequelize = new Sequelize(POSTGRESS_URI, sequelizeOptions);


const posts = postsModel(sequelize, DataTypes);
const jobcomments = jobComments(sequelize, DataTypes);
const comment = commentsModel(sequelize, DataTypes);
const jobs = JobsModel(sequelize, DataTypes);
const user=userModel(sequelize,DataTypes)
const notification=notificationModel(sequelize,DataTypes)

notification.belongsTo(user, { foreignKey: "sender_id", as: "sender" });
user.hasMany(notification, {
  foreignKey: "sender_id",
  as: "sentnotifications",
});
notification.belongsTo(user, {
  foreignKey: "receiver_id",
  as: "receiver",
});
user.hasMany(notification, {
  foreignKey: "receiver_id",
  as: "receivednotifications",
});
notification.belongsTo(posts, { foreignKey: "post_id" });
posts.hasMany(notification, { foreignKey: "post_id" });
notification.belongsTo(jobs, { foreignKey: "job_id" });
jobs.hasMany(notification, { foreignKey: "job_id" });
notification.belongsTo(jobcomments, { foreignKey: "job_comment_id" });
jobcomments.hasMany(notification, { foreignKey: "job_comment_id" });
notification.belongsTo(comment, { foreignKey: "comment_id" });
comment.hasMany(notification, { foreignKey: "comment_id" });



user.hasMany(posts, { foreignKey: "user_id" });
posts.belongsTo(user, { foreignKey: "user_id" });

jobs.hasMany(jobcomments, { foreignKey: "job_id" });
jobcomments.belongsTo(jobs, { foreignKey: "job_id" });

posts.hasMany(comment, { foreignKey: "post_id" });
comment.belongsTo(posts, { foreignKey: "post_id" });


user.hasMany(jobs, { foreignKey: "user_id" });
jobs.belongsTo(user, { foreignKey: "user_id" });



module.exports = {
  db: sequelize,
  posts: new Collection(posts),
  comments: new Collection(comment),
  users: new Collection(user),
  jobcomments: new Collection(jobcomments),
  jobs: new Collection(jobs),
  userModel: user,
  notification:new Collection(notification),
  notificationModel:notification
};
