export type SignInState = {
  success: boolean;
  message: string | null;
  error: string | null;
};

export const initialState: SignInState = {
  success: false,
  message: null,
  error: null,
};
