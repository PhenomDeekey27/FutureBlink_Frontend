import React from "react";
import MainComponent from "../components/MainComponent";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
} from "@clerk/clerk-react";
import { RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./auth/SignInPage";

const App = () => {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
      <Routes>
      <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <MainComponent />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

<Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;
