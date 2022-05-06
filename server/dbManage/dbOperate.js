let tutorScheme = require("./tutorScheme.js");
let adminScheme = require("./adminScheme.js");
let studentScheme = require("./studentScheme.js");
let lessonScheme = require("./lessonScheme.js");
let walletScheme = require("./walletScheme.js");
let topupApplySchema = require("./topupApllySchema.js");
let Logger = require("../utils/Logger");

class DbOperator {
  add(params,session) {
    if(session){
      return this.Module.create(params, {session: session});
    }else{
      return this.Module.create(params);
    }
    /*const module = new this.Module(params).session(session);
    return new Promise((resolve, reject) => {
      module.save(function (err, res) {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });*/

  }

  findLimiteFiledsPromise(query, projection) {
    return  this.Module.find(query, projection);
/*     return new Promise((resolve, reject) => {
      this.Module.find(query, projection, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }); */
  }

  findOneLimiteFiledsPromise(query, projection) {
    return  this.Module.findOne(query, projection);
   /*  return new Promise((resolve, reject) => {
      this.Module.findOne(query, projection, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }); */
  }

  remove(query) {
    return new Promise((res,rej) => {
      this.Module.remove(query, function (err, res) {
        if (err) {
          Logger.error(`db remove ${JSON.stringify(err)}`);
          rej(err);
        } else {
          res()
        }
      });
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
      })
    });
  }


  update(query, data) {
    return new Promise((resolve, reject) => {
      this.Module.update(query, data, function (err, res) {
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
    case "lesson":
        dbOperator.Module = lessonScheme;
        break;
    case "wallet":
        dbOperator.Module = walletScheme;
        break;
    case "topupApply":
        dbOperator.Module = topupApplySchema;
        break;        
    default:
      dbOperator.Module = tutorScheme;
      break;
  }
  return dbOperator;
};
