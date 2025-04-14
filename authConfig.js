// Auth0 configuration

export const auth0Domain = "dev-w3p1twys85rx8ekx.us.auth0.com" // Replace with your Auth0 domain
export const auth0ClientId = "u5hqWLFwHEW2aUFfY1G214ZUnlHVMUPD" // Replace with your Auth0 client ID

// Audience is required for getting access tokens
export const auth0Audience = `https://${auth0Domain}/api/v2/`

// Scopes define what information we want to access
export const auth0Scope = "openid profile email offline_access"
