const mongoose = require("mongoose");
const redis = reuire("redis");
const util = reuire("util");
const keys = require("../config/keys");

const client = redis.createClient(redisURL);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "");
    return this
}

mongoose.Query.prototype.exec = async function() {

    if (!this.useCache) return await exec.apply(this, arguments);

    const key =JSON.stringify(Object.assign({},this.getQuery, {
        collection: this.mongooseCollection.name
    }));

    const cachedValue= await client.hget(this.hashKey, key)
    if(cachedValue){
        const doc = JSON.parse(cachedValue)
        const blogs = Array.isArray(doc) ? doc.map(docItem => new this.model(docItem)) : new this.model(doc) 
        return blogs;
    } else{
        const result = await exec.apply(this, arguments);
        client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
        return result
    }


}

module.exports = {
    clearHash(hasKey) {
        client.del(JSON.stringify(hasKey));
    }
}