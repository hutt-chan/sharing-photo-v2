const mongoose = require('mongoose');
const User = require('./userModel');
const Photo = require('./photoModel');
const SchemaInfo = require('./schemaInfo');
require('dotenv').config();

const modelData = {
  users: [
    { first_name: "John", last_name: "Doe", location: "New York", description: "Photographer", occupation: "Artist" },
    { first_name: "Jane", last_name: "Smith", location: "London", description: "Traveler", occupation: "Blogger" },
  ],
  photos: [
    {
      file_name: "photo1.jpg",
      date_time: new Date(),
      user_id: null, // Sẽ ánh xạ sau khi insert
      comments: [{ comment: "Nice!", date_time: new Date(), user_id: null }],
    },
  ],
  schemaInfo: [{ version: 1 }],
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Xóa toàn bộ dữ liệu cũ trước khi chèn mới
    await Promise.all([
      User.deleteMany({}),
      Photo.deleteMany({}),
      SchemaInfo.deleteMany({}),
    ]);

    // Insert users và lấy _id tự động
    const users = await User.insertMany(modelData.users);
    const userMap = {};
    users.forEach((user, index) => userMap[index + 1] = user._id); // Ánh xạ 1 -> _id của John, 2 -> _id của Jane

    // Cập nhật photos với user_id hợp lệ
    const updatedPhotos = modelData.photos.map(photo => ({
      ...photo,
      user_id: userMap[1], // Gán user_id của John (index 1)
      comments: photo.comments.map(comment => ({
        ...comment,
        user_id: userMap[2], // Gán user_id của Jane (index 2)
      })),
    }));

    // Chỉ chèn photos và schemaInfo (không chèn lại users)
    await Promise.all([
      Photo.insertMany(updatedPhotos),
      SchemaInfo.insertMany(modelData.schemaInfo),
    ]);

    console.log('Data loaded successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });