const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const schema = mongoose.Schema;

const user = new schema({

    name:
        { type: String, unique: true }
    ,
    password: {
        type: String
    },
    about: {
        type: String
    }
    , token: [{
        tokens: {
            type: String,
            required: true
        }
    }]

})

user.methods.gen = async function () {

    const token = jwt.sign({ _id: this._id }, "helloiamhimansukuamrsharmaroomdekhoisagoodap")


    this.token = this.token.concat({ tokens: token })
    
    await this.save()
 
    return token
}

user.pre('save', function (next) {

    if (this.isModified('password')) {

        this.password = bcryptjs.hashSync(this.password, 10)
    }


    next()
})

const users = mongoose.model('mahuser', user)//creating the collections

module.exports = users




























































