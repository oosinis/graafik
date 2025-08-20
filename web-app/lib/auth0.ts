// Temporary placeholder Auth0 client while auth package disabled
export const auth0 = {
  middleware: async (_req: any) => new Response(null),
  getSession: async () => ({ user: null }),
};