const Table = require('../models/Table')

const createTables = async (req, res)=>{
  const { number } = req.body
  const array = []
  for (let i = 1; i < number + 1; i++) {
    array.push({ number:i, name:''})
  }
  try {
    const tables = await Table.insertMany(array)
    return res.status(201).json({ message:'Table oluşturuldu', success: true, tables })
  } catch (error) {
    console.log(error);
		return res.status(404).json({ message: 'Tablo oluşturulamadı', success: false })
  }

}


module.exports = {
  createTables
}