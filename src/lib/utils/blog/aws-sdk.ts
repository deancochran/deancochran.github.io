import * as AWS from "aws-sdk";

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:98d7ee71-441c-425c-a61b-649a173193be',
});



