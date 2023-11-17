const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const { Organization, CustomItemType } = require('../models/Organization');
const { dummyOrganizations, dummyCustomItemTypes, dummyEmployees } = require('./dummyData');
const envVariable = require('../config/envVariables');
const { generateHashedPassword } = require('../utils/globalFunctions');


const addDummyDataToDatabase = async () => {
  try {
    // Dummy organizations
    await Promise.all(dummyOrganizations.map(async (orgData) => {
        orgData.password = await generateHashedPassword(orgData.password);
        const org = await Organization.findOneAndUpdate({ code: orgData.code }, orgData, { upsert: true });
    //   await org.save()
    //   await Organization.create( orgData);
    }));

    // Dummy custom item types
    await Promise.all(dummyCustomItemTypes.map(async (itemTypeData) => {
        await Promise.all(dummyOrganizations.map(async (orgData) => {
            const org = await Organization.findOne({ code: orgData.code });
            itemTypeData.organization = org._id;
            const type = await CustomItemType.findOneAndUpdate({ name: itemTypeData.name }, itemTypeData, { upsert: true });
            // console.log(type, "hello")
            // check if type._id is in org.customItemTypes
            if (!org.customItemTypes.includes(type._id)) {
                org.customItemTypes.push(type._id);
                await org.save();
            }
        }));
    }));


    // Dummy employees
    await Promise.all(dummyEmployees.map(async (employeeData) => {
      await Employee.findOneAndUpdate({ email: employeeData.email }, employeeData, { upsert: true });
    }));

    console.log('Dummy data added to the database successfully.');
    return
  } catch (error) {
    console.error('Error adding dummy data to the database:', error);
    return
  }
};

const dropDummyDataFromDatabase = async () => {
    try {
        // Dummy organizations
        await Promise.all(dummyOrganizations.map(async (orgData) => {
            await Organization.findOneAndDelete({ code: orgData.code })
        }))

        // Dummy custom item types
        await Promise.all(dummyCustomItemTypes.map(async (itemTypeData) => {
            await CustomItemType.findOneAndDelete({ name: itemTypeData.name })
        }))

        // Dummy employees
        await Promise.all(dummyEmployees.map(async (employeeData) => {
            await Employee.findOneAndDelete({ email: employeeData.email })
        }))

        console.log('Dummy data removed from the database successfully.');
        return
    } catch (error) {
        console.error('Error removing dummy data to the database:', error);
        return
    }           
}



// Run the function
(async () => {
    const connection = await mongoose.connect(envVariable.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    // await addDummyDataToDatabase();
    // await dropDummyDataFromDatabase();
    console.log(await Organization.find({}))
    connection.connection.close(); // Close the database connection when done
})();