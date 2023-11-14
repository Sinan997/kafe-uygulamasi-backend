const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');

const startDB = async () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    Business.findOne({ name: 'atkafasi' }).then((business) => {
      if (!business) {
        Business.create({ name: 'atkafasi' }).then((createdBusiness) => {
          User.findOne({ username: 'atkafasi.admin' }).then((user) => {
            if (!user) {
              bcrypt.hash('123', 10).then(async (hashedPw) => {
                const user = new User({
                  username: 'atkafasi.admin',
                  role: 'admin',
                  password: hashedPw,
                  businessId: createdBusiness._id,
                });
                const user2 = new User({
                  name: 'Sinan',
                  surname: 'Öztürk',
                  username: 'sinan.ozturk',
                  role: 'waiter',
                  password: hashedPw,
                  businessId: createdBusiness._id,
                });

                const adminuser = await user.save()
                await createdBusiness.addToUsers(adminuser._id);
                const garsonuser = await user2.save()
                await createdBusiness.addToUsers(garsonuser._id);

                console.log('development için atkafasi.admin ve user oluşturuldu');
              });
            }
          });
        });
      }
    });
  });
};

module.exports = {
  startDB,
};
