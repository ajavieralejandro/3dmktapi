const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const factory = require('../../utils/handlerFactory');

exports.getUser = factory.getOne(User);
exports.updateUser = catchAsync(async (req,res,next)=>{
  const filterObj = factory.filterObject(req.body,'name','email','risk_status');  
  let doc = await User.findOneAndUpdate({_id : req.user._id}, filterObj, {
    new: true,
    runValidators: true
  });
  if (!doc)
    return next(new AppError("Doesn't found a user with that id, please login again", 404));
  res.status(200).send({
    message: 'success',
    data: doc
  });

})
exports.deleteUser = factory.deleteById(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findOneAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.addFriend = catchAsync(async (req, res, next) => {
  let contacts = await Contact.findOne({user : req.user._id});
  contacts.contacts.push(req.contact_id);
  await contacts.save();
  res.status(204).json({
    status: 'success',
    data: contacts
  });
  
});

exports.findFriends = catchAsync(async (req, res, next) => {
  let {name} = req.body;
  let users = await User.find({ name: { $regex:name, $options: 'i'}});
  res.status(200).json({
    status: 'success',
    data : {
      users
    }
  });
    
});

exports.getContactsWithin = catchAsync(async (req,res,next)=>{
  console.log("Aca pasa algo");
  console.log(req.user.currentLocation);
  const [long,lat] = req.user.currentLocation.coordinates;
  const radius = 30/6378.1;
  console.log(long,lat,radius);
  console.log("Quiero ver que onda");
  const aux = Date.now();

  //debugin code

  //let {currentLocationDate} = req.user;
  console.log("current Location date es : ",req.user.currentLocationDate);
  let aux2  = (req.user.currentLocationDate - (new Date()-30*600000));
  console.log(aux2);

  const users = await User.find({currentLocation : {$geoWithin : {
    $centerSphere : [[long,lat],radius],
  },
}

})

console.log(req.user.currentLocationDate);
console.log("A ver ahora : ",req.user.currentLocationDate>new Date()-35*6000);
const userAux = await User.find({ currentLocationDate: {$lte: (new Date()-35*60000)}});
console.log(userAux);
 next();
});


exports.calculateRisk = catchAsync(async (req,res,next)=>{
  
})






