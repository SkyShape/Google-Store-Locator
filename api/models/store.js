const mongoose = require('mongoose');
const { Schema } = mongoose;

const storeSchema = new Schema ({
    storeName: String,
    phoneNumber: String,
    address:  {},
    openStatusText: String,
    addressLines: Array,
    location: {
        type: {
          type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
      }
})

storeSchema.index({location: '2dsphere'}, {sphere: true});

module.exports = mongoose.model('Store', storeSchema);