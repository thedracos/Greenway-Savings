require ('dotenv').config();
const Sequelize = require('sequelize');

const savingsDbUrl = process.env.DB_URI;
// initially: existing URI from main repo?
// later: split out to separate db instances?

const sequelize = new Sequelize(savingsDbUrl, {
  dialect: 'postgres'
});

const User = sequelize.define('user', {
  //  id is added by default, incrementing from 1
  //  is it already the primary key for the expense model to associate to?
  //  can confirm after user name is passed in with expense record
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  income: Sequelize.INTEGER,
  frequency: Sequelize.STRING,
  date: Sequelize.DATE
});

const Saving = sequelize.define('saving', {
  item: Sequelize.STRING,
  cost: Sequelize.INTEGER
})

Saving.belongsTo(User);
User.hasMany(Saving, {foreignKey: 'userId', sourceKey: 'id'})

// connect new instance for Saving to User table in original main db?

// or, initially connect to same db
  // this will risk issues with connections limits, right?



const updateSavings = (params, callback) => {
  console.log('this is params', params)
  Saving.update({ cost: params.cost }, { where: { userId: params.userId, item: params.item} })
  .catch(err => {
    console.warn('Error updating Saving record in DB ', err);
  })
}

const getSavings = params => Saving.findAll({
  where: {
    userId: params.userId
  }
  // catch?
})

const saveSavingItem = params => {
  const { userId, item, cost } = params;
  User.find({})
  Saving.upsert({
    userId, item, cost
  })
  .then(() => {
    console.log('Saved Saving record into DB');
  })
  // catch?
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Saving database connection established');
  })
  .catch(err => {
    console.error('Saving database connection error: ', err);
  });

sequelize.sync();

module.exports.getSavings = getSavings;
module.exports.saveSavingItem = saveSavingItem;
module.exports.updateSavings = updateSavings;