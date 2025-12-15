console.log('=== Debugging Reddit Backend ===\n');

// Test 1: Check if userController.js exists and can be loaded
try {
  console.log('1. Testing userController...');
  const userController = require('./users/userController');
  console.log('✅ userController loaded successfully');
  
  // Check exports
  const exportsToCheck = [
    'getAllUsers', 'getUserById', 'createUser', 
    'updateUser', 'deleteUser', 'signup', 'login'
  ];
  
  let allExportsFound = true;
  exportsToCheck.forEach(exportName => {
    if (userController[exportName]) {
      console.log(`   ✅ ${exportName} is exported`);
    } else {
      console.log(`   ❌ ${exportName} is NOT exported`);
      allExportsFound = false;
    }
  });
  
  if (allExportsFound) {
    console.log('✅ All userController exports are present');
  }
} catch (error) {
  console.log(`❌ Error loading userController: ${error.message}`);
}

console.log('\n2. Testing server.js dependencies...');
try {
  // Check if all route files exist
  const routes = [
    './users/userRoute',
    './messages/messageRoute',
    './posts/postRoute',
    './comments/commentRoute',
    './communities/communityRoute',
    './notifications/notificationRoute'
  ];
  
  routes.forEach(routePath => {
    try {
      require(routePath);
      console.log(`✅ ${routePath} exists`);
    } catch (error) {
      console.log(`❌ ${routePath} not found: ${error.message}`);
    }
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
}

console.log('\n3. Testing database connection...');
try {
  const mongoose = require('mongoose');
  console.log('✅ mongoose is available');
} catch (error) {
  console.log(`❌ mongoose error: ${error.message}`);
}

console.log('\n=== Debug complete ===');