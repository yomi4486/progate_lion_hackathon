// import {
//   CognitoIdentityProviderClient,
//   GlobalSignOutCommand,
// } from "@aws-sdk/client-cognito-identity-provider";
//
// const cognitoClient = new CognitoIdentityProviderClient({
//   region: process.env.COGNITO_REGION!,
// });
//
// export const logoutUser = async (accessToken: string) => {
//   const command = new GlobalSignOutCommand({ AccessToken: accessToken });
//   await cognitoClient.send(command);
// };
