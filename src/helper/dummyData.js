const dummyOrganizations = [
    {
      name: "Organization One",
      code: "ORG1ONE",
      email: "org1@example.com",
      password: "org1password",
      policies: {
        reimbusmentLimit: "50000",
      },
      accounts: [
        {
          bankName: "Bank One",
          accountName: "Account One",
          accountNumber: 1234567890,
        },
        // Add more accounts if needed
      ],
      cards: [
        {
          cardName: "Card One",
          cardNumber: 1234567890123456,
          expiry: "12/24",
        },
        // Add more cards if needed
      ],
      walletBalance: 1000000,
    },
    {
      name: "Organization Two",
      code: "ORG2TWO",
      email: "org2@example.com",
      password: "org2password",
      policies: {
        reimbusmentLimit: "70000",
      },
      accounts: [
        {
          bankName: "Bank Two",
          accountName: "Account Two",
          accountNumber: 9876543210,
        },
        // Add more accounts if needed
      ],
      cards: [
        {
          cardName: "Card Two",
          cardNumber: 9876543210987654,
          expiry: "09/25",
        },
        // Add more cards if needed
      ],
      walletBalance: 200000,
    },
];


// const dummyOrganizations = [
//     {
//         name: "Organization One",
//         code: "ORG1ONE",
//         email: "org1@example.com",
//         password: "org1password",
//     },
//     {
//         name: "Organization Two",
//         code: "ORG2TWO",
//         email: "org2@example.com",
//         password: "org2password",
//     }
// ]

const dummyCustomItemTypes = [
    {
      name: "hotel",
      description: "Description for Item Type One",
    },
    {
      name: "flight",
      description: "Description for Item Type Two",
    },
];


const dummyEmployees = [
    {
      firstName: "John",
      lastName: "Doe",
      active: true,
      email: "john.doe@org1.com",
      password: "employee1password",
      organizationCode: "ORG1ONE",
      role: "Staff",
      walletBalance: 0,
      accounts: [
        {
          bankName: "BANK ONE",
          accountName: "ACCOUNT ONE",
          accountNumber: 1234567890,
        },
        // Add more accounts if needed
      ],
      reimbursementRequests: [],
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      active: true,
      email: "jane.smith@org1.com",
      password: "employee2password",
      organizationCode: "ORG1ONE",
      role: "Receptionist",
      walletBalance: 0,
      accounts: [
        {
          bankName: "BANK ONE",
          accountName: "ACCOUNT TWO",
          accountNumber: 9876543210,
        },
        // Add more accounts if needed
      ],
    },
    {
      firstName: "Bob",
      lastName: "Johnson",
      active: true,
      email: "bob.johnson@org2.com",
      password: "employee3password",
      organizationCode: "ORG2TWO",
      role: "Staff",
      walletBalance: 0,
      accounts: [
        {
          bankName: "BANK TWO",
          accountName: "ACCOUNT THREE",
          accountNumber: 111122223333,
        },
        // Add more accounts if needed
      ],
    },
    {
      firstName: "Alice",
      lastName: "Williams",
      active: true,
      email: "alice.williams@org2.com",
      password: "employee4password",
      organizationCode: "ORG2TWO",
      role: "Staff",
      walletBalance: 0,
      accounts: [
        {
          bankName: "BANK TWO",
          accountName: "ACCOUNT FOUR",
          accountNumber: 444455556666,
        },
        // Add more accounts if needed
      ],
    },
  ];
  
  module.exports = dummyEmployees;
  
  
module.exports = {
    dummyOrganizations,
    dummyCustomItemTypes,
    dummyEmployees,
}
