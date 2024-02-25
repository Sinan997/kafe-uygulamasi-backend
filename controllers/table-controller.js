const Table = require('../models/Table');

const addTable = async (req, res) => {
  const { name } = req.body;
  const businessId = req.user.businessId;
  try {
    if (!name) {
      return res.status(406).json({ code: 'MISSING_FIELDS', message: 'Fill required places.' });
    }

    const isNameExist = await Table.findOne({ name, businessId });

    if (isNameExist) {
      return res.status(406).json({
        code: 'NAME_EXIST',
        data: { name },
        message: `${name} is already used`,
      });
    }

    await new Table({ name, businessId }).save();

    return res.status(201).json({
      code: 'TABLE_CREATED',
      message: 'Table created succesfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

const getAllTables = async (req, res) => {
  const businessId = req.user.businessId;
  try {
    const tables = await Table.find({ businessId }, { businessId: 0, __v: 0 })
    
    return res.status(200).json({ tables });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
  }
};

// const deleteBusiness = async (req, res) => {
//   const { id } = req.body;
//   try {
//     // DELETE BUSINESS
//     const business = await Business.findByIdAndDelete(id);
//     if (!business) {
//       return res.status(404).json({ code: 'BUSINESS_NOT_FOUND', message: 'Business not found.' });
//     }
//     // DELETE OWNER
//     await User.findByIdAndDelete(business.ownerId);

//     // DELETE WAITERS
//     await User.deleteMany({ businessId: id });

//     // DELETE CATEGORIES
//     await Categories.deleteMany({ businessId: id });

//     // DELETE PRODUCTS
//     await Product.deleteMany({ businessId: id });

//     return res
//       .status(200)
//       .json({ code: 'BUSINESS_DELETED', message: 'Business deleted succesfully.' });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
//   }
// };

// const updateBusiness = async (req, res) => {
//   const { _id, ownerId, name, email, password } = req.body;
//   try {
//     const updateObject = { email };
//     if (password) {
//       const hashedPw = await bcrypt.hash(password, 10);
//       updateObject.password = hashedPw;
//     }
//     const isBusinessExist = await Business.findOne({ name });
//     if (isBusinessExist) {
//       return res
//         .status(406)
//         .json({ code: 'NAME_EXIST', data: { name }, message: `${name} is already used` });
//     }

//     const isEmailExist = await User.findOne({ email });
//     console.log(isEmailExist);
//     if (isEmailExist) {
//       return res
//         .status(406)
//         .json({ code: 'EMAIL_EXIST', data: { email }, message: `${email} is already used` });
//     }

//     await Business.findByIdAndUpdate(_id, { name });
//     await User.findByIdAndUpdate(ownerId, updateObject);

//     return res
//       .status(200)
//       .json({ code: 'BUSINESS_UPDATED', message: 'Business updated successfully.' });
//   } catch (error) {
//     return res.status(500).json({ code: 'SERVER_ERROR', message: 'Server failed.' });
//   }
// };

module.exports = {
  addTable,
  getAllTables,
  // deleteBusiness,
  // updateBusiness,
};
