export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "STRIPE_ID" }),
  },
};
