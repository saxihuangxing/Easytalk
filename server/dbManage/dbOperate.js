var tutorScheme = require("./tutorScheme.js");
var adminScheme = require("./adminScheme.js");
var studentScheme = require("./studentScheme.js");
var Logger = require("../utils/Logger");

class DbOperator {
  add(params) {
    //console.log("dbadd:" + JSON.stringify(params) + "  contruct = " + this.Module.constructor);
    var module = new this.Module(params);
    return new Promise((resolve, reject) => {
      module.save(function (err, res) {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
  }

  findLimiteFiledsPromise(query, projection) {
    return new Promise((resolve, reject) => {
      this.Module.find(query, projection, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  findOneLimiteFiledsPromise(query, projection) {
    return new Promise((resolve, reject) => {
      this.Module.findOne(query, projection, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  findPromise(query) {
    return new Promise((resolve, reject) => {
      this.Module.find(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  findOnePromise(query) {
    return new Promise((resolve, reject) => {
      this.Module.findOne(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  remove(query) {
    this.Module.remove(query, function (err, res) {
      if (err) {
        Logger.error(`db remove ${JSON.stringify(err)}`);
      } else {
        //console.log("Res:" + res);
      }
    });
  }

  updateOne(query, data) {
    return new Promise((resolve, reject) => {
      this.Module.updateOne(query, data, function (err, res) {
        if (err) {
          Logger.error(`db updateOne ${JSON.stringify(err)}`);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }


  updateOneOrAdd(query, data) {
    return new Promise(async (resolve, reject) => {
        this.Module.findOneAndUpdate(query, data, {upsert:true}, function (err, res) {
          if (err) {
            Logger.error(`db updateOneOrAdd ${JSON.stringify(err)}`);
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  }

  async exist(query) {
    try {
      let res = await this.count(query);
      if (res > 0) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  count(query) {
    return new Promise((resolve, reject) => {
      this.Module.count(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

module.exports = (moduleType) => {
  let dbOperator = new DbOperator();
  switch (moduleType) {
    case "tutor":
      dbOperator.Module = tutorScheme;
      break;
    case "admin":
      dbOperator.Module = adminScheme;
      break;
    case "student":
      dbOperator.Module = studentScheme;
      break;
    default:
      dbOperator.Module = tutorScheme;
      break;
  }
  return dbOperator;
};
